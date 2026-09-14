import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from '../../netlify/functions/skill-creator-chat';

describe('skill-creator chat handler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
  });

  it('parses JSON chat responses and forwards clarification questions', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      choices: [
        {
          message: {
            content: JSON.stringify({
              message: 'Please answer these to continue.',
              questions: [
                {
                  id: 'platform',
                  label: 'Which platform should this skill target?',
                  multiSelect: false,
                  options: ['Yes', 'No']
                }
              ]
            })
          }
        }
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })));

    const response = await handler(new Request('http://localhost/api/skill-creator/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1'
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Create a skill for CI triage.' }
        ]
      })
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Please answer these to continue.',
      questions: [
        {
          id: 'platform',
          label: 'Which platform should this skill target?',
          multiSelect: false,
          options: ['Yes', 'No']
        }
      ]
    });
  });
});
