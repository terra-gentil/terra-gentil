// Instagram Graph API - fetch das medias mais recentes do proprio canal.
//
// Usa o endpoint /me/media com long-lived user token (60 dias, refresh manual).
// Docs:
// - https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/
// - https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login
//
// Setup do token: ver README, secao "Instagram API setup".

import { log } from '@/lib/logger';

export type IgMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

interface IgMediaRaw {
  id: string;
  caption?: string;
  media_type: IgMediaType;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
}

interface IgMediaResponse {
  data?: IgMediaRaw[];
  error?: { message: string; type?: string; code?: number };
}

export interface IgMedia {
  id: string;
  shortcode: string;
  permalink: string;
  caption: string;
  kind: 'reel' | 'photo' | 'carousel';
  thumbnailUrl: string;
  timestamp: string;
}

// So os campos que a API com instagram_business_basic devolve de fato.
// Curtidas/comentarios por post e total de curtidas NAO sao expostos nesse
// escopo, por isso nao existem aqui (decisao: nada de numero fake).
export interface IgProfile {
  username: string;
  mediaCount: number | null;
  followersCount: number | null;
  followsCount: number | null;
  avatarUrl: string | null;
}

interface IgProfileRaw {
  username?: string;
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
  profile_picture_url?: string;
  error?: { message: string; type?: string; code?: number };
}

const FETCH_TIMEOUT_MS = 6000;
const GRAPH_VERSION = 'v22.0';
const FIELDS = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
const PROFILE_FIELDS = 'username,media_count,followers_count,follows_count,profile_picture_url';

// Permalink: https://www.instagram.com/p/<shortcode>/ ou /reel/<shortcode>/.
// Trailing slash opcional pq a API as vezes devolve sem; precisa parar em ?, # ou /
// pra nao engolir query string.
function extractShortcode(permalink: string): string | null {
  const m = permalink.match(/\/(?:p|reel|tv)\/([^/?#]+)/);
  return m ? m[1] : null;
}

function mapKind(type: IgMediaType): IgMedia['kind'] {
  if (type === 'VIDEO') return 'reel';
  if (type === 'CAROUSEL_ALBUM') return 'carousel';
  return 'photo';
}

export async function fetchInstagramMedia(limit = 12): Promise<IgMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return [];
  }

  const url = new URL(`https://graph.instagram.com/${GRAPH_VERSION}/me/media`);
  url.searchParams.set('fields', FIELDS);
  url.searchParams.set('limit', String(limit));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      // Cache por 1h. Posts novos aparecem na home no proximo build OU apos
      // revalidate (Next 16 + Vercel respeita).
      next: { revalidate: 3600, tags: ['instagram'] },
      // Token via header em vez de query string: nao aparece em proxy/CDN logs
      // que capturam URL, e a chave de cache do Next nao depende do token.
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    if (!res.ok) {
      log.warn('instagram_http_error', { status: res.status });
      return [];
    }

    const json = (await res.json()) as IgMediaResponse;

    if (json.error) {
      // code 190 = OAuthException token invalido/expirado. Loga evento distinto
      // pra o oncall acordar quando o token de 60d expira sem refresh.
      const event = json.error.code === 190 ? 'instagram_token_expired' : 'instagram_api_error';
      log.warn(event, { message: json.error.message, code: json.error.code });
      return [];
    }

    const items = json.data ?? [];
    return items
      .map((m): IgMedia | null => {
        const shortcode = extractShortcode(m.permalink);
        if (!shortcode) return null;
        return {
          id: m.id,
          shortcode,
          permalink: m.permalink,
          caption: (m.caption ?? '').slice(0, 280),
          kind: mapKind(m.media_type),
          thumbnailUrl: m.thumbnail_url ?? m.media_url ?? '',
          timestamp: m.timestamp ?? '',
        };
      })
      .filter((x): x is IgMedia => x !== null);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      log.warn('instagram_timeout', { timeoutMs: FETCH_TIMEOUT_MS });
    } else {
      // CRITICO: NUNCA logar String(err) ou err.cause direto. Undici pode incluir
      // a URL e os headers do request no error.cause, e o token vai por header
      // Authorization: Bearer ... agora. Mascara qualquer forma que possa surgir.
      const msg = err instanceof Error ? err.message : 'unknown';
      const safe = msg
        .replace(/Bearer\s+[^\s"',}]+/gi, 'Bearer ***')
        .replace(/access_token=[^&\s]+/g, 'access_token=***');
      log.error('instagram_fetch_error', { error: safe });
    }
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

// Dados de perfil pro header da pagina /instagram. Sem token, retorna null e
// o header renderiza sem os numeros (decisao de produto: so metrica real).
export async function fetchInstagramProfile(): Promise<IgProfile | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return null;
  }

  const url = new URL(`https://graph.instagram.com/${GRAPH_VERSION}/me`);
  url.searchParams.set('fields', PROFILE_FIELDS);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ['instagram'] },
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    if (!res.ok) {
      log.warn('instagram_profile_http_error', { status: res.status });
      return null;
    }

    const json = (await res.json()) as IgProfileRaw;

    if (json.error) {
      const event =
        json.error.code === 190 ? 'instagram_token_expired' : 'instagram_api_error';
      log.warn(event, { message: json.error.message, code: json.error.code });
      return null;
    }

    return {
      username: json.username ?? 'canalterragentil',
      mediaCount: typeof json.media_count === 'number' ? json.media_count : null,
      followersCount:
        typeof json.followers_count === 'number' ? json.followers_count : null,
      followsCount:
        typeof json.follows_count === 'number' ? json.follows_count : null,
      avatarUrl: json.profile_picture_url ?? null,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      log.warn('instagram_profile_timeout', { timeoutMs: FETCH_TIMEOUT_MS });
    } else {
      const msg = err instanceof Error ? err.message : 'unknown';
      const safe = msg
        .replace(/Bearer\s+[^\s"',}]+/gi, 'Bearer ***')
        .replace(/access_token=[^&\s]+/g, 'access_token=***');
      log.error('instagram_profile_fetch_error', { error: safe });
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
