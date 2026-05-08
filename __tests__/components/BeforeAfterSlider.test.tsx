import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';

describe('BeforeAfterSlider', () => {
  const defaultProps = {
    before: '/images/transformacao-1-antes.jpeg',
    after: '/images/transformacao-1-depois.jpeg',
    alt: 'Quintal',
  };

  it('renders both images and the badges', () => {
    render(<BeforeAfterSlider {...defaultProps} />);
    expect(screen.getByAltText('Quintal antes').getAttribute('src')).toContain('transformacao-1-antes');
    expect(screen.getByAltText('Quintal depois').getAttribute('src')).toContain('transformacao-1-depois');
    expect(screen.getByText('ANTES')).toBeInTheDocument();
    expect(screen.getByText('DEPOIS')).toBeInTheDocument();
  });

  it('exposes slider semantics for screen readers', () => {
    render(<BeforeAfterSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('tabIndex', '0');
  });

  it('respects initialPosition', () => {
    render(<BeforeAfterSlider {...defaultProps} initialPosition={25} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
  });

  it('updates position on mouse down + drag', () => {
    render(<BeforeAfterSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');

    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 150, right: 200, bottom: 150, x: 0, y: 0, toJSON: () => ({}) }),
      configurable: true,
    });

    fireEvent.mouseDown(slider, { clientX: 50 });
    expect(slider).toHaveAttribute('aria-valuenow', '25');

    fireEvent.mouseMove(slider, { clientX: 150 });
    expect(slider).toHaveAttribute('aria-valuenow', '75');

    fireEvent.mouseUp(slider);
    fireEvent.mouseMove(slider, { clientX: 100 });
    expect(slider).toHaveAttribute('aria-valuenow', '75');
  });

  it('clamps position to [0, 100] when mouse goes outside the container', () => {
    render(<BeforeAfterSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 150, right: 200, bottom: 150, x: 0, y: 0, toJSON: () => ({}) }),
      configurable: true,
    });

    fireEvent.mouseDown(slider, { clientX: -50 });
    expect(slider).toHaveAttribute('aria-valuenow', '0');

    fireEvent.mouseMove(slider, { clientX: 9999 });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  it('stops dragging when mouse leaves container', () => {
    render(<BeforeAfterSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 150, right: 200, bottom: 150, x: 0, y: 0, toJSON: () => ({}) }),
      configurable: true,
    });
    fireEvent.mouseDown(slider, { clientX: 100 });
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    fireEvent.mouseLeave(slider);
    fireEvent.mouseMove(slider, { clientX: 30 });
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('moves with arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');

    slider.focus();
    expect(slider).toHaveAttribute('aria-valuenow', '50');

    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '55');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '45');

    await user.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');

    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');

    await user.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });
});
