// Logger estruturado JSON minimalista. Sem dependencia externa.
// Vercel agrega esses logs automaticamente; em outros hosts, qualquer agregador
// (Datadog, Loki, CloudWatch) consegue parsear o JSON line-delimited.
//
// Uso:
//   log.info('user_action', { userId: 'x', action: 'click' });
//   log.error('api_fail', { error: err.message, requestId });

type Level = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function emit(level: Level, event: string, ctx: LogContext = {}): void {
  const line = JSON.stringify({
    level,
    event,
    ts: new Date().toISOString(),
    ...ctx,
  });
  if (level === 'error' || level === 'warn') console.error(line);
  else console.log(line);
}

export const log = {
  debug: (event: string, ctx?: LogContext) => emit('debug', event, ctx),
  info: (event: string, ctx?: LogContext) => emit('info', event, ctx),
  warn: (event: string, ctx?: LogContext) => emit('warn', event, ctx),
  error: (event: string, ctx?: LogContext) => emit('error', event, ctx),
};

// Gera correlation ID curto pra propagar em logs de uma mesma request.
export function newRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}
