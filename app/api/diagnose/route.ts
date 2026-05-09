import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { DiagnosisResponse } from '@/types/diagnosis';
import { checkRateLimit } from '@/lib/rate-limit';
import { log, newRequestId } from '@/lib/logger';
import { DIAGNOSE_API_URL } from '@/lib/constants';
import { mapBackendToDiagnosis, parseBackendResponse } from '@/lib/diagnose-mapper';

export const runtime = 'nodejs';

const MAX_BASE64_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const BACKEND_TIMEOUT_MS = 60_000;

const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

const requestSchema = z.object({
  image: z.string().min(1, 'image required').max(MAX_BASE64_BYTES, 'image too large (max 10MB)'),
  mimeType: z
    .string()
    .optional()
    .refine((m) => !m || ALLOWED_MIME_TYPES.includes(m), 'unsupported mimeType'),
});

function getClientIp(request: Request): string {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0]!.trim();
  }
  return 'anon';
}

function decodeBase64(image: string): Buffer {
  // Aceita "data:image/...;base64,XXX" ou base64 puro.
  const comma = image.indexOf(',');
  const pure = comma >= 0 ? image.slice(comma + 1) : image;
  return Buffer.from(pure, 'base64');
}

function inferFilename(mimeType: string): string {
  const ext = mimeType.split('/')[1] ?? 'jpg';
  return `planta.${ext}`;
}

export async function POST(request: Request): Promise<NextResponse<DiagnosisResponse>> {
  const requestId = newRequestId();
  const ip = getClientIp(request);

  const rl = checkRateLimit(`diagnose:${ip}`, RATE_LIMIT);
  if (!rl.success) {
    log.warn('diagnose_rate_limited', { requestId, ip, resetMs: rl.resetMs });
    return NextResponse.json(
      { error: 'Muitas tentativas. Espere um minuto e tente de novo.' },
      { status: 429, headers: { 'Retry-After': Math.ceil(rl.resetMs / 1000).toString() } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 });
  }

  const parsedBody = requestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues[0]?.message ?? 'requisicao invalida' },
      { status: 400 },
    );
  }

  const { image, mimeType } = parsedBody.data;
  const finalMime = mimeType ?? 'image/jpeg';

  let buffer: Buffer;
  try {
    buffer = decodeBase64(image);
  } catch (err) {
    log.warn('diagnose_invalid_base64', { requestId, error: String(err) });
    return NextResponse.json({ error: 'Imagem invalida.' }, { status: 400 });
  }
  if (buffer.length === 0) {
    return NextResponse.json({ error: 'Imagem vazia.' }, { status: 400 });
  }

  // Forwarda o abort do cliente pra cancelar o upstream se o usuario
  // fechar a aba/voltar antes da resposta. AbortSignal.any combina com
  // o timeout pra nao queimar tempo no backend Railway por nada.
  const signal = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(BACKEND_TIMEOUT_MS),
  ]);

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: finalMime });
    formData.append('file', blob, inferFilename(finalMime));

    const upstream = await fetch(`${DIAGNOSE_API_URL}/v1/diagnostico`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      log.warn('diagnose_backend_error', {
        requestId,
        status: upstream.status,
        bodyPreview: errText.slice(0, 200),
      });
      const message = mapHttpErrorToMessage(upstream.status);
      return NextResponse.json({ error: message }, { status: upstream.status >= 500 ? 502 : 400 });
    }

    const json = (await upstream.json()) as unknown;
    const backend = parseBackendResponse(json);

    if (!backend.eh_planta) {
      log.info('diagnose_not_a_plant', { requestId });
      const fallback = 'A imagem nao parece ser de uma planta. Tente outra foto, com folhas e caule visiveis.';
      const message = backend.plano_tratamento || backend.diagnostico_explicacao || fallback;
      return NextResponse.json({ notPlant: true, message });
    }

    const diagnosis = mapBackendToDiagnosis(backend);
    log.info('diagnose_ok', { requestId, plantName: diagnosis.plantName });
    return NextResponse.json(diagnosis);
  } catch (err) {
    const isAbort =
      (err instanceof Error && err.name === 'AbortError') ||
      (err instanceof DOMException && err.name === 'TimeoutError');
    if (isAbort) {
      // request.signal aborta quando o cliente desconecta. Resposta nao chega
      // de volta ao cliente — so logar e sair sem queimar mais ciclos.
      if (request.signal.aborted) {
        log.info('diagnose_client_aborted', { requestId });
        return NextResponse.json({ error: 'cancelado' }, { status: 499 });
      }
      log.error('diagnose_timeout', { requestId });
      return NextResponse.json(
        { error: 'A analise demorou demais. Tente novamente em alguns segundos.' },
        { status: 504 },
      );
    }
    log.error('diagnose_unhandled', { requestId, error: String(err) });
    return NextResponse.json(
      { error: 'Nao foi possivel analisar a imagem. Tente novamente.' },
      { status: 502 },
    );
  }
}

function mapHttpErrorToMessage(status: number): string {
  if (status === 413) return 'Imagem muito grande. Use uma foto de ate 10MB.';
  if (status === 415) return 'Formato de imagem nao suportado.';
  if (status === 400) return 'Imagem invalida. Tente outra foto.';
  if (status >= 500) return 'O Doutor esta indisponivel agora. Tente em alguns segundos.';
  return 'Nao foi possivel analisar a imagem.';
}
