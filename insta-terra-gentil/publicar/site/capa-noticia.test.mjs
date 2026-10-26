// Testa a gravação da capa da notícia no site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gravarCapa } from './capa-noticia.mjs';

function render() {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'capa-'));
  const saida = path.join(raiz, 'saida');
  fs.mkdirSync(saida);
  fs.writeFileSync(path.join(saida, '2026-10-27-album-01.jpg'), 'capa');
  fs.writeFileSync(path.join(saida, '2026-10-27-album-02.jpg'), 'outra');
  fs.writeFileSync(path.join(saida, '2026-10-27-ficha.json'), '{"credito":"Foto: Ana (CC0)"}');
  return { saida, publico: path.join(raiz, 'public', 'noticias') };
}

test('grava a capa e o crédito na pasta do slug', () => {
  const c = render();
  const r = gravarCapa({ post: { materia: { slug: 'jiboia' } }, ...c });
  assert.equal(r.slug, 'jiboia');
  const pasta = path.join(c.publico, 'jiboia');
  assert.equal(fs.readFileSync(path.join(pasta, 'capa.jpg'), 'utf8'), 'capa');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(pasta, 'capa.json'), 'utf8')), {
    credito: 'Foto: Ana (CC0)',
  });
});

test('post sem matéria não grava nada', () => {
  const c = render();
  assert.equal(gravarCapa({ post: { dia: '2026-10-27' }, ...c }), null);
  assert.equal(fs.existsSync(c.publico), false);
});

test('render sem capa ou sem ficha falha com mensagem clara', () => {
  const c = render();
  fs.rmSync(path.join(c.saida, '2026-10-27-album-01.jpg'));
  assert.throws(() => gravarCapa({ post: { materia: { slug: 'x' } }, ...c }), /sem capa ou ficha/);
});
