import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Transformations from '@/components/sections/Transformations';
import { transformations } from '@/data/transformations';

describe('Transformations section', () => {
  it('renders one slider per transformation with antes/depois badges', () => {
    render(<Transformations />);

    expect(screen.getAllByText('ANTES').length).toBe(transformations.length);
    expect(screen.getAllByText('DEPOIS').length).toBe(transformations.length);

    for (const t of transformations) {
      expect(screen.getByText(t.title)).toBeInTheDocument();
      expect(screen.getByAltText(`${t.title} antes`)).toBeInTheDocument();
      expect(screen.getByAltText(`${t.title} depois`)).toBeInTheDocument();
    }
  });

  it('links to the full transformations page', () => {
    render(<Transformations />);
    const link = screen.getByRole('link', { name: /todas as transformações/i });
    expect(link).toHaveAttribute('href', '/transformacoes');
  });
});
