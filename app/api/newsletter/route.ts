import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { log, newRequestId } from '@/lib/logger';

export const runtime = 'nodejs';

const RATE_LIMIT = { limit: 3, windowMs: 60 * 60 * 1000 };

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email('email inválido').max(254),
  // Honeypot: campo invisivel pra bots. Aceitamos qualquer string aqui e
  // descartamos silenciosamente la embaixo se vier preenchida (200 ok).
  website: z.string().max(2000).optional(),
});

interface NewsletterResponse {
  ok?: true;
  error?: string;
}

function getClientIp(request: Request): string {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return 'anon';
}

export async function POST(request: Request): Promise<NextResponse<NewsletterResponse>> {
  const requestId = newRequestId();
  const ip = getClientIp(request);

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    log.error('newsletter_not_configured', { requestId, hasKey: !!apiKey, hasSegment: !!segmentId });
    return NextResponse.json({ error: 'Newsletter indisponível no momento.' }, { status: 503 });
  }

  const rl = checkRateLimit(`newsletter:${ip}`, RATE_LIMIT);
  if (!rl.success) {
    log.warn('newsletter_rate_limited', { requestId, ip, resetMs: rl.resetMs });
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente daqui a pouco.' },
      { status: 429, headers: { 'Retry-After': Math.ceil(rl.resetMs / 1000).toString() } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'requisição inválida' },
      { status: 400 },
    );
  }

  const { email, website } = parsed.data;

  if (website && website.length > 0) {
    log.info('newsletter_honeypot_hit', { requestId, ip });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.contacts.create({
      email,
      segments: [{ id: segmentId }],
      unsubscribed: false,
    });

    if (result.error) {
      // Resend retorna erro estruturado; codigo 'validation_error' inclui email duplicado.
      // Tratamos duplicado como sucesso pra nao revelar quem ja esta inscrito.
      const msg = result.error.message ?? '';
      if (/already exists|duplicate/i.test(msg)) {
        log.info('newsletter_duplicate', { requestId });
        return NextResponse.json({ ok: true });
      }
      log.error('newsletter_resend_error', {
        requestId,
        name: result.error.name,
        message: msg,
      });
      return NextResponse.json({ error: 'Não conseguimos te inscrever agora. Tente novamente.' }, { status: 502 });
    }

    log.info('newsletter_subscribed', { requestId, contactId: result.data?.id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    log.error('newsletter_unhandled', { requestId, error: String(err) });
    return NextResponse.json({ error: 'Erro no servidor. Tente novamente.' }, { status: 500 });
  }
}
