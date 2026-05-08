// Rate limit em memoria por IP. Funciona em single-region da Vercel mas NAO
// e shared entre instancias serverless ou regions. Pra producao com trafego
// real, migrar pra @upstash/ratelimit (Redis) ou Vercel KV.
//
// Uso:
//   const rl = checkRateLimit(ip, { limit: 5, windowMs: 60_000 });
//   if (!rl.success) return new Response(null, { status: 429 });

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
}

const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const cutoff = now - opts.windowMs;
  const previous = buckets.get(key) ?? [];
  const recent = previous.filter((ts) => ts > cutoff);

  if (recent.length >= opts.limit) {
    const oldest = recent[0];
    return {
      success: false,
      remaining: 0,
      resetMs: oldest + opts.windowMs - now,
    };
  }

  recent.push(now);
  buckets.set(key, recent);

  // Garbage collection oportunistico: a cada 100 entries, limpa quem nao tem
  // mais ts dentro da janela. Evita o Map crescer indefinidamente em ataques.
  if (buckets.size > 100) {
    for (const [k, ts] of buckets.entries()) {
      if (ts.every((t) => t <= cutoff)) buckets.delete(k);
    }
  }

  return {
    success: true,
    remaining: opts.limit - recent.length,
    resetMs: opts.windowMs,
  };
}

// Exportado pra resetar o estado em testes. Nao chamar em producao.
export function __resetRateLimitForTests(): void {
  buckets.clear();
}
