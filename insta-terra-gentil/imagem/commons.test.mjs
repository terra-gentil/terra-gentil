// Testes do provedor Wikimedia Commons, com a rede simulada.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buscarCommons, candidatosDe, textoPuro } from './commons.mjs';

const pagina = (titulo, info) => ({ title: `File:${titulo}`, imageinfo: [info] });
const RESPOSTA = {
  query: {
    pages: [
      pagina('Monstera 001.jpg', {
        width: 4000,
        height: 6000,
        mime: 'image/jpeg',
        url: 'https://up/orig.jpg',
        thumburl: 'https://up/thumb-1600.jpg',
        descriptionurl: 'https://commons/File:Monstera_001.jpg',
        extmetadata: {
          LicenseShortName: { value: 'CC BY 3.0' },
          Artist: { value: '<a href="//c/User:Llez" title="User:Llez">Llez</a> &amp; amigos' },
        },
      }),
      { title: 'File:sem-info.jpg' },
    ],
  },
};

test('textoPuro tira HTML, decodifica entidades e descarta autor desconhecido', () => {
  assert.equal(textoPuro('<a href="x">Llez</a> &amp; <b>Ana</b>'), 'Llez & Ana');
  const real = 'Unknown author<span style="display: none;">Unknown author</span>';
  assert.equal(textoPuro(real), null);
  assert.equal(textoPuro(undefined), null);
});

test('candidatosDe usa a miniatura de 1600 quando o original é maior', () => {
  const [c] = candidatosDe(RESPOSTA);
  assert.equal(candidatosDe(RESPOSTA).length, 1);
  assert.equal(c.url, 'https://up/thumb-1600.jpg');
  assert.equal(c.autor, 'Llez & amigos');
  assert.equal(c.licenca, 'CC BY 3.0');
  assert.equal(c.compartilhaIgual, false);
});

test('resposta sem resultados vira lista vazia', () => {
  assert.deepEqual(candidatosDe({ batchcomplete: true }), []);
});

test('buscarCommons manda User-Agent e a espécie na busca', async () => {
  let chamada;
  const buscar = async (url, opcoes) => {
    chamada = { url, opcoes };
    return { ok: true, json: async () => RESPOSTA };
  };
  await buscarCommons('Monstera deliciosa', buscar);
  assert.match(decodeURIComponent(chamada.url), /Monstera\+deliciosa|Monstera deliciosa/);
  assert.match(chamada.opcoes.headers['user-agent'], /TerraGentil/);
});
