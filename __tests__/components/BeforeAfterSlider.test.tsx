import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';

describe('BeforeAfterSlider', () => {
  it('renderiza role=slider com aria-valuenow=initialPosition', () => {
    render(
      <BeforeAfterSlider
        before="/before.jpg"
        after="/after.jpg"
        alt="quintal"
        initialPosition={30}
      />,
    );
    const slider = screen.getByRole('slider', { name: /quintal/i });
    expect(slider).toHaveAttribute('aria-valuenow', '30');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('renderiza imagens antes/depois com alt acessivel', () => {
    render(<BeforeAfterSlider before="/b.jpg" after="/a.jpg" alt="quintal" />);
    expect(screen.getByAltText('quintal antes')).toBeInTheDocument();
    expect(screen.getByAltText('quintal depois')).toBeInTheDocument();
  });

  it('ArrowRight incrementa aria-valuenow em 5 (com clamp em 100)', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterSlider before="/b.jpg" after="/a.jpg" alt="x" initialPosition={50} />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    await user.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  it('ArrowLeft / Home descem ate 0 sem ultrapassar', async () => {
    const user = userEvent.setup();
    render(<BeforeAfterSlider before="/b.jpg" after="/a.jpg" alt="x" initialPosition={10} />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    await user.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    await user.keyboard('{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });
});
