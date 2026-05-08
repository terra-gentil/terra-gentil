import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/youtube', () => ({
  fetchPlaylistVideos: vi.fn(),
}));

import VideosPage, { metadata } from '@/app/videos/page';
import { fetchPlaylistVideos } from '@/lib/youtube';

const mockedFetch = vi.mocked(fetchPlaylistVideos);

const fakeVideos = [
  { id: 'a1', title: 'Primeiro', description: 'd1', publishedAt: '2025-01-01', thumbnail: 't1' },
  { id: 'b2', title: 'Segundo', description: 'd2', publishedAt: '2025-02-01', thumbnail: 't2' },
];

describe('app/videos', () => {
  it('exposes Videos metadata', () => {
    expect(metadata.title).toMatch(/Vídeos/);
  });

  it('renders 1 lite-embed button per video and the count message', async () => {
    mockedFetch.mockResolvedValue(fakeVideos);
    render(await VideosPage());
    expect(screen.getByText(/2 vídeos disponíveis/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: /reproduzir/i });
    expect(buttons).toHaveLength(fakeVideos.length);
    expect(document.querySelectorAll('iframe')).toHaveLength(0); // sem iframe upfront
    const thumbs = screen.getAllByAltText(/Primeiro|Segundo/);
    expect(thumbs[0].getAttribute('src')).toContain('a1');
  });

  it('uses singular when only 1 video', async () => {
    mockedFetch.mockResolvedValue([fakeVideos[0]]);
    render(await VideosPage());
    const counter = screen.getByText(/1 vídeo/i);
    expect(counter).toBeInTheDocument();
    expect(counter.textContent).not.toMatch(/vídeos/i);
  });

  it('renders fallback when fetch returns empty', async () => {
    mockedFetch.mockResolvedValue([]);
    render(await VideosPage());
    expect(screen.getByText(/Não foi possível carregar/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ir direto para o canal/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@TerraGentil',
    );
  });
});
