// Testes da escolha de foto.
import test from 'node:test';
import assert from 'node:assert/strict';
import { escolherFoto, serve, creditoDe } from './escolher.mjs';

const foto = (extra = {}) => ({
  provedor: 'commons',
  titulo: 'x.jpg',
  url: 'https://u/x.jpg',
  largura: 1600,
  altura: 2000,
  mime: 'image/jpeg',
  autor: 'Maria',
  licenca: 'CC BY 4.0',
  compartilhaIgual: false,
  ...extra,
});

test('recusa horizontal, quadrada, pequena e não jpeg', () => {
  assert.equal(serve(foto({ largura: 2000, altura: 1500 })), false);
  assert.equal(serve(foto({ largura: 2000, altura: 2000 })), false);
  assert.equal(serve(foto({ largura: 800, altura: 1200 })), false);
  assert.equal(serve(foto({ mime: 'image/png' })), false);
  assert.equal(serve(foto()), true);
});

test('CC BY-SA só passa se pedirem', () => {
  const sa = foto({ licenca: 'CC BY-SA 4.0', compartilhaIgual: true });
  assert.equal(serve(sa), false);
  assert.equal(serve(sa, { aceitarCompartilhaIgual: true }), true);
});

test('sem autor só passa com CC0 ou domínio público', () => {
  assert.equal(serve(foto({ autor: null })), false);
  assert.equal(serve(foto({ autor: null, licenca: 'CC0' })), true);
  assert.equal(serve(foto({ autor: null, licenca: 'Public domain' })), true);
});

test('prefere a proporção mais perto de 4:5 e ignora fotos já usadas', () => {
  const comprida = foto({ url: 'https://u/comprida.jpg', largura: 1200, altura: 2400 });
  const quase = foto({ url: 'https://u/quase.jpg', largura: 1600, altura: 2000 });
  assert.equal(escolherFoto([comprida, quase]).foto.url, quase.url);
  assert.equal(escolherFoto([comprida, quase], { vistas: [quase.url] }).foto.url, comprida.url);
});

test('sem candidato bom devolve null', () => {
  assert.equal(escolherFoto([foto({ largura: 100 })]), null);
});

test('crédito traz autor, fonte e licença', () => {
  assert.equal(creditoDe(foto()), 'Foto: Maria / Wikimedia Commons (CC BY 4.0)');
  assert.equal(creditoDe(foto({ autor: null, licenca: 'CC0' })), 'Foto: Wikimedia Commons (CC0)');
});
