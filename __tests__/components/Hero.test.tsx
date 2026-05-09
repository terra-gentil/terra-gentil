import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Hero from '@/components/sections/Hero';
import { YOUTUBE_URL } from '@/lib/constants';

describe('Hero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renderiza h1 e CTAs principais', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/Jardinagem/);
    expect(h1.textContent).toMatch(/gentileza/);

    const yt = screen.getByRole('link', { name: /Assistir no YouTube/i });
    expect(yt).toHaveAttribute('href', YOUTUBE_URL);
    expect(yt).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.getByRole('link', { name: /Diagnosticar minha planta/i })).toHaveAttribute(
      'href',
      '#doutor',
    );
  });

  it('renderiza 3 polaroides + mascote acenando', () => {
    render(<Hero />);
    expect(screen.getByAltText('Andre no quintal')).toBeInTheDocument();
    expect(screen.getByAltText('Lancamento da IA')).toBeInTheDocument();
    expect(screen.getByAltText('Canal Terra Gentil')).toBeInTheDocument();
    expect(screen.getByAltText(/Brotinho mascote/i)).toBeInTheDocument();
  });

  it('clique em dot do slide-ctrl muda foto ativa', () => {
    // Com fake timers, fireEvent e mais previsivel que userEvent (que usa timers internos).
    render(<Hero />);

    const dots = screen.getAllByRole('button', { name: /Mostrar foto/i });
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveClass('on');
    expect(dots[1]).not.toHaveClass('on');

    act(() => {
      fireEvent.click(dots[1]);
    });
    expect(dots[1]).toHaveClass('on');
    expect(dots[0]).not.toHaveClass('on');
  });

  it('roda automaticamente entre as 3 fotos a cada 3.5s', () => {
    render(<Hero />);
    const dots = screen.getAllByRole('button', { name: /Mostrar foto/i });
    expect(dots[0]).toHaveClass('on');
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(dots[1]).toHaveClass('on');
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    expect(dots[2]).toHaveClass('on');
  });
});
