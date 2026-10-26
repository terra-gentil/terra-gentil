// Testa a renovação do token do Instagram com um Instagram falso.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renovarToken } from './renovar.mjs';
import { ErroInstagram } from './graph.mjs';

const resposta = (corpo, ok = true, status = 200) => ({ ok, status, json: async () => corpo });

test('renova e devolve o token novo com os dias de validade', async () => {
  let chamada;
  const http = async (url) => {
    chamada = url;
    return resposta({ access_token: 'NOVO', token_type: 'bearer', expires_in: 5184000 });
  };
  const r = await renovarToken({ token: 'VELHO', http });
  assert.deepEqual(r, { token: 'NOVO', diasDeValidade: 60 });
  assert.equal(chamada.pathname, '/refresh_access_token');
  assert.equal(chamada.searchParams.get('grant_type'), 'ig_refresh_token');
  assert.equal(chamada.searchParams.get('access_token'), 'VELHO');
});

test('erro da Meta vira ErroInstagram sem vazar o token', async () => {
  const erro = { error: { message: 'Session has expired', code: 190, fbtrace_id: 'x' } };
  const http = async () => resposta(erro, false, 400);
  await assert.rejects(
    renovarToken({ token: 'SEGREDO', http }),
    (e) => e instanceof ErroInstagram && !e.message.includes('SEGREDO') && e.codigo === 190,
  );
});

test('sem token falha com mensagem clara', async () => {
  await assert.rejects(renovarToken({ token: '' }), /falta IG_ACCESS_TOKEN/);
});
