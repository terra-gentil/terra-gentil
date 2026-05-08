import { YOUTUBE_PLAYLIST_ID } from '@/lib/constants';
import { log } from '@/lib/logger';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

const FETCH_TIMEOUT_MS = 8000;
// User-Agent generico (sem fixar versao de browser que envelhece em string).
const USER_AGENT = 'Mozilla/5.0 (compatible; TerraGentilBot/1.0; +https://terragentil.com.br)';

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1].trim()) : '';
}

function extractAttribute(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'));
  return match ? match[1] : '';
}

export async function fetchPlaylistVideos(limit?: number): Promise<YouTubeVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${YOUTUBE_PLAYLIST_ID}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/atom+xml, application/xml, text/xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      next: { revalidate: 3600 },
      signal: controller.signal,
    });

    if (!res.ok) {
      log.warn('youtube_rss_http_error', { status: res.status, statusText: res.statusText });
      return [];
    }

    const xml = await res.text();

    if (!xml.includes('<entry>')) {
      log.warn('youtube_rss_no_entries', { responseLength: xml.length });
      return [];
    }

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    const videos: YouTubeVideo[] = entries
      .map((entry) => {
        const id = extractTag(entry, 'yt:videoId') || extractTag(entry, 'videoId');
        const title = extractTag(entry, 'title');
        const description = extractTag(entry, 'media:description');
        const publishedAt = extractTag(entry, 'published');
        const thumbnail =
          extractAttribute(entry, 'media:thumbnail', 'url') ||
          `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

        return {
          id,
          title,
          description: description.slice(0, 150),
          publishedAt,
          thumbnail,
        };
      })
      .filter((v) => v.id);

    return limit ? videos.slice(0, limit) : videos;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      log.warn('youtube_rss_timeout', { timeoutMs: FETCH_TIMEOUT_MS });
    } else {
      log.error('youtube_rss_fetch_error', { error: String(err) });
    }
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
