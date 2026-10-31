// Capa do ebook no slide final (no lugar do mascote), com render e banco de foto simulados.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { montarDia } from './montar-dia.mjs';

const post = () => lerJson(path.join(DADOS, 'post-exemplo.json'));

function ambiente() {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-ebook-'));
  const foto = path.join(pasta, 'foto.jpg');
  fs.writeFileSync(foto, Buffer.from('imagem'));
  const pedidos = [];
  const renderizar = async (paginas, { aoAbrir }) => {
    pedidos.push(...paginas);
    for (const p of paginas) await aoAbrir({ evaluate: async () => [] }, p.saida);
    return paginas.map((p) => p.saida);
  };
  const obterFoto = async () => ({ caminho: foto, credito: 'Foto: Maria / iNaturalist (CC0)' });
  return { pasta, pedidos, renderizar, obterFoto, saida: path.join(pasta, 'saida') };
}

test('com ebook, o slide final troca o mascote pela capa; sem ebook, fica o mascote', async () => {
  const a = ambiente();
  const capaEbook = path.join(a.pasta, 'ebook.jpg');
  fs.writeFileSync(capaEbook, Buffer.from('capa-do-ebook'));
  const marca = Buffer.from('capa-do-ebook').toString('base64');
  await montarDia(post(), { ...a, dia: '2026-10-26', tituloEbook: 'Jiboia', capaEbook });
  assert.ok(a.pedidos[7].html.includes(marca), 'capa do ebook no slide 8');
  assert.doesNotMatch(a.pedidos[7].html, /alt="Mascote/);
  assert.ok(
    a.pedidos.slice(0, 7).every((p) => !p.html.includes(marca)),
    'capa só no slide 8',
  );
  const b = ambiente();
  await montarDia(post(), { ...b, dia: '2026-10-26' });
  assert.doesNotMatch(b.pedidos[7].html, /alt="Capa do ebook"/);
  fs.rmSync(a.pasta, { recursive: true });
  fs.rmSync(b.pasta, { recursive: true });
});
