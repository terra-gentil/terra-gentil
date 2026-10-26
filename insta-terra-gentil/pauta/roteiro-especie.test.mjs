// Testa a regra de especie (nome científico) e nome popular não genérico do post.
import test from 'node:test';
import assert from 'node:assert/strict';
import { conferirPost } from './roteiro.mjs';

test('especie precisa ser nome científico e nome não pode ser genérico', () => {
  const ctx = { livro: { palavra: 'X', titulo: 'T' }, paginas: {} };
  const p1 = conferirPost({ especie: 'Jiboia', nome: 'planta' }, ctx).join('|');
  assert.match(p1, /"especie" deve ser o nome científico/);
  assert.match(p1, /"nome" genérico/);
  const p2 = conferirPost({ especie: 'Epipremnum aureum', nome: 'Jiboia' }, ctx).join('|');
  assert.doesNotMatch(p2, /"especie" deve ser|"nome" genérico/);
});
