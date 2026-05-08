import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchPlaylistVideos } from '@/lib/youtube';

const ATOM_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>yt:video:CK_0skjKI5A</id>
    <yt:videoId>CK_0skjKI5A</yt:videoId>
    <title>Transformação 1 &amp; o jardim</title>
    <published>2025-09-15T12:00:00+00:00</published>
    <media:group>
      <media:description>Descrição com &lt;tag&gt; e &quot;aspas&quot;.</media:description>
      <media:thumbnail url="https://i.ytimg.com/vi/CK_0skjKI5A/hqdefault.jpg" width="480" height="360" />
    </media:group>
  </entry>
  <entry>
    <id>yt:video:q76bMs-NwRk</id>
    <yt:videoId>q76bMs-NwRk</yt:videoId>
    <title>Segundo vídeo</title>
    <published>2025-08-01T10:00:00+00:00</published>
    <media:group>
      <media:description>Outro</media:description>
      <media:thumbnail url="https://i.ytimg.com/vi/q76bMs-NwRk/hqdefault.jpg" width="480" height="360" />
    </media:group>
  </entry>
  <entry>
    <id>yt:video:h91qQnbYnNM</id>
    <yt:videoId>h91qQnbYnNM</yt:videoId>
    <title>Terceiro</title>
    <published>2025-07-10T08:00:00+00:00</published>
    <media:group>
      <media:description>Mais um</media:description>
      <media:thumbnail url="https://i.ytimg.com/vi/h91qQnbYnNM/hqdefault.jpg" width="480" height="360" />
    </media:group>
  </entry>
</feed>`;

function mockFetchOnce(body: string, status = 200) {
  globalThis.fetch = vi.fn(async () =>
    new Response(body, { status }),
  ) as unknown as typeof fetch;
}

describe('fetchPlaylistVideos', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('parses videos from a valid Atom feed', async () => {
    mockFetchOnce(ATOM_FEED);

    const videos = await fetchPlaylistVideos();

    expect(videos).toHaveLength(3);
    expect(videos[0]).toMatchObject({
      id: 'CK_0skjKI5A',
      title: 'Transformação 1 & o jardim',
      thumbnail: 'https://i.ytimg.com/vi/CK_0skjKI5A/hqdefault.jpg',
      publishedAt: '2025-09-15T12:00:00+00:00',
    });
  });

  it('decodes HTML entities in title and description', async () => {
    mockFetchOnce(ATOM_FEED);
    const videos = await fetchPlaylistVideos();
    expect(videos[0].title).toContain('&');
    expect(videos[0].title).not.toContain('&amp;');
    expect(videos[0].description).toContain('<tag>');
    expect(videos[0].description).toContain('"aspas"');
  });

  it('truncates description to 150 chars', async () => {
    const long = 'a'.repeat(500);
    const xml = ATOM_FEED.replace('Descrição com &lt;tag&gt; e &quot;aspas&quot;.', long);
    mockFetchOnce(xml);
    const videos = await fetchPlaylistVideos();
    expect(videos[0].description.length).toBe(150);
  });

  it('respects the limit parameter', async () => {
    mockFetchOnce(ATOM_FEED);
    const videos = await fetchPlaylistVideos(2);
    expect(videos).toHaveLength(2);
  });

  it('falls back to ytimg URL when media:thumbnail is missing', async () => {
    const xml = ATOM_FEED.replace(/<media:thumbnail[\s\S]*?\/>/g, '');
    mockFetchOnce(xml);
    const videos = await fetchPlaylistVideos(1);
    expect(videos[0].thumbnail).toBe('https://i.ytimg.com/vi/CK_0skjKI5A/maxresdefault.jpg');
  });

  it('returns empty array when feed has no entries', async () => {
    mockFetchOnce('<?xml version="1.0"?><feed></feed>');
    const videos = await fetchPlaylistVideos();
    expect(videos).toEqual([]);
  });

  it('returns empty array on non-OK HTTP response', async () => {
    mockFetchOnce('Internal error', 500);
    const videos = await fetchPlaylistVideos();
    expect(videos).toEqual([]);
  });

  it('returns empty array on fetch throw', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network fail');
    }) as unknown as typeof fetch;
    const videos = await fetchPlaylistVideos();
    expect(videos).toEqual([]);
  });

  it('filters out entries without videoId', async () => {
    const xml = ATOM_FEED.replace('<yt:videoId>CK_0skjKI5A</yt:videoId>', '');
    mockFetchOnce(xml);
    const videos = await fetchPlaylistVideos();
    expect(videos).toHaveLength(2);
  });
});
