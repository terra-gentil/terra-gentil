import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const generateContent = vi.fn();
const getGenerativeModel = vi.fn(() => ({ generateContent }));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class FakeGenAI {
    getGenerativeModel = getGenerativeModel;
  },
}));

import { POST } from '@/app/api/diagnose/route';
import { __resetRateLimitForTests } from '@/lib/rate-limit';

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): Request {
  // Usa IP unico por request por padrao pra nao colidir o rate limit entre testes.
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  headers['x-forwarded-for'] = ip ?? `10.0.0.${++ipCounter % 250}`;
  return new Request('http://localhost/api/diagnose', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/diagnose', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
    generateContent.mockReset();
    getGenerativeModel.mockClear();
    __resetRateLimitForTests();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  it('returns 500 when API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await POST(makeRequest({ image: 'abc' }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/api key/i);
  });

  it('returns 400 on invalid JSON body', async () => {
    const res = await POST(makeRequest('{not json'));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/json inválido/i);
  });

  it('returns 400 when image is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when image is empty', async () => {
    const res = await POST(makeRequest({ image: '' }));
    expect(res.status).toBe(400);
  });

  it('rejects unsupported mimeType', async () => {
    const res = await POST(makeRequest({ image: 'abc', mimeType: 'application/pdf' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/mime/i);
  });

  it('rejects images larger than 10MB', async () => {
    const big = 'a'.repeat(10 * 1024 * 1024 + 1);
    const res = await POST(makeRequest({ image: big }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/too large|10MB/i);
  });

  it('returns parsed diagnosis on Gemini success', async () => {
    const diagnosis = {
      plantName: 'Suculenta',
      scientificName: 'Echeveria',
      welcomeMessage: 'Oi!',
      toxicity: { isToxic: false, details: 'Segura.' },
      diagnosis: { problem: 'Saudável', description: 'Tudo bem.' },
      stats: { light: 'Sol', watering: '1x', temperature: '20', difficulty: 'Fácil' },
      treatment: [],
    };
    generateContent.mockResolvedValue({
      response: { text: () => '```json\n' + JSON.stringify(diagnosis) + '\n```' },
    });

    const res = await POST(makeRequest({ image: 'YWJj', mimeType: 'image/jpeg' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.plantName).toBe('Suculenta');
  });

  it('returns 400 when Gemini reports it is not a plant', async () => {
    generateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ error: 'Não é planta' }) },
    });
    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Não é planta');
  });

  it('falls back to second model when the first throws', async () => {
    const diagnosis = {
      plantName: 'Manjericão',
      scientificName: 'Ocimum',
      welcomeMessage: 'Olá',
      toxicity: { isToxic: false, details: '' },
      diagnosis: { problem: '', description: '' },
      stats: { light: '', watering: '', temperature: '', difficulty: '' },
      treatment: [],
    };
    generateContent
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ response: { text: () => JSON.stringify(diagnosis) } });

    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.plantName).toBe('Manjericão');
  });

  it('returns 500 when all models fail', async () => {
    generateContent.mockRejectedValue(new Error('boom'));
    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(500);
  });

  it('rate limits the same IP after 5 requests in 60s', async () => {
    generateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            plantName: 'X', scientificName: 'X', welcomeMessage: 'X',
            toxicity: { isToxic: false, details: '' },
            diagnosis: { problem: '', description: '' },
            stats: { light: '', watering: '', temperature: '', difficulty: '' },
            treatment: [],
          }),
      },
    });
    const ip = '203.0.113.42';
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ image: 'YWJj' }, ip));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(makeRequest({ image: 'YWJj' }, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });

  it('falls back when Gemini returns wrong shape (missing required fields)', async () => {
    const valid = {
      plantName: 'OK', scientificName: 'OK', welcomeMessage: 'OK',
      toxicity: { isToxic: false, details: '' },
      diagnosis: { problem: '', description: '' },
      stats: { light: '', watering: '', temperature: '', difficulty: '' },
      treatment: [],
    };
    generateContent
      .mockResolvedValueOnce({ response: { text: () => JSON.stringify({ plantName: 'incomplete' }) } })
      .mockResolvedValueOnce({ response: { text: () => JSON.stringify(valid) } });
    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.plantName).toBe('OK');
  });

  it('returns 500 when all models return wrong shape', async () => {
    generateContent.mockResolvedValue({ response: { text: () => '{"foo":"bar"}' } });
    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(500);
  });
});
