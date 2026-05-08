import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LiteYouTubeEmbed from '@/components/ui/LiteYouTubeEmbed';

describe('LiteYouTubeEmbed', () => {
  it('renders thumbnail + play button initially (no iframe)', () => {
    render(<LiteYouTubeEmbed videoId="abc123" title="Vídeo legal" />);

    const button = screen.getByRole('button', { name: /reproduzir: Vídeo legal/i });
    expect(button).toBeInTheDocument();
    const img = screen.getByAltText('Vídeo legal');
    expect(img.getAttribute('src')).toContain('abc123');
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('mounts the iframe with autoplay after click', async () => {
    const user = userEvent.setup();
    render(<LiteYouTubeEmbed videoId="abc123" title="Vídeo legal" />);

    await user.click(screen.getByRole('button'));

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.src).toContain('youtube.com/embed/abc123');
    expect(iframe?.src).toContain('autoplay=1');
    expect(iframe?.title).toBe('Vídeo legal');
  });

  it('respects thumbnailQuality prop', () => {
    render(
      <LiteYouTubeEmbed videoId="x" title="t" thumbnailQuality="mqdefault" />,
    );
    const img = screen.getByAltText('t');
    expect(img.getAttribute('src')).toContain('mqdefault');
  });
});
