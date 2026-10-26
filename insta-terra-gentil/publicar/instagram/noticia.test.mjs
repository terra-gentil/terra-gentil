// Testa o link da notícia na legenda: fica quando a página responde, sai quando não responde.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legendaDe, MARCA_NOTICIA } from '../../carrossel/legenda.mjs';
import { conferirNoticia, legendaSemLink, urlDaNoticia } from './noticia.mjs';

const URL = 'https://terragentil.com.br/noticias/jiboia';
const legenda = legendaDe({ gancho: 'Gancho.', resumo: 'Resumo.', urlNoticia: URL });
const resposta = (ok) => ({ ok });
const semEspera = { dormir: async () => {} };

test('a legenda leva a linha do link logo depois do resumo, e só quando há notícia', () => {
  const linhas = legenda.split('\n\n');
  assert.equal(linhas[2], `${MARCA_NOTICIA}${URL}`);
  assert.equal(legendaDe({ gancho: 'G.' }).includes(MARCA_NOTICIA), false);
  assert.equal(urlDaNoticia(legenda), URL);
});

test('página no ar: a legenda segue igual', async () => {
  const r = await conferirNoticia(legenda, { http: async () => resposta(true), ...semEspera });
  assert.deepEqual(r, { legenda, url: URL, noAr: true });
});

test('página fora do ar depois das tentativas: o link sai e o resto da legenda fica', async () => {
  let chamadas = 0;
  const http = async () => {
    chamadas += 1;
    return resposta(false);
  };
  const r = await conferirNoticia(legenda, { http, tentativas: 3, ...semEspera });
  assert.equal(chamadas, 3);
  assert.equal(r.noAr, false);
  assert.equal(r.legenda.includes(URL), false);
  assert.equal(r.legenda.includes('Resumo.'), true);
  assert.equal(r.legenda.includes('\n\n\n'), false);
});

test('a página sobe no meio das tentativas e o link fica', async () => {
  let n = 0;
  const http = async () => resposta(++n >= 3);
  const r = await conferirNoticia(legenda, { http, tentativas: 5, ...semEspera });
  assert.equal(r.noAr, true);
  assert.equal(n, 3);
});

test('erro de rede conta como fora do ar, e legenda sem link não chama a rede', async () => {
  const quebrado = async () => {
    throw new Error('rede');
  };
  const r2 = await conferirNoticia(legenda, { http: quebrado, tentativas: 2, ...semEspera });
  assert.equal(r2.noAr, false);
  const sem = legendaDe({ gancho: 'G.' });
  const r = await conferirNoticia(sem, { http: quebrado });
  assert.deepEqual(r, { legenda: sem, url: null, noAr: null });
  assert.equal(legendaSemLink(sem), sem);
});
