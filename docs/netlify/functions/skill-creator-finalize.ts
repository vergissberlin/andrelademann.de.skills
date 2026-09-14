type Message = { role: 'user' | 'assistant'; content: string };
const requestCounts = new Map<string, { count: number; expiresAt: number }>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function isAllowed(request: Request) {
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const current = requestCounts.get(key);
  if (!current || current.expiresAt <= now) {
    requestCounts.set(key, { count: 1, expiresAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 10) return false;
  current.count += 1;
  return true;
}

function validate(payload: unknown) {
  if (!payload || typeof payload !== 'object') throw new Error('invalid package');
  const folder = (payload as { skillFolderName?: unknown }).skillFolderName;
  const files = (payload as { files?: unknown }).files;
  if (typeof folder !== 'string' || !/^[a-z0-9-]+$/.test(folder)) throw new Error('invalid folder');
  if (!files || typeof files !== 'object' || Array.isArray(files)) throw new Error('invalid files');
  const result: Record<string, string> = {};
  for (const [path, content] of Object.entries(files as Record<string, unknown>)) {
    if (!path || path.includes('..') || path.startsWith('/') || typeof content !== 'string' || !content.trim()) throw new Error('invalid file');
    result[path] = content;
  }
  if (!result['SKILL.md'] || !result['metadata.json']) throw new Error('required files missing');
  JSON.parse(result['metadata.json']);
  if (!result['SKILL.md'].startsWith('---')) throw new Error('SKILL.md frontmatter missing');
  return { skillFolderName: folder, files: result };
}

export default async (request: Request) => {
  if (!isAllowed(request)) return json({ error: 'Too many requests. Try again later.' }, 429);
  try {
    const body = await request.json() as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error('messages must be an array');
    const messages = (body.messages as Array<{ role?: unknown; content?: unknown }>).slice(-40).map((item) => {
      if ((item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string' || !item.content.trim()) throw new Error('invalid message');
      return { role: item.role, content: item.content.trim().slice(0, 6000) } as Message;
    });
    if (!messages.length) throw new Error('messages must not be empty');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('AI service is not configured');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 3000,
        messages: [
          { role: 'system', content: 'Generate a coding-agent skill package as strict JSON. Return skillFolderName and files with SKILL.md and metadata.json. Use valid frontmatter and metadata JSON.' },
          ...messages
        ]
      })
    });
    if (!response.ok) throw new Error('AI service request failed');
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const result = validate(JSON.parse(payload.choices?.[0]?.message?.content ?? ''));
    return json(result);
  } catch {
    return json({ error: 'Unable to create a valid skill package.' }, 400);
  }
};
