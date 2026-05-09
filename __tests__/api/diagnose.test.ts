import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '@/app/api/diagnose/route';
import { __resetRateLimitForTests } from '@/lib/rate-limit';

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  headers['x-forwarded-for'] = ip ?? `10.0.0.${++ipCounter % 250}`;
  return new Request('http://localhost/api/diagnose', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

interface BackendPayload {
  eh_planta: boolean;
  especie_identificada: string;
  nome_popular: string;
  confianca: number;
  estado_saude: string;
  toxica_para_pets: boolean;
  toxicidade_detalhes: string;
  nivel_luz: string;
  rega_dias: number;
  rega_condicao: string;
  temperatura_ideal: string;
  nivel_dificuldade: string;
  luz_porcentagem: number;
  luz_veredito: string;
  diagnostico_titulo: string;
  diagnostico_explicacao: string;
  problemas_detectados: Array<{ descricao: string; gravidade: string; causa_provavel: string }>;
  plano_tratamento: string;
  plano_timeline: Array<{ etapa: string; acao: string }>;
  precisa_retorno: boolean;
  mensagem_retorno: string;
}

function planta(overrides: Partial<BackendPayload> = {}): BackendPayload {
  return {
    eh_planta: true,
    especie_identificada: 'Echeveria elegans',
    nome_popular: 'Suculenta-fantasma',
    confianca: 0.95,
    estado_saude: 'saudavel',
    toxica_para_pets: false,
    toxicidade_detalhes: 'Segura.',
    nivel_luz: 'sol_pleno',
    rega_dias: 7,
    rega_condicao: 'quando o solo secar 2cm',
    temperatura_ideal: '18 a 25 graus',
    nivel_dificuldade: 'facil',
    luz_porcentagem: 90,
    luz_veredito: 'Foto excelente.',
    diagnostico_titulo: 'Suculenta saudavel',
    diagnostico_explicacao: 'Tudo certo, parabens!',
    problemas_detectados: [],
    plano_tratamento: 'Continue com os mesmos cuidados.',
    plano_timeline: [{ etapa: 'Hoje', acao: 'Verificar solo' }],
    precisa_retorno: false,
    mensagem_retorno: '',
    ...overrides,
  };
}

function mockBackend(response: { status: number; json?: unknown; text?: string; reject?: Error }) {
  globalThis.fetch = vi.fn(async () => {
    if (response.reject) throw response.reject;
    return new Response(
      response.text ?? (response.json !== undefined ? JSON.stringify(response.json) : ''),
      { status: response.status, headers: { 'Content-Type': 'application/json' } },
    );
  }) as typeof fetch;
}

describe('POST /api/diagnose (proxy backend Railway)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    __resetRateLimitForTests();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('returns 400 on invalid JSON body', async () => {
    const res = await POST(makeRequest('{not json'));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/json invalido/i);
  });

  it('returns 400 when image is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when image is empty string', async () => {
    const res = await POST(makeRequest({ image: '' }));
    expect(res.status).toBe(400);
  });

  it('rejects unsupported mimeType', async () => {
    const res = await POST(makeRequest({ image: 'YWJj', mimeType: 'application/pdf' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/mime/i);
  });

  it('rejects images larger than 10MB', async () => {
    const big = 'a'.repeat(10 * 1024 * 1024 + 1);
    const res = await POST(makeRequest({ image: big }));
    expect(res.status).toBe(400);
  });

  it('returns mapped diagnosis on backend success with extras populated', async () => {
    mockBackend({ status: 200, json: planta() });

    const res = await POST(makeRequest({ image: 'YWJj', mimeType: 'image/jpeg' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.plantName).toBe('Suculenta-fantasma');
    expect(json.scientificName).toBe('Echeveria elegans');
    expect(json.toxicity.isToxic).toBe(false);
    expect(json.stats.light).toBe('Sol pleno');
    expect(json.stats.watering).toBe('1x por semana');
    expect(json.stats.difficulty).toBe('Facil');
    expect(json.treatment).toEqual([{ period: 'Hoje', action: 'Verificar solo' }]);
    expect(json.extras).toBeDefined();
    expect(json.extras.confidence).toBe(0.95);
    expect(json.extras.healthStatus).toBe('saudavel');
    expect(json.extras.lightQuality).toEqual({ percent: 90, verdict: 'Foto excelente.' });
  });

  it('returns notPlant payload when backend reports eh_planta:false', async () => {
    mockBackend({
      status: 200,
      json: planta({
        eh_planta: false,
        plano_tratamento: 'Mande uma foto da planta com folhas visiveis.',
      }),
    });

    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.notPlant).toBe(true);
    expect(json.message).toMatch(/foto da planta/);
  });

  it('returns 502 with friendly message when backend is 5xx', async () => {
    mockBackend({ status: 502, text: 'Bad gateway' });

    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error).toMatch(/indisponivel|tente/i);
  });

  it('maps backend 413 to 400 with size message', async () => {
    mockBackend({ status: 413, text: 'Too large' });

    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/grande|10MB/i);
  });

  it('returns 502 when backend response shape is invalid', async () => {
    mockBackend({ status: 200, json: { foo: 'bar' } });

    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(502);
  });

  it('returns 504 when fetch is aborted (timeout)', async () => {
    const abortErr = new Error('aborted');
    abortErr.name = 'AbortError';
    mockBackend({ status: 0, reject: abortErr });

    const res = await POST(makeRequest({ image: 'YWJj' }));
    expect(res.status).toBe(504);
    const json = await res.json();
    expect(json.error).toMatch(/demorou|tente/i);
  });

  it('rate limits the same IP after 5 requests in 60s', async () => {
    mockBackend({ status: 200, json: planta() });

    const ip = '203.0.113.42';
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ image: 'YWJj' }, ip));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(makeRequest({ image: 'YWJj' }, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});
