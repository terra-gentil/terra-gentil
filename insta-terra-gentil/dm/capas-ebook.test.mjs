// Toda palavra-chave aponta para a capa do seu ebook, e o arquivo existe no site.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_SITE } from '../lib/config.mjs';
import { carregarPalavras } from './palavras.mjs';

test('cada ebook tem capa em public/ebooks/covers', () => {
  const faltam = carregarPalavras()
    .filter((p) => !p.capa || !fs.existsSync(path.join(RAIZ_SITE, 'public/ebooks/covers', p.capa)))
    .map((p) => p.palavra);
  assert.deepEqual(faltam, []);
});
