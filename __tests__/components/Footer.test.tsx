import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders nav links and current year', () => {
    render(<Footer />);
    for (const label of ['Sobre', 'Blog', 'Transformações', 'Vídeos']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((t) => t.includes(year))).toBeInTheDocument();
  });

  it('renders all social links with secure target', () => {
    render(<Footer />);
    for (const label of ['YouTube', 'Instagram', 'TikTok', 'Facebook']) {
      const link = screen.getByRole('link', { name: label });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.getAttribute('href')).toMatch(/^https?:\/\//);
    }
  });
});
