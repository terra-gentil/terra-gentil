// Testes da pauta a partir de notícia: lista de fontes, domínio e montagem da entrada.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acharFonte, carregarFontes, dominioDe, pautaDeNoticia } from './noticias.mjs';

const fontes = carregarFontes();
const noticia = {
  url: 'https://www.gardeningknowhow.com/ornamental/shrubs/hydrangea/pruning.htm',
  titulo: 'How to Prune Hydrangeas',
  serie: '5 cuidados',
  especie: 'hortênsia',
  gancho: 'Podar na hora errada tira as flores do ano',
};

test('fontes: domínio único e sem www nem barra', () => {
  const dominios = fontes.map((f) => f.dominio);
  assert.equal(new Set(dominios).size, dominios.length);
  for (const d of dominios) assert.match(d, /^[a-z0-9-]+(\.[a-z0-9-]+)+$/);
});

test('domínio vem em minúsculo e sem www', () => {
  assert.equal(dominioDe('https://www.RHS.org.uk/advice/x'), 'rhs.org.uk');
  assert.throws(() => dominioDe('isso não é link'), /link inválido/);
  assert.throws(() => dominioDe('javascript:alert(1)'), /http\(s\)/);
});

test('aceita subdomínio da fonte e recusa domínio parecido', () => {
  assert.equal(acharFonte(fontes, 'https://blog.rhs.org.uk/a')?.nome, 'RHS Advice');
  assert.equal(acharFonte(fontes, 'https://malrhs.org.uk/a'), null);
  assert.equal(acharFonte(fontes, 'https://rhs.org.uk.golpe.com/a'), null);
});

test('monta o rascunho com a fonte e sem texto copiado', () => {
  const pauta = pautaDeNoticia(noticia, fontes);
  assert.equal(pauta.origem, 'noticia');
  assert.equal(pauta.status, 'rascunho');
  assert.deepEqual(pauta.pontos, []);
  assert.equal(pauta.palavra, null);
  assert.deepEqual(pauta.fontes, [
    { nome: 'Gardening Know How', url: noticia.url, titulo: noticia.titulo },
  ]);
});

test('recusa fonte fora da lista, série inventada e campo faltando', () => {
  const fora = { ...noticia, url: 'https://blog.com/a' };
  assert.throws(() => pautaDeNoticia(fora, fontes), /fora da lista/);
  assert.throws(() => pautaDeNoticia({ ...noticia, serie: 'Dica do dia' }, fontes), /série/);
  assert.throws(() => pautaDeNoticia({ ...noticia, gancho: '' }, fontes), /gancho/);
});
