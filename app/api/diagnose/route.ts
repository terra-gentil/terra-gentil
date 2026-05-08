import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { DiagnosisResponse } from '@/types/diagnosis';
import { checkRateLimit } from '@/lib/rate-limit';
import { log, newRequestId } from '@/lib/logger';

export const runtime = 'nodejs';

const MAX_BASE64_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

const requestSchema = z.object({
  image: z.string().min(1, 'image required').max(MAX_BASE64_BYTES, 'image too large (max 10MB)'),
  mimeType: z
    .string()
    .optional()
    .refine((m) => !m || ALLOWED_MIME_TYPES.includes(m), 'unsupported mimeType'),
});

// Schema do retorno do Gemini. Espelha o tipo Diagnosis em types/diagnosis.ts.
// Se o modelo devolver shape diferente, falha o parse e tentamos o proximo modelo.
const diagnosisOutputSchema = z.object({
  plantName: z.string().min(1),
  scientificName: z.string().min(1),
  welcomeMessage: z.string().min(1),
  toxicity: z.object({ isToxic: z.boolean(), details: z.string() }),
  diagnosis: z.object({ problem: z.string(), description: z.string() }),
  stats: z.object({
    light: z.string(),
    watering: z.string(),
    temperature: z.string(),
    difficulty: z.string(),
  }),
  treatment: z.array(z.object({ period: z.string(), action: z.string() })),
});

const errorOutputSchema = z.object({ error: z.string() });

const PROMPT = `Você é o Doutor Terra Gentil, especialista empático em plantas.

Analise a imagem da planta e retorne APENAS um JSON válido (sem markdown, sem backticks, sem explicação fora do JSON) com a estrutura EXATA:

{
  "plantName": "Nome popular da planta em português",
  "scientificName": "Nome científico em latim",
  "welcomeMessage": "Mensagem curta e empática (2 frases) como Doutor Terra Gentil recebendo a pessoa",
  "toxicity": {
    "isToxic": true ou false,
    "details": "Explicação curta sobre toxicidade para pets e crianças"
  },
  "diagnosis": {
    "problem": "Nome curto do problema identificado (ou 'Planta saudável')",
    "description": "Explicação do que está acontecendo em 2-3 frases"
  },
  "stats": {
    "light": "Ex: Meia-sombra",
    "watering": "Ex: 2x por semana",
    "temperature": "Ex: 18-25°C",
    "difficulty": "Ex: Fácil"
  },
  "treatment": [
    { "period": "Hoje", "action": "Primeira ação recomendada" },
    { "period": "Dia 3", "action": "Segunda ação" },
    { "period": "1 semana", "action": "Terceira ação" }
  ]
}

Se a imagem não for de uma planta, retorne:
{ "error": "A imagem não parece ser de uma planta. Tente novamente." }`;

function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'anon';
}

export async function POST(request: Request): Promise<NextResponse<DiagnosisResponse>> {
  const requestId = newRequestId();
  const ip = getClientIp(request);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    log.error('diagnose_no_api_key', { requestId });
    return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
  }

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
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsedBody = requestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues[0]?.message ?? 'requisição inválida' },
      { status: 400 },
    );
  }

  const { image, mimeType } = parsedBody.data;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

    let lastError: unknown = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          PROMPT,
          { inlineData: { data: image, mimeType: mimeType ?? 'image/jpeg' } },
        ]);

        const response = await result.response;
        let text = response.text().trim();
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        let candidate: unknown;
        try {
          candidate = JSON.parse(text);
        } catch (parseErr) {
          lastError = parseErr;
          log.warn('diagnose_invalid_json', { requestId, modelName });
          continue;
        }

        const errParsed = errorOutputSchema.safeParse(candidate);
        if (errParsed.success) {
          log.info('diagnose_not_a_plant', { requestId, modelName });
          return NextResponse.json({ error: errParsed.data.error }, { status: 400 });
        }

        const okParsed = diagnosisOutputSchema.safeParse(candidate);
        if (!okParsed.success) {
          lastError = okParsed.error;
          log.warn('diagnose_invalid_shape', {
            requestId,
            modelName,
            issues: okParsed.error.issues.length,
          });
          continue;
        }

        log.info('diagnose_ok', { requestId, modelName });
        return NextResponse.json(okParsed.data);
      } catch (err) {
        lastError = err;
        log.warn('diagnose_model_error', { requestId, modelName, error: String(err) });
        continue;
      }
    }

    log.error('diagnose_all_models_failed', { requestId, error: String(lastError) });
    return NextResponse.json(
      { error: 'Não foi possível analisar a imagem. Tente novamente.' },
      { status: 500 },
    );
  } catch (err) {
    log.error('diagnose_unhandled', { requestId, error: String(err) });
    return NextResponse.json({ error: 'Erro no servidor. Tente novamente.' }, { status: 500 });
  }
}
