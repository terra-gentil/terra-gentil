import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransformacoesPage, { metadata } from '@/app/transformacoes/page';
import { transformations } from '@/data/transformations';

describe('app/transformacoes', () => {
  it('renders the page heading and one slider per transformation', () => {
    render(<TransformacoesPage />);
    expect(screen.getByRole('heading', { level: 1, name: /Antes e Depois/i })).toBeInTheDocument();
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(transformations.length);
    for (const t of transformations) {
      expect(screen.getByRole('heading', { level: 2, name: t.title })).toBeInTheDocument();
    }
  });

  it('exposes Transformacoes metadata', () => {
    expect(metadata.title).toMatch(/Transformações/);
  });
});
