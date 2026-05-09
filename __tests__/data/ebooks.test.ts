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
    // Codigo Secreto e o item 0 do array (defaultEbook): keywords vazio mas
    // ainda aparece no catalogo. Os outros 18 tem keywords pra match.
    expect(ebooks[0]).toEqual(defaultEbook);
    expect(ebooks[0].keywords).toHaveLength(0);

    for (const e of ebooks) {
      expect(e.title).toBeTruthy();
      // Aceita path relativo (/ebooks/...) ou URL absoluta (https://...)
      expect(e.image).toMatch(/^(https?:\/\/|\/ebooks\/)/);
      expect(e.pdf).toMatch(/^(https?:\/\/|\/ebooks\/)/);
      expect(Array.isArray(e.keywords)).toBe(true);
    }
    for (const e of ebooks.slice(1)) {
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
