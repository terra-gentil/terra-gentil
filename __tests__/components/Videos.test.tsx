import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/youtube', () => ({
  fetchPlaylistVideos: vi.fn(),
}));

import Videos from '@/components/sections/Videos';
import { fetchPlaylistVideos } from '@/lib/youtube';

const mockedFetch = vi.mocked(fetchPlaylistVideos);

const fakeVideos = [
  { id: 'a1', title: 'Primeiro', description: 'd1', publishedAt: '2025-01-01', thumbnail: 't1' },
  { id: 'b2', title: 'Segundo', description: 'd2', publishedAt: '2025-02-01', thumbnail: 't2' },
  { id: 'c3', title: 'Terceiro', description: 'd3', publishedAt: '2025-03-01', thumbnail: 't3' },
];

describe('Videos section', () => {
  it('renders the 3 videos when the fetch returns', async () => {
    mockedFetch.mockResolvedValue(fakeVideos);
    render(await Videos());
    for (const v of fakeVideos) {
      expect(screen.getByText(v.title)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /Inscreva-se no canal/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@TerraGentil',
    );
  });

  it('falls back to loading message when fetch returns empty', async () => {
    mockedFetch.mockResolvedValue([]);
    render(await Videos());
    expect(screen.getByText(/Carregando vídeos/i)).toBeInTheDocument();
  });
});
