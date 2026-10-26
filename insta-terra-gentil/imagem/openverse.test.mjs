// Testes do provedor Openverse, com a rede simulada.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buscarOpenverse, candidatosDeOpenverse, licencaDe } from './openverse.mjs';

const item = (extra = {}) => ({
  title: 'Monstera deliciosa',
  url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/1/original.jpg',
  width: 1536,
  height: 2048,
  filetype: 'jpg',
  creator: 'Dave Richardson',
  license: 'by',
  license_version: '4.0',
  source: 'inaturalist',
  foreign_landing_url: 'https://www.inaturalist.org/photos/1',
  ...extra,
});

test('licencaDe monta o texto do crédito e recusa NC e ND', () => {
  assert.equal(licencaDe('by', '4.0'), 'CC BY 4.0');
  assert.equal(licencaDe('cc0', '1.0'), 'CC0');
  assert.equal(licencaDe('pdm', '1.0'), 'Public domain');
  assert.equal(licencaDe('by-sa', '3.0'), 'CC BY-SA 3.0');
  assert.equal(licencaDe('by-nc', '4.0'), null);
  assert.equal(licencaDe('by-nd', '4.0'), null);
});

test('candidatosDeOpenverse traduz o resultado e nomeia a fonte', () => {
  const [c] = candidatosDeOpenverse({ results: [item()] });
  assert.equal(c.fonte, 'iNaturalist');
  assert.equal(c.mime, 'image/jpeg');
  assert.equal(c.licenca, 'CC BY 4.0');
  assert.equal(c.compartilhaIgual, false);
  assert.equal(c.autor, 'Dave Richardson');
});

test('descarta resultado sem dimensões, sem link ou com licença não livre', () => {
  const lista = [
    item({ width: null }),
    item({ height: undefined }),
    item({ url: null }),
    item({ license: 'by-nc' }),
    item(),
  ];
  assert.equal(candidatosDeOpenverse({ results: lista }).length, 1);
});

test('resposta vazia vira lista vazia', () => {
  assert.deepEqual(candidatosDeOpenverse({}), []);
});

test('buscarOpenverse pede só licença livre, vertical e grande', async () => {
  let url;
  const buscar = async (u) => {
    url = new URL(u);
    return { ok: true, json: async () => ({ results: [item()] }) };
  };
  const lista = await buscarOpenverse('Monstera deliciosa', buscar);
  assert.equal(lista.length, 1);
  assert.equal(url.searchParams.get('q'), 'Monstera deliciosa');
  assert.equal(url.searchParams.get('license'), 'cc0,by,pdm');
  assert.equal(url.searchParams.get('aspect_ratio'), 'tall');
  assert.ok(Number(url.searchParams.get('page_size')) <= 20, 'anônimo aceita até 20');
});

test('erro HTTP vira exceção', async () => {
  const buscar = async () => ({ ok: false, status: 429 });
  await assert.rejects(() => buscarOpenverse('x', buscar), /HTTP 429/);
});
