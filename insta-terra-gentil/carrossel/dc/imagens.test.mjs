// Testes da conversão de imagem local em data URI.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { paraDataUri } from './imagens.mjs';

test('arquivo local vira data URI com o tipo certo', () => {
  const arquivo = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'tg-')), 'foto.PNG');
  fs.writeFileSync(arquivo, Buffer.from([1, 2, 3]));
  assert.equal(paraDataUri(arquivo), 'data:image/png;base64,AQID');
});

test('endereço da web e data URI passam direto', () => {
  assert.equal(paraDataUri('https://x.com/a.jpg'), 'https://x.com/a.jpg');
  assert.equal(paraDataUri('data:image/png;base64,AA=='), 'data:image/png;base64,AA==');
});

test('formato não aceito e arquivo que não existe derrubam a execução', () => {
  assert.throws(() => paraDataUri('foto.gif'), /formato não aceito/);
  assert.throws(() => paraDataUri('nao-existe.jpg'), /não consegui ler/);
});
