import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/layout/Header';

describe('Header', () => {
  it('renders the brand and main nav links', () => {
    render(<Header />);
    expect(screen.getByAltText('Terra Gentil')).toBeInTheDocument();
    expect(screen.getAllByText('Terra Gentil').length).toBeGreaterThan(0);
    for (const label of ['Home', 'Sobre', 'Blog', 'Transformações', 'Vídeos', 'Equipamentos']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    }
  });

  it('toggles mobile menu when the menu button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(screen.getAllByRole('link', { name: 'Sobre' }).length).toBe(1);

    await user.click(menuButton);
    expect(screen.getAllByRole('link', { name: 'Sobre' }).length).toBe(2);

    await user.click(menuButton);
    expect(screen.getAllByRole('link', { name: 'Sobre' }).length).toBe(1);
  });

  it('closes mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    const aboutLinks = screen.getAllByRole('link', { name: 'Sobre' });
    await user.click(aboutLinks[1]);
    expect(screen.getAllByRole('link', { name: 'Sobre' }).length).toBe(1);
  });
});
