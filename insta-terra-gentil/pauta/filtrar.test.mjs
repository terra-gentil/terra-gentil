// Testes do filtro de notícias.
import test from 'node:test';
import assert from 'node:assert/strict';
import { filtrar } from './filtrar.mjs';

const FONTES = [{ nome: 'Epic', dominio: 'epicgardening.com' }];
const AGORA = new Date('2026-10-26T12:00:00Z');
const item = (url, publicadoEm) => ({ titulo: 't', url, publicadoEm, categorias: [] });

test('mantém só recentes, únicos, não vistos e do domínio da lista, mais novo primeiro', () => {
  const itens = [
    item('https://epicgardening.com/velho/', '2026-09-01T00:00:00Z'),
    item('https://epicgardening.com/a/', '2026-10-20T00:00:00Z'),
    item('https://epicgardening.com/a/', '2026-10-20T00:00:00Z'),
    item('https://epicgardening.com/b/', '2026-10-25T00:00:00Z'),
    item('https://epicgardening.com/visto/', '2026-10-24T00:00:00Z'),
    item('https://outro.com/c/', '2026-10-25T00:00:00Z'),
    item('https://epicgardening.com/sem-data/', null),
    item('https://epicgardening.com/futuro/', '2027-01-01T00:00:00Z'),
  ];
  const r = filtrar(itens, FONTES, { agora: AGORA, vistos: ['https://epicgardening.com/visto/'] });
  assert.deepEqual(
    r.map((i) => i.url),
    ['https://epicgardening.com/b/', 'https://epicgardening.com/a/'],
  );
});
