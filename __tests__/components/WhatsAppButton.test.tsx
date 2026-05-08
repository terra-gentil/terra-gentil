import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

describe('WhatsAppButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders link with WhatsApp number, encoded message and accessibility attrs', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.getAttribute('href')).toContain('wa.me/5511920938591');
    expect(link.getAttribute('href')).toContain('text=');
    expect(link.getAttribute('href')).toContain('Terra%20Gentil');
  });

  it('starts hidden and becomes visible after the timeout', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link.className).toContain('opacity-0');

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(link.className).toContain('opacity-100');
  });
});
