// Testes da rotação diária dos moldes do carrossel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOLDES, diaBrasilia, moldeDoDia } from './rotacao.mjs';

test('três dias seguidos usam três moldes diferentes e o ciclo se repete', () => {
  const dias = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29'];
  const usados = dias.map((d) => moldeDoDia(d));
  assert.equal(new Set(usados.slice(0, 3)).size, 3);
  assert.equal(usados[3], usados[0]);
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

test('o mesmo dia sempre dá o mesmo molde, e o molde é um dos aprovados', () => {
  assert.equal(moldeDoDia('2026-10-26'), moldeDoDia('2026-10-26'));
  assert.ok(MOLDES.includes(moldeDoDia('2026-10-26')));
});

test('o dia vira no fuso de Brasília: 22h de Brasília ainda é o dia 26', () => {
  assert.equal(diaBrasilia(new Date('2026-10-27T01:00:00Z')), '2026-10-26');
  assert.equal(diaBrasilia(new Date('2026-10-27T03:30:00Z')), '2026-10-27');
});

test('recusa dia inválido e lista de moldes vazia', () => {
  assert.throws(() => moldeDoDia('26/10/2026'), /dia inválido/);
  assert.throws(() => moldeDoDia('2026-10-26', []), /vazia/);
});
