import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/sections/Hero';

describe('Hero', () => {
  it('renders the main headline and tagline', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/quintais esquecidos/i);
    expect(screen.getByText(/poder da gentileza/i)).toBeInTheDocument();
  });

  it('CTA "Diagnosticar minha planta" anchors the doutor section', () => {
    render(<Hero />);
    const link = screen.getByRole('link', { name: /diagnosticar minha planta/i });
    expect(link).toHaveAttribute('href', '#doutor');
  });

  it('CTA "Assistir no YouTube" opens the channel in a new tab', () => {
    render(<Hero />);
    const link = screen.getByRole('link', { name: /assistir no youtube/i });
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/@TerraGentil');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
