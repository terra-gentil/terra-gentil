import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// As constantes lem env at module-load. Pra testar as duas pontas (em-breve / habilitado)
// fazemos vi.doMock + dynamic import dentro de cada teste.

async function loadJogoPage(enabled: boolean) {
  vi.resetModules();
  vi.doMock('@/lib/constants', async () => {
    const actual = await vi.importActual<typeof import('@/lib/constants')>('@/lib/constants');
    return { ...actual, GAME_ENABLED: enabled };
  });
  const mod = await import('@/app/jogo/page');
  return mod.default;
}

describe('app/jogo (gate desligado)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('renderiza tela em breve quando GAME_ENABLED=false', async () => {
    const Page = await loadJogoPage(false);
    const ui = await Page({ searchParams: Promise.resolve({}) });
    render(ui);
    expect(screen.getByRole('heading', { name: /Gentileza: Resgate dos Jardins/i })).toBeInTheDocument();
    expect(screen.getByText(/Em breve/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /espiar a versao em testes/i })).toHaveAttribute(
      'href',
      'https://terra-gentil.github.io/terra-gentil-game/',
    );
    expect(screen.queryByTitle(/Gentileza: Resgate/)).toBeNull(); // sem iframe
  });
});

describe('app/jogo (gate ligado)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('renderiza iframe quando GAME_ENABLED=true', async () => {
    const Page = await loadJogoPage(true);
    const ui = await Page({ searchParams: Promise.resolve({}) });
    render(ui);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.src).toBe('https://terra-gentil.github.io/terra-gentil-game/');
    expect(iframe?.title).toBe('Gentileza: Resgate dos Jardins');
    expect(iframe?.getAttribute('allow')).toContain('fullscreen');
    expect(iframe?.hasAttribute('allowfullscreen')).toBe(true);
  });

  it('passa nickname sanitizado pra URL do iframe', async () => {
    const Page = await loadJogoPage(true);
    const ui = await Page({ searchParams: Promise.resolve({ nickname: 'andre' }) });
    render(ui);
    const iframe = document.querySelector('iframe');
    expect(iframe?.src).toContain('nickname=ANDRE');
  });

  it('ignora nickname invalido (nao corrompe URL)', async () => {
    const Page = await loadJogoPage(true);
    const ui = await Page({ searchParams: Promise.resolve({ nickname: '!!' }) });
    render(ui);
    const iframe = document.querySelector('iframe');
    expect(iframe?.src).toBe('https://terra-gentil.github.io/terra-gentil-game/');
  });
});
