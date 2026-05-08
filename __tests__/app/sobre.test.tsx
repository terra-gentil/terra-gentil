import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SobrePage, { metadata } from '@/app/sobre/page';

describe('app/sobre', () => {
  it('renders headline and core paragraphs', () => {
    render(<SobrePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/movimento de gentileza/i);
    expect(screen.getByText(/canal no YouTube/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Por que seguir/i);
  });

  it('renders all 6 reason cards', () => {
    render(<SobrePage />);
    const cards = [
      'Imagens que inspiram',
      'Histórias reais',
      'Ferramentas na mão, coração no trabalho',
      'Qualidade visual com propósito',
      'Visão sensível',
      'Gentileza é nossa linguagem',
    ];
    for (const c of cards) {
      expect(screen.getByText(c)).toBeInTheDocument();
    }
  });

  it('exposes a Sobre-specific metadata', () => {
    expect(metadata.title).toMatch(/Sobre/);
    expect(metadata.description).toMatch(/Terra Gentil/);
  });
});
