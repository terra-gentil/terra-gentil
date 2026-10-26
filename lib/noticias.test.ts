import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { dataLonga, leiaTambem, lerNoticias, noticiaPorSlug, type Pastas } from './noticias';

const materia = (slug: string) => ({
  slug,
  titulo: `Título ${slug}`,
  descricao: 'd'.repeat(150),
  introducao: 'Intro.',
  secoes: [{ titulo: 'S', paragrafos: ['P.'], fatosUsados: [0] }],
  faq: [],
  conclusao: 'Fim.',
});

let raiz: string;
let pastas: Pastas;

const gravarPost = (nome: string, extra: Record<string, unknown>) =>
  fs.writeFileSync(
    path.join(pastas.posts, nome),
    JSON.stringify({ dia: nome.slice(0, 10), palavra: 'CODIGO', nome: 'Jiboia', ...extra }),
  );

beforeEach(() => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'noticias-'));
  pastas = {
    posts: path.join(raiz, 'posts'),
    palavras: path.join(raiz, 'palavras.json'),
    publico: path.join(raiz, 'publico'),
  };
  fs.mkdirSync(pastas.posts);
  fs.writeFileSync(
    pastas.palavras,
    JSON.stringify({ palavras: [{ palavra: 'CODIGO', titulo: 'O Código', pdf: 'a b.pdf' }] }),
  );
});

afterEach(() => fs.rmSync(raiz, { recursive: true, force: true }));

describe('lerNoticias', () => {
  it('lista só posts com matéria, do mais novo para o mais antigo', () => {
    gravarPost('2026-10-26-codigo.json', { materia: materia('velha') });
    gravarPost('2026-10-27-codigo.json', { materia: materia('nova') });
    gravarPost('2026-10-25-codigo.json', {});
    expect(lerNoticias(pastas).map((n) => n.slug)).toEqual(['nova', 'velha']);
  });

  it('liga o ebook pela palavra-chave e escapa o nome do PDF', () => {
    gravarPost('2026-10-27-codigo.json', { materia: materia('nova') });
    expect(lerNoticias(pastas)[0].ebook).toEqual({ titulo: 'O Código', url: '/ebooks/a%20b.pdf' });
  });

  it('acha a capa e o crédito quando o workflow já gravou', () => {
    gravarPost('2026-10-27-codigo.json', { materia: materia('nova') });
    expect(lerNoticias(pastas)[0].capa).toBeNull();
    fs.mkdirSync(path.join(pastas.publico, 'nova'), { recursive: true });
    fs.writeFileSync(path.join(pastas.publico, 'nova', 'capa.jpg'), 'x');
    fs.writeFileSync(path.join(pastas.publico, 'nova', 'capa.json'), '{"credito":"Foto: Ana"}');
    expect(lerNoticias(pastas)[0].capa).toEqual({ src: '/noticias/nova/capa.jpg', credito: 'Foto: Ana' });
  });

  it('slug repetido fica com o post mais novo', () => {
    gravarPost('2026-10-26-codigo.json', { materia: { ...materia('x'), titulo: 'Velho' } });
    gravarPost('2026-10-27-codigo.json', { materia: { ...materia('x'), titulo: 'Novo' } });
    const lista = lerNoticias(pastas);
    expect(lista).toHaveLength(1);
    expect(lista[0].materia.titulo).toBe('Novo');
  });

  it('sem pasta de posts devolve lista vazia', () => {
    expect(lerNoticias({ ...pastas, posts: path.join(raiz, 'nao-existe') })).toEqual([]);
  });
});

describe('noticiaPorSlug e leiaTambem', () => {
  it('acha por slug e sugere as outras sem repetir a atual', () => {
    for (const [i, s] of ['a', 'b', 'c', 'd', 'e'].entries()) {
      gravarPost(`2026-10-2${i}-codigo.json`, { materia: materia(s) });
    }
    expect(noticiaPorSlug('c', pastas)?.slug).toBe('c');
    expect(noticiaPorSlug('zzz', pastas)).toBeUndefined();
    const outras = leiaTambem('e', 3, pastas).map((n) => n.slug);
    expect(outras).toEqual(['d', 'c', 'b']);
  });
});

describe('dataLonga', () => {
  it('escreve a data em português sem depender do fuso do servidor', () => {
    expect(dataLonga('2026-10-27')).toBe('27 de outubro de 2026');
  });
});
