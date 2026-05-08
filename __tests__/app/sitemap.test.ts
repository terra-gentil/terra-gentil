import { describe, it, expect, vi } from 'vitest';
import { posts } from '@/data/posts';

async function loadSitemap(gameEnabled: boolean) {
  vi.resetModules();
  vi.doMock('@/lib/constants', async () => {
    const actual = await vi.importActual<typeof import('@/lib/constants')>('@/lib/constants');
    return { ...actual, GAME_ENABLED: gameEnabled };
  });
  const mod = await import('@/app/sitemap');
  return mod.default;
}

describe('app/sitemap', () => {
  it('inclui todas as rotas estáticas + um entry por post', async () => {
    const sitemap = await loadSitemap(false);
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    // redesign
    expect(urls).toContain('https://terragentil.com.br/');
    expect(urls).toContain('https://terragentil.com.br/videos');
    expect(urls).toContain('https://terragentil.com.br/doutor');
    expect(urls).toContain('https://terragentil.com.br/transformacoes');
    expect(urls).toContain('https://terragentil.com.br/guias');
    expect(urls).toContain('https://terragentil.com.br/manifesto');
    expect(urls).toContain('https://terragentil.com.br/app');
    expect(urls).toContain('https://terragentil.com.br/instagram');
    // legadas
    expect(urls).toContain('https://terragentil.com.br/sobre');
    expect(urls).toContain('https://terragentil.com.br/blog');
    expect(urls).toContain('https://terragentil.com.br/equipamentos');
    for (const p of posts) {
      expect(urls).toContain(`https://terragentil.com.br/blog/${p.slug}`);
    }
    expect(urls).not.toContain('https://terragentil.com.br/jogo');
  });

  it('inclui /jogo só quando GAME_ENABLED=true', async () => {
    const sitemap = await loadSitemap(true);
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain('https://terragentil.com.br/jogo');
  });

  it('home tem priority 1.0 e weekly', async () => {
    const sitemap = await loadSitemap(false);
    const home = sitemap().find((e) => e.url === 'https://terragentil.com.br/');
    expect(home?.priority).toBe(1.0);
    expect(home?.changeFrequency).toBe('weekly');
  });
});
