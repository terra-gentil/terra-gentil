import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EquipamentosPage, { metadata } from '@/app/equipamentos/page';

describe('app/equipamentos', () => {
  it('renders the four equipment categories', () => {
    render(<EquipamentosPage />);
    for (const name of ['Roçadeiras', 'Sopradores', 'Edge de Borda', 'Vassoura Elétrica']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('renders the partnership CTA pointing to WhatsApp', () => {
    render(<EquipamentosPage />);
    const link = screen.getByRole('link', { name: /falar sobre parceria/i });
    expect(link.getAttribute('href')).toContain('wa.me/5511920938591');
    expect(link.getAttribute('href')).toContain('parceria');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows usage levels for every category', () => {
    render(<EquipamentosPage />);
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
  });

  it('exposes Equipamentos metadata', () => {
    expect(metadata.title).toMatch(/Equipamentos/);
  });
});
