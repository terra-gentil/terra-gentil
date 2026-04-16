export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

const PLAYLIST_ID = 'PLo0P-qaOD_PSJ24_1Z5d9JbwVs2Y3oDS8';

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
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('Failed to fetch YouTube RSS:', res.status);
      return [];
    }

    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    const videos: YouTubeVideo[] = entries.map((entry) => {
      const id = extractTag(entry, 'yt:videoId') || extractTag(entry, 'videoId');
      const title = extractTag(entry, 'title');
      const description = extractTag(entry, 'media:description');
      const publishedAt = extractTag(entry, 'published');
      const thumbnail = extractAttribute(entry, 'media:thumbnail', 'url') || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

      return {
        id,
        title,
        description: description.slice(0, 150),
        publishedAt,
        thumbnail,
      };
    }).filter((v) => v.id);

    return limit ? videos.slice(0, limit) : videos;
  } catch (err) {
    console.error('Error fetching YouTube playlist:', err);
    return [];
  }
}
