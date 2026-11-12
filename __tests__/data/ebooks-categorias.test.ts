import { describe, it, expect } from 'vitest';
import { ebooks, ebookCategorias } from '@/data/ebooks';
import { PAGINA_DO_EBOOK_ANTIGO } from '@/lib/temas';
import { listarGuias } from '@/lib/guias';

describe('categorias dos ebooks', () => {
  it('todo ebook tem categoria existente', () => {
    const ids = new Set(ebookCategorias.map((c) => c.id));
    for (const e of ebooks) expect(ids.has(e.categoria)).toBe(true);
  });

  it('nao ha PDF repetido', () => {
    expect(new Set(ebooks.map((e) => e.pdf)).size).toBe(ebooks.length);
  });

  it('paginas novas dos ebooks antigos existem na colecao', () => {
    const slugs = new Set(listarGuias().map((g) => g.slug));
    for (const slug of Object.values(PAGINA_DO_EBOOK_ANTIGO)) expect(slugs.has(slug)).toBe(true);
  });
});
