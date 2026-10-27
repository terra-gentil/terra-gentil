// Testa o cálculo do fator de encolhimento das linhas do título (a parte pura do auto-fit).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fatorDeEncolhimento } from './tratamento-texto.mjs';

test('não encolhe quando a linha mais larga cabe', () => {
  assert.equal(fatorDeEncolhimento([500, 940], 952), 1);
});

test('encolhe todas as linhas pela proporção da mais larga', () => {
  assert.equal(fatorDeEncolhimento([500, 1190], 952), 0.8);
});

test('nunca passa do mínimo, quem estoura é avisado pela medição de estouro', () => {
  assert.equal(fatorDeEncolhimento([3000], 952), 0.55);
  assert.equal(fatorDeEncolhimento([3000], 952, 0.7), 0.7);
});

test('sem linhas, fator 1', () => {
  assert.equal(fatorDeEncolhimento([], 952), 1);
});
