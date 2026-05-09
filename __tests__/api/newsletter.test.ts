import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const contactsCreate = vi.fn();

vi.mock('resend', () => ({
  Resend: class FakeResend {
    contacts = { create: contactsCreate };
  },
}));

import { POST } from '@/app/api/newsletter/route';
import { __resetRateLimitForTests } from '@/lib/rate-limit';

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  headers['x-forwarded-for'] = ip ?? `10.0.1.${++ipCounter % 250}`;
  return new Request('http://localhost/api/newsletter', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/newsletter', () => {
  const originalKey = process.env.RESEND_API_KEY;
  const originalAud = process.env.RESEND_SEGMENT_ID;

  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_SEGMENT_ID = 'seg-1';
    contactsCreate.mockReset();
    contactsCreate.mockResolvedValue({ data: { id: 'c-1', object: 'contact' }, error: null });
    __resetRateLimitForTests();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalAud === undefined) delete process.env.RESEND_SEGMENT_ID;
    else process.env.RESEND_SEGMENT_ID = originalAud;
  });

  it('subscribes a valid email', async () => {
    const res = await POST(makeRequest({ email: 'oi@terragentil.com.br' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(contactsCreate).toHaveBeenCalledWith({
      email: 'oi@terragentil.com.br',
      segments: [{ id: 'seg-1' }],
      unsubscribed: false,
    });
  });

  it('lowercases and trims the email before sending to Resend', async () => {
    await POST(makeRequest({ email: '  Oi@Terragentil.com.br  ' }));
    expect(contactsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'oi@terragentil.com.br' }),
    );
  });

  it('returns 503 when Resend env vars are missing', async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(makeRequest({ email: 'oi@terragentil.com.br' }));
    expect(res.status).toBe(503);
    expect(contactsCreate).not.toHaveBeenCalled();
  });

  it('returns 400 on invalid email', async () => {
    const res = await POST(makeRequest({ email: 'naoehemail' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/email/i);
    expect(contactsCreate).not.toHaveBeenCalled();
  });

  it('returns 400 on invalid JSON body', async () => {
    const res = await POST(makeRequest('{bad'));
    expect(res.status).toBe(400);
  });

  it('honeypot fakes success and skips Resend', async () => {
    const res = await POST(makeRequest({ email: 'bot@example.com', website: 'http://spam' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(contactsCreate).not.toHaveBeenCalled();
  });

  it('treats Resend duplicate as success without leaking', async () => {
    contactsCreate.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Contact already exists.' },
    });
    const res = await POST(makeRequest({ email: 'ja@inscrito.com' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it('returns 502 when Resend fails with non-duplicate error', async () => {
    contactsCreate.mockResolvedValue({
      data: null,
      error: { name: 'application_error', message: 'something exploded' },
    });
    const res = await POST(makeRequest({ email: 'oi@terragentil.com.br' }));
    expect(res.status).toBe(502);
  });

  it('returns 500 when SDK throws unexpectedly', async () => {
    contactsCreate.mockRejectedValue(new Error('network'));
    const res = await POST(makeRequest({ email: 'oi@terragentil.com.br' }));
    expect(res.status).toBe(500);
  });

  it('rate limits after 3 requests in the hour', async () => {
    const ip = '203.0.113.99';
    for (let i = 0; i < 3; i++) {
      const res = await POST(makeRequest({ email: `a${i}@b.com` }, ip));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(makeRequest({ email: 'a4@b.com' }, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });

  it('rejects email longer than 254 chars', async () => {
    const long = 'a'.repeat(250) + '@b.com';
    const res = await POST(makeRequest({ email: long }));
    expect(res.status).toBe(400);
  });
});
