// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { listarGuias } from '@/lib/guias';
import { TEMAS, temaDe } from '@/lib/temas';

describe('temas da colecao', () => {
  const guias = listarGuias();
  const codigosComTema = TEMAS.flatMap((t) => t.codigos);

  it('todo livro publicado tem tema declarado (senao some da teia de links do seu assunto)', () => {
    const semTema = guias.map((g) => g.codigo).filter((c) => !codigosComTema.includes(c));
    expect(semTema).toEqual([]);
  });

  it('nenhum livro esta em dois temas', () => {
    const repetidos = codigosComTema.filter((c, i) => codigosComTema.indexOf(c) !== i);
    expect(repetidos).toEqual([]);
  });

  it('todo tema publicado tem pelo menos 2 livros para se indicarem', () => {
    for (const t of TEMAS) {
      const n = guias.filter((g) => temaDe(g.codigo).id === t.id).length;
      if (n) expect(n, t.id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('ebooks antigos com pagina nova', () => {
  it('todo destino do mapa existe como pagina publicada e todo PDF do mapa existe no site', async () => {
    const { PAGINA_DO_EBOOK_ANTIGO } = await import('@/lib/temas');
    const { ebooks } = await import('@/data/ebooks');
    const slugs = listarGuias().map((g) => g.slug);
    const pdfs = ebooks.map((e) => e.pdf.split('/').pop());
    for (const [pdf, slug] of Object.entries(PAGINA_DO_EBOOK_ANTIGO)) {
      expect(slugs, slug).toContain(slug);
      expect(pdfs, pdf).toContain(pdf);
    }
  });
});
