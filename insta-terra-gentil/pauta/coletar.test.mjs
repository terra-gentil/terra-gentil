// Testes do coletor, com a rede simulada.
import test from 'node:test';
import assert from 'node:assert/strict';
import { coletar } from './coletar.mjs';

const RSS = `<rss version="2.0"><channel><item><title>Rega da jiboia</title>
<link>https://www.epicgardening.com/rega/</link></item></channel></rss>`;
const FONTES = [
  { nome: 'Epic', dominio: 'epicgardening.com', feed: 'https://e/feed' },
  { nome: 'Fora', dominio: 'fora.com', feed: 'https://f/feed' },
  { nome: 'Sem RSS', dominio: 'rhs.org.uk' },
];

test('junta os itens, marca a fonte e separa falhas e fontes sem feed', async () => {
  const buscar = async (url) =>
    url === 'https://e/feed'
      ? { ok: true, text: async () => RSS }
      : { ok: false, status: 403 };
  const r = await coletar(FONTES, buscar);
  assert.equal(r.itens.length, 1);
  assert.equal(r.itens[0].fonte, 'Epic');
  assert.deepEqual(r.falhas, [{ fonte: 'Fora', motivo: 'HTTP 403' }]);
  assert.deepEqual(r.semFeed, ['Sem RSS']);
});

test('página de bloqueio (não é RSS) vira falha, não item', async () => {
  const buscar = async () => ({ ok: true, text: async () => '<html>Just a moment...</html>' });
  const r = await coletar([FONTES[0]], buscar);
  assert.equal(r.itens.length, 0);
  assert.match(r.falhas[0].motivo, /não é um RSS/);
});
