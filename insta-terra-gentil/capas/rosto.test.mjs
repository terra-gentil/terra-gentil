// Testes do rosto: a regra pura e o portão sobre o banco real (aprovada exige rosto do André).
import test from 'node:test';
import assert from 'node:assert/strict';
import { naRaiz } from '../lib/config.mjs';
import { LIMITE_ROSTO, lerRosto, problemasDeRosto, rostoConfere } from './rosto.mjs';
import { lerRevisao } from './revisao.mjs';

test('rosto só confere com nota acima do limiar e no mesmo arquivo', () => {
  const rosto = {
    bom: { nota: 0.6, sha256: 'h' },
    baixo: { nota: LIMITE_ROSTO - 0.01, sha256: 'h' },
    sem: { nota: null, sha256: 'h' },
  };
  assert.equal(rostoConfere(rosto, 'bom', 'h'), true);
  assert.equal(rostoConfere(rosto, 'bom', 'outro'), false);
  assert.equal(rostoConfere(rosto, 'baixo', 'h'), false);
  assert.equal(rostoConfere(rosto, 'sem', 'h'), false);
  assert.equal(rostoConfere(rosto, 'nunca-vista', 'h'), false);
});

test('aprovada sem nota de rosto válida é problema; as outras não são conferidas', () => {
  const revisao = {
    a: { status: 'aprovada', sha256: 'h' },
    b: { status: 'aprovada', sha256: 'h' },
    c: { status: 'duvida', sha256: 'h' },
  };
  const rosto = { a: { nota: 0.5, sha256: 'h' }, b: { nota: 0.1, sha256: 'h' } };
  assert.deepEqual(problemasDeRosto(revisao, rosto), ['b: rosto não confere com o André']);
});

// Portão: ninguém fica "aprovada" no banco sem passar na comparação de rosto.
test('banco real: toda capa aprovada tem rosto que confere com o André', () => {
  const pasta = naRaiz('capas', 'banco');
  assert.deepEqual(problemasDeRosto(lerRevisao(pasta), lerRosto(pasta)), []);
});
