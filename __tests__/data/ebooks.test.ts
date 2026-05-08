import { describe, it, expect } from 'vitest';
import { findEbookForPlant, defaultEbook, ebooks } from '@/data/ebooks';

describe('findEbookForPlant', () => {
  it('matches case-insensitive', () => {
    const a = findEbookForPlant('ESPADA DE SÃO JORGE');
    const b = findEbookForPlant('Espada de São Jorge');
    expect(a.title).toBe(b.title);
    expect(a.title).toContain('Esquadrão Imortal');
  });

  it('matches a substring inside a longer plantName', () => {
    const ebook = findEbookForPlant('Suculenta Echeveria elegans roxa');
    expect(ebook.title).toContain('Suculentas');
  });

  it('matches the first ebook whose keyword appears (priority by order)', () => {
    const ebook = findEbookForPlant('lavanda');
    expect(ebook.title).toContain('Terapêutico');
  });

  it('returns defaultEbook when no keyword matches', () => {
    const ebook = findEbookForPlant('planta totalmente desconhecida xpto');
    expect(ebook).toEqual(defaultEbook);
  });

  it('returns defaultEbook for empty string', () => {
    expect(findEbookForPlant('')).toEqual(defaultEbook);
  });

  it('every ebook has the required fields', () => {
    for (const e of ebooks) {
      expect(e.title).toBeTruthy();
      expect(e.image).toMatch(/^https?:\/\//);
      expect(e.pdf).toMatch(/^https?:\/\//);
      expect(Array.isArray(e.keywords)).toBe(true);
      expect(e.keywords.length).toBeGreaterThan(0);
    }
  });

  it('matches "rosa do deserto" via composite keyword', () => {
    const ebook = findEbookForPlant('Rosa do deserto vermelha');
    expect(ebook.title).toContain('Rosa do Deserto');
  });

  it('matches morango via partial keyword morangueiro', () => {
    const ebook = findEbookForPlant('Cuidando do meu morangueiro');
    expect(ebook.title).toContain('Morangos');
  });
});
