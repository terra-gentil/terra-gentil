import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlantDoctor from '@/components/sections/PlantDoctor';
import type { Diagnosis } from '@/types/diagnosis';

const mockDiagnosis: Diagnosis = {
  plantName: 'Manjericão',
  scientificName: 'Ocimum basilicum',
  welcomeMessage: 'Bem-vindo ao consultório.',
  stats: { light: 'Sol pleno', watering: '2x/semana', temperature: '20-30C', difficulty: 'Fácil' },
  toxicity: { isToxic: false, details: 'Comestível' },
  diagnosis: { problem: 'Folhas amareladas', description: 'Provável excesso de água.' },
  treatment: [{ period: 'Hoje', action: 'Reduzir rega' }],
};

const fileFromString = () =>
  new File(['fake-bytes'], 'planta.jpg', { type: 'image/jpeg' });

describe('PlantDoctor', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('estado inicial mostra Tirar foto + Galeria, sem upload anterior', () => {
    render(<PlantDoctor />);
    expect(screen.getByRole('button', { name: /Tirar foto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Galeria/i })).toBeInTheDocument();
    expect(screen.getByText(/pronto pra te ouvir/i)).toBeInTheDocument();
    expect(screen.queryByAltText(/Manjericão/)).toBeNull();
  });

  it('upload com sucesso mostra diagnostico, stats e botao de nova consulta', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockDiagnosis,
    });

    render(<PlantDoctor />);

    const galleryBtn = screen.getByRole('button', { name: /Galeria/i });
    // Acha o input file do tipo galeria (sem capture).
    const fileInput = document.querySelectorAll<HTMLInputElement>('input[type="file"]')[1];
    expect(fileInput).toBeDefined();
    expect(galleryBtn).toBeInTheDocument();

    await userEvent.upload(fileInput, fileFromString());

    await waitFor(() => {
      expect(screen.getByText('Manjericão')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Ocimum basilicum')).toBeInTheDocument();
    expect(screen.getByText('Sol pleno')).toBeInTheDocument();
    expect(screen.getByText(/Planta segura/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nova consulta/i })).toBeInTheDocument();
  });

  it('resposta notPlant mostra alerta amarelo + botao reset', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ notPlant: true, message: 'Vejo um sapato, não uma planta.' }),
    });

    render(<PlantDoctor />);
    const fileInput = document.querySelectorAll<HTMLInputElement>('input[type="file"]')[1];
    await userEvent.upload(fileInput, fileFromString());

    await waitFor(() => {
      expect(screen.getByText(/Vejo um sapato/)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByRole('button', { name: /Tentar outra foto/i })).toBeInTheDocument();
  });

  it('erro de rede mostra mensagem real do backend e botao tentar de novo', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Imagem muito escura, tente com mais luz.' }),
    });

    render(<PlantDoctor />);
    const fileInput = document.querySelectorAll<HTMLInputElement>('input[type="file"]')[1];
    await userEvent.upload(fileInput, fileFromString());

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/muito escura/);
    }, { timeout: 3000 });

    expect(screen.getByRole('button', { name: /Tentar de novo/i })).toBeInTheDocument();
  });
});
