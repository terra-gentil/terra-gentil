// Cobertura do banco: para cada entrada do catálogo, quantas capas aprovadas e se o post alcança.
import fs from 'node:fs';
import { aprovadasDo } from './banco.mjs';
import { CIENTIFICO, TEMAS, entradaDaEspecie } from './catalogo.mjs';

// Um post válido que chega na entrada, ou null se nenhum chega (capa parada em silêncio).
// Espécie: a própria chave, se for "Gênero espécie", ou "<gênero> sp" pelo gênero seguro.
export function postQueAlcanca(chave, entrada, catalogo) {
  if (entrada.coringa) {
    const tema = entrada.slug.replace(/^coringa-/, '');
    return chave === entrada.slug && TEMAS.includes(tema) ? { tema } : null;
  }
  // Gêneros da lista primeiro: o cacto aparece como "Opuntia sp", não como "Cactaceae sp".
  const generos = [...(entrada.generos ?? []), chave.split(/\s+/)[0]];
  const candidatas = [chave, ...generos.map((g) => `${g} sp`)].filter((e) => CIENTIFICO.test(e));
  const especie = candidatas.find((e) => entradaDaEspecie(e, catalogo) === entrada);
  return especie ? { especie } : null;
}

// Pastas de capas/banco sem entrada no catálogo: fotos que nenhum post pode usar.
export function pastasOrfas(catalogo, pastaBanco) {
  const slugs = new Set(Object.values(catalogo).map((e) => e.slug));
  return fs
    .readdirSync(pastaBanco, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !slugs.has(d.name))
    .map((d) => d.name);
}

// Uma linha por entrada: { chave, slug, nome, aprovadas, alcanca } (alcanca = post de exemplo).
export function cobertura(catalogo, opcoes) {
  return Object.entries(catalogo).map(([chave, e]) => ({
    chave,
    slug: e.slug,
    nome: e.nome,
    aprovadas: aprovadasDo(e.slug, opcoes).length,
    alcanca: postQueAlcanca(chave, e, catalogo),
  }));
}
