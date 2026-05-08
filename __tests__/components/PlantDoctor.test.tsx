import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlantDoctor from '@/components/sections/PlantDoctor';

const mockDiagnosis = {
  plantName: 'Suculenta',
  scientificName: 'Echeveria elegans',
  welcomeMessage: 'Olá! Sua suculenta tem muito potencial.',
  toxicity: { isToxic: false, details: 'Segura para pets.' },
  diagnosis: { problem: 'Excesso de água', description: 'Folhas amareladas por rega excessiva.' },
  stats: { light: 'Pleno sol', watering: '1x semana', temperature: '20-30°C', difficulty: 'Fácil' },
  treatment: [
    { period: 'Hoje', action: 'Pare de regar.' },
    { period: 'Dia 3', action: 'Verifique o solo.' },
    { period: '1 semana', action: 'Retome rega leve.' },
  ],
};

function makeFile() {
  return new File(['fake-image'], 'planta.jpg', { type: 'image/jpeg' });
}

describe('PlantDoctor', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the upload prompt initially', () => {
    render(<PlantDoctor />);
    expect(screen.getByText(/toque para enviar uma foto/i)).toBeInTheDocument();
  });

  it('renders diagnosis on successful API response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockDiagnosis), { status: 200 }),
    );

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    render(<PlantDoctor />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    await user.upload(fileInput, makeFile());

    await waitFor(() => {
      expect(screen.getByText('Suculenta')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText('Echeveria elegans')).toBeInTheDocument();
    expect(screen.getByText(/excesso de água/i)).toBeInTheDocument();
    expect(screen.getByText(/Pare de regar/)).toBeInTheDocument();
    expect(screen.getByText(/planta segura/i)).toBeInTheDocument();
  });

  it('renders error fallback when API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('error', { status: 500 }));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    render(<PlantDoctor />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, makeFile());

    await waitFor(() => {
      expect(screen.getByText(/falha na análise/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('reset button returns to upload prompt', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('error', { status: 500 }));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
    render(<PlantDoctor />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, makeFile());

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument(),
      { timeout: 5000 },
    );

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(screen.getByText(/toque para enviar uma foto/i)).toBeInTheDocument();
  });
});
