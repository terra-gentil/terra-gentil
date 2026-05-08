import { GAME_NICKNAME_REGEX, GAME_URL } from '@/lib/constants';

/**
 * Sanitiza um candidato a nickname pro mesmo formato que o jogo aceita
 * (A-Z, 0-9, underscore, 3-12 chars). Retorna null se nao for possivel
 * normalizar — assim a gente NAO passa um param invalido pro jogo, que
 * descarta silenciosamente e o usuario nem entende por que nao prefilled.
 */
export function sanitizeNickname(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
  if (!GAME_NICKNAME_REGEX.test(cleaned)) return null;
  return cleaned;
}

/**
 * Monta a URL final do jogo para o iframe. Acrescenta ?nickname= apenas se
 * passar pela sanitizacao — caso contrario manda a URL crua pro jogo cuidar.
 */
export function buildGameUrl(rawNickname?: unknown): string {
  const nickname = sanitizeNickname(rawNickname);
  if (!nickname) return GAME_URL;
  const url = new URL(GAME_URL);
  url.searchParams.set('nickname', nickname);
  return url.toString();
}
