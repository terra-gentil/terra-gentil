// Testes do estado da pauta de notícias.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  atualizarPauta,
  marcarUsado,
  estadoVazio,
  conteudoDaPauta,
} from './pauta-noticias.mjs';

const FONTES = [{ nome: 'Epic', dominio: 'epicgardening.com' }];
const AGORA = new Date('2026-10-28T12:00:00Z');
const item = (n, publicadoEm) => ({
  titulo: `t${n}`,
  url: `https://epicgardening.com/${n}/`,
  publicadoEm,
  categorias: [],
  fonte: 'Epic',
});
const coleta = (itens) => ({ itens, falhas: [], semFeed: ['RHS'] });

test('junta a coleta com a pauta anterior, sem repetir e sem vencidos', () => {
  const a = item('a', '2026-10-20T00:00:00Z');
  const velho = item('v', '2026-10-01T00:00:00Z');
  const b = item('b', '2026-10-27T00:00:00Z');
  const antes = { ...estadoVazio(), itens: [a, velho] };
  const depois = atualizarPauta(antes, coleta([a, b]), FONTES, AGORA);
  assert.deepEqual(depois.itens.map((i) => i.titulo), ['tb', 'ta']);
  assert.equal(depois.atualizadoEm, AGORA.toISOString());
  assert.deepEqual(depois.semFeed, ['RHS']);
});

test('item usado sai da pauta e não volta na coleta seguinte', () => {
  const a = item('a', '2026-10-27T00:00:00Z');
  const pauta = atualizarPauta(estadoVazio(), coleta([a]), FONTES, AGORA);
  const usado = marcarUsado(pauta, a.url, AGORA);
  assert.equal(usado.itens.length, 0);
  const depois = atualizarPauta(usado, coleta([a]), FONTES, AGORA);
  assert.equal(depois.itens.length, 0);
  assert.equal(depois.usados.length, 1);
});

test('marcar link fora da pauta falha; marcar duas vezes não duplica', () => {
  const fora = 'https://epicgardening.com/x/';
  assert.throws(() => marcarUsado(estadoVazio(), fora, AGORA), /fora da pauta/);
  const a = item('a', '2026-10-27T00:00:00Z');
  const pauta = atualizarPauta(estadoVazio(), coleta([a]), FONTES, AGORA);
  const duas = marcarUsado(marcarUsado(pauta, a.url, AGORA), a.url, AGORA);
  assert.equal(duas.usados.length, 1);
});

test('memória de usados expira depois de 30 dias', () => {
  const velho = { url: 'https://epicgardening.com/o/', em: '2026-09-01T00:00:00Z' };
  const antigo = { ...estadoVazio(), usados: [velho] };
  assert.equal(atualizarPauta(antigo, coleta([]), FONTES, AGORA).usados.length, 0);
});

test('coleta que falha mantém a pauta anterior; falhas e hora não contam como mudança', () => {
  const a = item('a', '2026-10-27T00:00:00Z');
  const antes = atualizarPauta(estadoVazio(), coleta([a]), FONTES, AGORA);
  const falha = { itens: [], falhas: [{ fonte: 'Epic', motivo: 'HTTP 403' }], semFeed: [] };
  const amanha = new Date('2026-10-29T12:00:00Z');
  const depois = atualizarPauta(antes, falha, FONTES, amanha);
  assert.equal(depois.itens.length, 1);
  assert.equal(conteudoDaPauta(depois), conteudoDaPauta(antes));
});
