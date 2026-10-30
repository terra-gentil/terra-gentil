// Testes do índice de capas: leitura do nome, tags, mescla e busca.
import test from 'node:test';
import assert from 'node:assert/strict';
import { entradaDoIndice, lerNomeDaCapa, mesclarIndice, porTags } from './indice.mjs';

const catalogo = { Phalaenopsis: { nome: 'orquídea', slug: 'orquidea' } };

test('lê o nome do banco e o nome baixado do Flow, A a H', () => {
  assert.deepEqual(lerNomeDaCapa('orquidea-B-1.jpg'), { slug: 'orquidea', cenario: 'B', n: 1 });
  assert.deepEqual(lerNomeDaCapa('orquidea-E-2_20261027112439.jpg'), {
    slug: 'orquidea',
    cenario: 'E',
    n: 2,
  });
  assert.equal(lerNomeDaCapa('orquidea-H-1.jpg').cenario, 'H');
  assert.equal(lerNomeDaCapa('orquidea-I-1.jpg'), null);
  assert.equal(lerNomeDaCapa('foto.jpg'), null);
});

test('entrada leva espécie, cenário e tags', () => {
  const e = entradaDoIndice({ slug: 'orquidea', cenario: 'E', n: 1 }, catalogo);
  assert.equal(e.id, 'orquidea-E-1');
  assert.equal(e.especie, 'Phalaenopsis');
  assert.equal(e.arquivo, 'orquidea/orquidea-E-1.jpg');
  assert.ok(e.tags.includes('regando') && e.tags.includes('orquidea'));
});

test('slug fora do catálogo vira entrada sem espécie', () => {
  const e = entradaDoIndice({ slug: 'coringa-regar', cenario: 'A', n: 1 }, catalogo);
  assert.equal(e.especie, null);
});

test('mescla troca a mesma id e mantém ordem', () => {
  const a = entradaDoIndice({ slug: 'orquidea', cenario: 'B', n: 1 }, catalogo);
  const b = entradaDoIndice({ slug: 'orquidea', cenario: 'A', n: 1 }, catalogo);
  const novo = { ...a, largura: 1080 };
  const r = mesclarIndice([a], [b, novo]);
  assert.deepEqual(r.map((e) => e.id), ['orquidea-A-1', 'orquidea-B-1']);
  assert.equal(r[1].largura, 1080);
});

test('busca por tags exige todas', () => {
  const indice = [
    entradaDoIndice({ slug: 'orquidea', cenario: 'E', n: 1 }, catalogo),
    entradaDoIndice({ slug: 'orquidea', cenario: 'B', n: 1 }, catalogo),
  ];
  assert.equal(porTags(indice, ['orquidea', 'regando']).length, 1);
  assert.equal(porTags(indice, ['orquidea']).length, 2);
  assert.equal(porTags(indice, ['jiboia']).length, 0);
});
