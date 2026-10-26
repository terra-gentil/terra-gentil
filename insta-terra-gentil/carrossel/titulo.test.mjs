// Testa o equilíbrio das linhas do título: mexe só em linha órfã ou terminada em palavra solta.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { equilibrarTitulo } from './titulo.mjs';

test('linha órfã "e" é redistribuída', () => {
  const r = equilibrarTitulo({ linha1: 'Folha amarela', linha2: 'e', destaque: 'mole' });
  assert.deepEqual([r.linha1, r.linha2], ['Folha', 'amarela e']);
  assert.equal(r.destaque, 'mole');
});

test('linha terminando em palavra solta (não a última) é redistribuída', () => {
  const r = equilibrarTitulo({ linha1: 'Pare de', linha2: 'regar já' });
  assert.equal(`${r.linha1} ${r.linha2}`, 'Pare de regar já');
  assert.notEqual(r.linha1, 'Pare de');
});

test('título já equilibrado fica igual', () => {
  const slide = { linha1: 'Regar todo dia', linha2: 'só um', destaque: 'pouquinho' };
  assert.equal(equilibrarTitulo(slide), slide);
});

test('última linha pode terminar em "de" (emenda no destaque)', () => {
  const slide = { linha1: 'Caule comprido', linha2: 'e fino atrás de', destaque: 'luz' };
  assert.equal(equilibrarTitulo(slide), slide);
});

test('não estoura o limite de caracteres da linha', () => {
  const slide = { linha1: 'Espada-de-são-jorge', linha2: 'e', destaque: 'x' };
  const r = equilibrarTitulo(slide);
  assert.ok(r.linha1.length <= 22 && r.linha2.length <= 22);
});
