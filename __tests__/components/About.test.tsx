import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '@/components/sections/About';

describe('About', () => {
  it('renders the headline and André attribution', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/quintais mais esquecidos/i);
    expect(screen.getByText(/André/)).toBeInTheDocument();
  });

  it('renders the 4 stat cards', () => {
    render(<About />);
    for (const v of ['90%', '95%', '80%', '75%']) {
      expect(screen.getByText(v)).toBeInTheDocument();
    }
  });

  it('links to /sobre via "Conheça nossa história"', () => {
    render(<About />);
    const link = screen.getByRole('link', { name: /conheça nossa história/i });
    expect(link).toHaveAttribute('href', '/sobre');
  });
});
