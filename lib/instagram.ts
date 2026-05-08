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

const FETCH_TIMEOUT_MS = 6000;
const GRAPH_VERSION = 'v22.0';
const FIELDS = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';

// Permalink: https://www.instagram.com/p/<shortcode>/ ou /reel/<shortcode>/
function extractShortcode(permalink: string): string | null {
  const m = permalink.match(/\/(?:p|reel|tv)\/([^/]+)\//);
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
  url.searchParams.set('access_token', token);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      // Cache por 1h. Posts novos aparecem na home no proximo build OU apos
      // revalidate (Next 16 + Vercel respeita).
      next: { revalidate: 3600, tags: ['instagram'] },
      signal: controller.signal,
    });

    if (!res.ok) {
      log.warn('instagram_http_error', { status: res.status });
      return [];
    }

    const json = (await res.json()) as IgMediaResponse;

    if (json.error) {
      log.warn('instagram_api_error', { message: json.error.message, code: json.error.code });
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
      log.error('instagram_fetch_error', { error: String(err) });
    }
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
