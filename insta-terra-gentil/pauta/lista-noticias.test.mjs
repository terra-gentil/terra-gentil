// Testes da lista de notícias que a rotina lê.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { listarNoticias, lerPauta } from './lista-noticias.mjs';

const AGORA = new Date('2026-10-29T04:00:00Z');
const item = (n) => ({
  titulo: `t${n}`,
  url: `https://epicgardening.com/${n}/`,
  publicadoEm: '2026-10-28T00:00:00Z',
  categorias: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  fonte: 'Epic',
});
const estado = (n, atualizadoEm) => ({
  atualizadoEm,
  itens: Array.from({ length: n }, (_, i) => item(i)),
});

test('limita a quantidade, corta categorias e conta o total', () => {
  const r = listarNoticias(estado(20, '2026-10-29T03:30:00Z'), { max: 5, agora: AGORA });
  assert.equal(r.itens.length, 5);
  assert.equal(r.total, 20);
  assert.equal(r.velha, false);
  assert.equal(r.itens[0].categorias.length, 6);
  const chaves = ['titulo', 'url', 'fonte', 'publicadoEm', 'categorias'];
  assert.deepEqual(Object.keys(r.itens[0]), chaves);
});

test('pauta sem coleta recente é marcada como velha', () => {
  const r = listarNoticias(estado(2, '2026-10-20T03:30:00Z'), { agora: AGORA });
  assert.equal(r.velha, true);
  assert.equal(r.itens.length, 2);
});

test('pauta ausente ou nunca coletada vira lista vazia, sem erro', () => {
  assert.deepEqual(listarNoticias(null), { total: 0, velha: true, itens: [] });
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'pauta-'));
  assert.equal(lerPauta(path.join(pasta, 'nao-existe.json')), null);
});

test('arquivo corrompido derruba a execução, não some em silêncio', () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'pauta-'));
  const arquivo = path.join(pasta, 'pauta.json');
  fs.writeFileSync(arquivo, '{quebrado');
  assert.throws(() => lerPauta(arquivo), /corrompido/);
});
