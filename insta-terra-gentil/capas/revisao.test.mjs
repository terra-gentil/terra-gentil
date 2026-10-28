// Testes da revisão do banco: a regra pura e o portão sobre o banco real de capas.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { naRaiz } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { lerRevisao, marcar, problemasDoBanco, vale } from './revisao.mjs';

test('só vale capa aprovada com o mesmo hash', () => {
  let capas = marcar({}, 'a-A-1', 'aprovada', 'h1');
  capas = marcar(capas, 'b-A-1', 'reprovada', 'h2');
  capas = marcar(capas, 'c-A-1', 'duvida', 'h3');
  capas = marcar(capas, 'd-A-1', 'pendente', 'h4');
  assert.equal(vale(capas, 'a-A-1', 'h1'), true);
  assert.equal(vale(capas, 'a-A-1', 'outro'), false);
  for (const id of ['b-A-1', 'c-A-1', 'd-A-1', 'sem-revisao']) {
    assert.equal(vale(capas, id, 'h'), false);
  }
  assert.throws(() => marcar({}, 'x', 'otimo', 'h'), /status inválido/);
});

test('banco acusa capa sem revisão, alterada ou reprovada', () => {
  const capas = {
    ok: { status: 'aprovada', sha256: 'h' },
    mudou: { status: 'aprovada', sha256: 'velho' },
    ruim: { status: 'reprovada', sha256: 'h' },
    incerta: { status: 'duvida', sha256: 'h' },
  };
  const arquivos = ['ok', 'mudou', 'ruim', 'incerta', 'nova'].map((id) => ({ id, caminho: id }));
  assert.deepEqual(problemasDoBanco(arquivos, capas, () => 'h'), [
    'mudou: mudou depois da revisão',
    'ruim: reprovada, tirar do banco',
    'nova: sem revisão',
  ]);
});

// Portão: nenhuma capa entra no banco sem veredito, nem fica nele depois de reprovada.
test('banco real: toda capa tem revisão, está intacta e nenhuma é reprovada', () => {
  const pasta = naRaiz('capas', 'banco');
  const { capas } = lerJson(path.join(pasta, 'indice.json'));
  const caminhoDe = (c) => path.join(pasta, ...c.arquivo.split('/'));
  const arquivos = capas.map((c) => ({ id: c.id, caminho: caminhoDe(c) }));
  assert.deepEqual(problemasDoBanco(arquivos, lerRevisao(pasta)), []);
});
