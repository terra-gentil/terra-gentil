// Testes do catálogo de capas: gênero só quando seguro, tema antes da planta, temas casados.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { vezesDoSlug } from './banco.mjs';
import { TEMAS, entradaDaEspecie, entradasDoPost } from './catalogo.mjs';

const { especies } = lerJson(path.join(DADOS, 'capas.json'));
const slug = (especie) => entradaDaEspecie(especie, especies)?.slug ?? null;

test('chave de gênero e lista "generos" casam a espécie do post', () => {
  assert.equal(slug('Phalaenopsis amabilis'), 'orquidea');
  assert.equal(slug('Echeveria elegans'), 'suculenta');
  assert.equal(slug('Mammillaria elongata'), 'cacto');
  assert.equal(slug('Fragaria vesca'), 'morango');
  assert.equal(slug('Begonia rex'), 'begonia');
  assert.equal(slug('Cattleya intermedia'), 'catleia');
  assert.equal(slug('Epipremnum aureum'), 'jiboia');
});

test('gênero de chave completa não arrasta outra planta, e gênero repetido não escolhe', () => {
  assert.equal(slug('Solanum tuberosum'), null);
  assert.equal(slug('Allium sativum'), null);
  assert.equal(slug('Citrus sinensis'), null);
  assert.equal(slug('Dracaena fragrans'), null);
  assert.equal(slug('coringa-praga'), null);
});

test('tema com coringa vem antes da planta; tema sem coringa é ignorado', () => {
  const slugs = (post) => entradasDoPost(post, especies).map((e) => e.slug);
  assert.deepEqual(slugs({ especie: 'Solanum lycopersicum', tema: 'praga' }), [
    'coringa-praga',
    'tomate',
  ]);
  assert.deepEqual(slugs({ especie: 'Solanum lycopersicum', tema: 'xyz' }), ['tomate']);
  assert.deepEqual(slugs('Aloe vera'), ['babosa']);
});

test('todo tema tem coringa no catálogo e todo coringa é um tema', () => {
  const coringas = Object.values(especies)
    .filter((e) => e.coringa)
    .map((e) => e.slug);
  assert.deepEqual(coringas.sort(), TEMAS.map((t) => `coringa-${t}`).sort());
});

test('rodízio conta pelo slug: espécies do mesmo gênero e o tema somam juntos', () => {
  const posts = [
    { dia: '2026-10-01', especie: 'Phalaenopsis amabilis' },
    { dia: '2026-10-02', especie: 'Phalaenopsis aphrodite' },
    { dia: '2026-10-03', especie: 'Rosa chinensis', tema: 'praga' },
    { dia: '2026-10-04', especie: 'Solanum lycopersicum', tema: 'praga' },
  ];
  assert.equal(vezesDoSlug('orquidea', posts, '2026-11-01', especies), 2);
  assert.equal(vezesDoSlug('coringa-praga', posts, '2026-11-01', especies), 2);
  assert.equal(vezesDoSlug('coringa-praga', posts, '2026-10-04', especies), 1);
});
