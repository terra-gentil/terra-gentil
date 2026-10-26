// Testes da rotação diária dos moldes do carrossel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOLDES, diaBrasilia, moldeDoDia } from './rotacao.mjs';

test('cada dia da semana tem o seu molde, de segunda a domingo', () => {
  const semana = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'];
  semana.push('2026-10-31', '2026-11-01');
  assert.deepEqual(
    semana.map((d) => moldeDoDia(d)),
    [...MOLDES],
  );
});

test('a semana seguinte repete a mesma ordem', () => {
  assert.equal(moldeDoDia('2026-11-02'), moldeDoDia('2026-10-26'));
  assert.equal(moldeDoDia('2027-01-04'), MOLDES[0]);
});

test('nunca repete o molde de ontem, inclusive na virada de mês e de ano', () => {
  for (const [ontem, hoje] of [
    ['2026-10-31', '2026-11-01'],
    ['2026-12-31', '2027-01-01'],
    ['2028-02-28', '2028-02-29'],
  ]) {
    assert.notEqual(moldeDoDia(ontem), moldeDoDia(hoje));
  }
});

test('escala: com 3 ou 10 moldes o ciclo fecha e nenhum dia repete o anterior', () => {
  for (const n of [3, 10]) {
    const moldes = Array.from({ length: n }, (_, i) => `m${i}`);
    const dia = (i) => `2026-11-${String(1 + i).padStart(2, '0')}`;
    const dias = Array.from({ length: n + 1 }, (_, i) => dia(i));
    const usados = dias.map((d) => moldeDoDia(d, moldes));
    assert.equal(new Set(usados.slice(0, n)).size, n);
    assert.equal(usados[n], usados[0]);
  }
});

test('o dia vira no fuso de Brasília: 22h de Brasília ainda é o dia 26', () => {
  assert.equal(diaBrasilia(new Date('2026-10-27T01:00:00Z')), '2026-10-26');
  assert.equal(diaBrasilia(new Date('2026-10-27T03:30:00Z')), '2026-10-27');
});

test('recusa dia inválido e lista de moldes vazia', () => {
  assert.throws(() => moldeDoDia('26/10/2026'), /dia inválido/);
  assert.throws(() => moldeDoDia('2026-10-26', []), /vazia/);
});
