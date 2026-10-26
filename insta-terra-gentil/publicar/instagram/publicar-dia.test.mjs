// Testa o publicador com o Instagram falso: botão desligado não posta, ligado posta uma vez.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { criarIgFalso } from './ig-falso.mjs';
import { publicarDia } from './publicar-dia.mjs';
import { lerRegistro } from './registro.mjs';

const DIA = '2026-10-27';
const BASE_URL = 'https://raw.test/ig-slides';
const ESPERA = { pausa: async () => {}, tentativas: 3 };

function cenario(ficha = { avisos: [] }) {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'ig-'));
  const pasta = path.join(raiz, 'pacote');
  fs.mkdirSync(pasta);
  for (let i = 1; i <= 8; i++) fs.writeFileSync(path.join(pasta, `0${i}.jpg`), 'x');
  fs.writeFileSync(path.join(pasta, 'legenda.txt'), 'Folha amarela? Calma.\n');
  fs.writeFileSync(path.join(pasta, 'ficha.json'), JSON.stringify(ficha));
  return { pasta, base: path.join(raiz, 'dados') };
}

const ligado = { IG_PUBLICAR: 'ligado', IG_USER_ID: '1', IG_ACCESS_TOKEN: 'segredo' };
const roda = (c, extra = {}) =>
  publicarDia({ dia: DIA, ...c, baseUrl: BASE_URL, espera: ESPERA, ...extra });

test('desligado: confere o pacote e as imagens, mas não chama a Graph API', async () => {
  const c = cenario();
  const ig = criarIgFalso();
  const r = await roda(c, { env: {}, http: ig.http });
  assert.equal(r.acao, 'desligado');
  assert.equal(r.urls.length, 8);
  assert.equal(ig.chamadas.length, 0);
  assert.equal(lerRegistro(DIA, c.base), null);
});

test('ligado sem secrets falha com mensagem clara', async () => {
  const c = cenario();
  await assert.rejects(
    roda(c, { env: { IG_PUBLICAR: 'ligado' }, http: criarIgFalso().http }),
    /faltam os secrets/,
  );
});

test('ligado: publica, grava o registro e não posta de novo no mesmo dia', async () => {
  const c = cenario();
  const ig = criarIgFalso();
  const r = await roda(c, { env: ligado, http: ig.http });
  assert.equal(r.acao, 'publicado');
  assert.equal(lerRegistro(DIA, c.base).postId, 'post-1');
  const itens = ig.chamadas.filter((x) => x.corpo.is_carousel_item).length;
  assert.equal(itens, 8);
  const antes = ig.chamadas.length;
  const de_novo = await roda(c, { env: ligado, http: ig.http });
  assert.equal(de_novo.acao, 'ja-publicado');
  assert.equal(ig.chamadas.length, antes);
});

test('--so-token valida a conta e não publica', async () => {
  const c = cenario();
  const ig = criarIgFalso();
  const r = await roda(c, { env: ligado, http: ig.http, soToken: true });
  assert.deepEqual([r.acao, r.conta], ['token-ok', 'canalterragentil']);
  assert.equal(ig.chamadas.some((x) => x.caminho.endsWith('/media')), false);
});

test('erro no media_publish com o post já na conta: recupera, não duplica', async () => {
  const c = cenario();
  const ig = criarIgFalso({ publishQuebra: true });
  const r = await roda(c, { env: ligado, http: ig.http });
  assert.deepEqual([r.acao, r.postId], ['recuperado', 'post-1']);
});

test('recusa imagem que não é JPEG, ficha com avisos e pacote incompleto', async () => {
  await assert.rejects(
    roda(cenario(), { env: ligado, http: criarIgFalso({ jpeg: false }).http }),
    /não é JPEG/,
  );
  await assert.rejects(
    roda(cenario({ avisos: [{ slide: 'x' }] }), { env: ligado, http: criarIgFalso().http }),
    /avisos/,
  );
  const c = cenario();
  fs.rmSync(path.join(c.pasta, '03.jpg'));
  await assert.rejects(roda(c, { env: ligado, http: criarIgFalso().http }), /03\.jpg/);
});

test('container com ERROR derruba a publicação antes de postar', async () => {
  const ig = criarIgFalso({ statusDoContainer: 'ERROR' });
  await assert.rejects(roda(cenario(), { env: ligado, http: ig.http }), /ERROR/);
  assert.equal(ig.chamadas.some((x) => x.caminho.endsWith('/media_publish')), false);
});
