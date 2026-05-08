import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/sections/Videos', () => ({
  default: () => <section data-testid="stub-videos"><h2>Últimos vídeos do canal</h2></section>,
}));

// PlantDoctor entra via next/dynamic na home, entao o componente real nao
// renderiza no SSR sincrono do teste (so um placeholder de loading). Confiamos
// no teste isolado em components/PlantDoctor.test.tsx.

import Home from '@/app/page';

describe('app/page (Home)', () => {
  it('renders Hero, About, Transformations and Videos sections', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1, name: /quintais esquecidos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /quintais mais esquecidos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Cada espaço tem um potencial/i })).toBeInTheDocument();
    expect(screen.getByTestId('stub-videos')).toBeInTheDocument();
  });
});
