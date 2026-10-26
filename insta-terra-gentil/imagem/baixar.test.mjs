// Testes do download da foto e do filtro de título.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { baixarFoto, nomeDeArquivo } from './baixar.mjs';
import { escolherFoto } from './escolher.mjs';

const escolhida = {
  credito: 'Foto: Maria / iNaturalist (CC BY 4.0)',
  foto: { url: 'https://u/a.jpg', licenca: 'CC BY 4.0', autor: 'Maria', paginaUrl: 'https://p/1' },
};
const resposta = (tipo, bytes = Buffer.from('jpegfalso')) => ({
  ok: true,
  headers: new Headers({ 'content-type': tipo }),
  arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length),
});

test('nomeDeArquivo tira acento e símbolos', () => {
  assert.equal(nomeDeArquivo('Monstera deliciosa'), 'monstera-deliciosa');
  assert.equal(nomeDeArquivo('  Hortelã-pimenta (Mentha) '), 'hortela-pimenta-mentha');
  assert.throws(() => nomeDeArquivo('???'), /inválido/);
});

test('baixa o jpg e grava o crédito ao lado', async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-foto-'));
  const r = await baixarFoto(escolhida, 'Monstera deliciosa', pasta, async () =>
    resposta('image/jpeg'),
  );
  assert.equal(path.basename(r.caminho), 'monstera-deliciosa.jpg');
  assert.equal(fs.readFileSync(r.caminho, 'utf8'), 'jpegfalso');
  const ficha = JSON.parse(fs.readFileSync(r.caminho.replace('.jpg', '.json'), 'utf8'));
  assert.equal(ficha.credito, escolhida.credito);
  assert.equal(ficha.pagina, 'https://p/1');
  fs.rmSync(pasta, { recursive: true });
});

test('recusa o que não é JPEG e erro HTTP', async () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-foto-'));
  await assert.rejects(
    () => baixarFoto(escolhida, 'x', pasta, async () => resposta('text/html')),
    /não é JPEG/,
  );
  await assert.rejects(
    () => baixarFoto(escolhida, 'x', pasta, async () => ({ ok: false, status: 403 })),
    /HTTP 403/,
  );
  assert.equal(fs.readdirSync(pasta).length, 0);
  fs.rmSync(pasta, { recursive: true });
});

const candidata = (titulo) => ({
  titulo,
  url: `https://u/${titulo}`,
  largura: 1600,
  altura: 2000,
  mime: 'image/jpeg',
  autor: 'Maria',
  licenca: 'CC BY 4.0',
  compartilhaIgual: false,
});

test('evita título de flor, fruto e diagrama, e dá para desligar', () => {
  const lista = [candidata('Monstera deliciosa inflorescence.jpg')];
  assert.equal(escolherFoto(lista), null);
  assert.equal(escolherFoto([candidata('Monstera fruit 3.jpg')]), null);
  assert.equal(escolherFoto(lista, { evitarTitulo: null }).foto.titulo, lista[0].titulo);
  assert.ok(escolherFoto([candidata('Monstera deliciosa 001.jpg')]));
});

test('evita ilustração botânica pela categoria do Commons, mesmo com título neutro', () => {
  const blanco = {
    ...candidata('Ocimum basilicum Blanco2.407.jpg'),
    categorias: 'Flora de Filipinas, PD Old, Ocimum basilicum - botanical illustrations',
  };
  assert.equal(escolherFoto([blanco]), null);
  assert.ok(escolherFoto([{ ...blanco, categorias: 'Ocimum basilicum, Basil' }]));
});
