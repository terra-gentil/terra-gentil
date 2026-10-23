// Garante que todo .mjs do subprojeto respeita os limites e tem cabeçalho.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './config.mjs';
import { listarCodigo, problemasDoTexto } from './limites.mjs';

test('todo arquivo .mjs está dentro dos limites', () => {
  const arquivos = listarCodigo(RAIZ);
  assert.ok(arquivos.length > 0, 'nenhum .mjs encontrado');
  const falhas = arquivos
    .map((arq) => [path.relative(RAIZ, arq), problemasDoTexto(fs.readFileSync(arq, 'utf8'))])
    .filter(([, problemas]) => problemas.length > 0)
    .map(([arq, problemas]) => `${arq}: ${problemas.join('; ')}`);
  assert.deepEqual(falhas, [], 'Fatie o arquivo por responsabilidade; não suba o limite.');
});

test('o verificador acusa arquivo grande, linha longa e falta de cabeçalho', () => {
  const limites = { linhasPorArquivo: 3, caracteresPorArquivo: 50, caracteresPorLinha: 10 };
  const ruim = ['sem cabeçalho', 'a', 'b', 'c'].join('\n');
  const problemas = problemasDoTexto(ruim, limites);
  assert.equal(problemas.length, 3);
  assert.match(problemas[0], /4 linhas/);
  assert.match(problemas[1], /linha 1/);
  assert.match(problemas[2], /cabeçalho/);
});

test('arquivo bom passa sem problemas', () => {
  assert.deepEqual(problemasDoTexto('// faz algo\nexport const x = 1;\n'), []);
});
