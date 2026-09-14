type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };
type ChatQuestion = {
  id: string;
  label: string;
  multiSelect: boolean;
  options: string[];
};
type ChatResponsePayload = {
  message: string;
  questions?: ChatQuestion[];
};

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 6000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requests = new Map<string, { count: number; expiresAt: number }>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function normalizeMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) throw new Error('messages must be an array');
  const messages = value.slice(-MAX_MESSAGES).map((item) => {
    if (!item || typeof item !== 'object') throw new Error('message must be an object');
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== 'user' && role !== 'assistant') throw new Error('message role is invalid');
    if (typeof content !== 'string' || !content.trim()) throw new Error('message content must be non-empty');
    return { role, content: content.trim().slice(0, MAX_MESSAGE_LENGTH) } as Message;
  });
  if (!messages.length) throw new Error('messages must not be empty');
  return messages;
}

function allowed(event: { headers?: Record<string, string | undefined> }) {
  const now = Date.now();
  const address = event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown';
  const current = requests.get(address);
  if (!current || current.expiresAt <= now) {
    requests.set(address, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

async function callOpenAi(messages: Message[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('AI service is not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: 'Help users design reusable coding-agent skills. Return strict JSON with message and optional questions. For yes/no questions use exactly ["Yes", "No"] and multiSelect false.' },
        ...messages
      ]
    })
  });
  if (!response.ok) throw new Error('AI service request failed');
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return payload.choices?.[0]?.message?.content?.trim() ?? '';
}

function stripCodeFence(value: string): string {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

function parseChatResponsePayload(content: string): ChatResponsePayload {
  const payload = JSON.parse(stripCodeFence(content)) as {
    message?: unknown;
    questions?: unknown;
  };
  if (typeof payload.message !== 'string' || !payload.message.trim()) {
    throw new Error('message is required');
  }

  const questions = payload.questions === undefined
    ? undefined
    : Array.isArray(payload.questions)
      ? payload.questions.map((question) => {
          if (!question || typeof question !== 'object') throw new Error('question must be an object');
          const item = question as {
            id?: unknown;
            label?: unknown;
            multiSelect?: unknown;
            options?: unknown;
          };
          if (typeof item.id !== 'string' || !item.id.trim()) throw new Error('question id is invalid');
          if (typeof item.label !== 'string' || !item.label.trim()) throw new Error('question label is invalid');
          if (typeof item.multiSelect !== 'boolean') throw new Error('question multiSelect is invalid');
          if (!Array.isArray(item.options) || item.options.some((option) => typeof option !== 'string' || !option.trim())) {
            throw new Error('question options are invalid');
          }
          return {
            id: item.id.trim(),
            label: item.label.trim(),
            multiSelect: item.multiSelect,
            options: item.options.map((option) => option.trim())
          } satisfies ChatQuestion;
        })
      : (() => {
          throw new Error('questions must be an array');
        })();

  return {
    message: payload.message.trim(),
    questions
  };
}

export default async (request: Request) => {
  const headers = Object.fromEntries(request.headers.entries());
  if (!allowed({ headers })) return json({ error: 'Too many requests. Try again later.' }, 429);
  try {
    const body = await request.json() as { messages?: unknown };
    const content = await callOpenAi(normalizeMessages(body.messages));
    return json(parseChatResponsePayload(content));
  } catch {
    return json({ error: 'Unable to generate a response.' }, 400);
  }
};
