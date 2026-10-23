// Testes do registro de palavras-chave e do reconhecimento no comentário.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { EBOOKS_DIR } from '../lib/config.mjs';
import {
  buscarPorPalavra,
  carregarPalavras,
  comentarioPede,
  linkDoPdf,
  normalizar,
} from './palavras.mjs';

const palavras = carregarPalavras();

test('cada palavra aponta para um PDF que existe no site', () => {
  const faltando = palavras.filter((p) => !fs.existsSync(path.join(EBOOKS_DIR, p.pdf)));
  assert.deepEqual(faltando, []);
});

test('todos os ebooks do site têm palavra, e nenhuma se repete', () => {
  const pdfs = fs.readdirSync(EBOOKS_DIR).filter((f) => f.endsWith('.pdf'));
  assert.equal(palavras.length, pdfs.length);
  const unicas = new Set(palavras.map((p) => normalizar(p.palavra)));
  assert.equal(unicas.size, palavras.length);
});

test('palavra é uma só, fácil de digitar: sem espaço nem acento', () => {
  for (const { palavra } of palavras) assert.equal(palavra, normalizar(palavra).replace(/ /g, ''));
});

test('reconhece a palavra com acento, minúscula, plural e emoji', () => {
  assert.ok(comentarioPede('Jiboía!!', 'JIBOIA'));
  assert.ok(comentarioPede('quero jiboias 🙏', 'JIBOIA'));
  assert.ok(comentarioPede('HORTELÃ por favor', 'HORTELA'));
  assert.ok(comentarioPede('pet', 'PET'));
});

test('não reconhece palavra dentro de outra nem comentário vazio', () => {
  assert.ok(!comentarioPede('jiboiada', 'JIBOIA'));
  assert.ok(!comentarioPede('competente', 'PET'));
  assert.ok(!comentarioPede('', 'JIBOIA'));
  assert.ok(!comentarioPede('jiboia', ''));
});

test('busca o ebook pela palavra e monta o link público do PDF', () => {
  const item = buscarPorPalavra(palavras, 'jiboia');
  assert.equal(item.pdf, '16-Jiboia-na-Sala.pdf');
  assert.equal(linkDoPdf(item), 'https://terragentil.com.br/ebooks/16-Jiboia-na-Sala.pdf');
  assert.equal(buscarPorPalavra(palavras, 'cacto'), null);
});
