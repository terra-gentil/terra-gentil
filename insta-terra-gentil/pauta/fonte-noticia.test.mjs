// Testes da notícia usada como gancho no post.
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolverNoticia, problemasDaFonteNoticia } from './fonte-noticia.mjs';

const FONTES = [{ nome: 'Epic Gardening', dominio: 'epicgardening.com' }];
const URL = 'https://www.epicgardening.com/rega/';
const PAUTA = { itens: [{ url: URL, titulo: 'Rega', fonte: 'Epic Gardening' }] };

test('null passa; link da pauta vira nome, título e link', () => {
  assert.equal(resolverNoticia(null, PAUTA), null);
  const esperado = { nome: 'Epic Gardening', titulo: 'Rega', url: URL };
  assert.deepEqual(resolverNoticia(URL, PAUTA), esperado);
});

test('link fora da pauta, vazio ou sem pauta é recusado', () => {
  assert.throws(() => resolverNoticia('https://epicgardening.com/outra/', PAUTA), /fora da pauta/);
  assert.throws(() => resolverNoticia('', PAUTA), /link de um item/);
  assert.throws(() => resolverNoticia(URL, null), /fora da pauta/);
});

test('conferência: post antigo e null passam; forjado é pego', () => {
  const bom = { nome: 'Epic Gardening', titulo: 'Rega', url: URL };
  assert.deepEqual(problemasDaFonteNoticia(undefined, FONTES), []);
  assert.deepEqual(problemasDaFonteNoticia(null, FONTES), []);
  assert.deepEqual(problemasDaFonteNoticia(bom, FONTES), []);
  assert.match(problemasDaFonteNoticia({ nome: 'x' }, FONTES)[0], /nome, titulo e url/);
  const outra = { ...bom, url: 'https://outro.com/a' };
  assert.match(problemasDaFonteNoticia(outra, FONTES)[0], /fora da lista/);
  assert.match(problemasDaFonteNoticia({ ...bom, nome: 'Outro' }, FONTES)[0], /não bate/);
  assert.match(problemasDaFonteNoticia({ ...bom, url: 'lixo' }, FONTES)[0], /inválido/);
});
