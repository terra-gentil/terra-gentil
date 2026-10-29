// Testes da segunda foto do André no carrossel: só no slide 5, diferente da capa, na ficha.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { SLIDE_DENTRO, montarDia } from './montar-dia.mjs';

const post = () => lerJson(path.join(DADOS, 'post-exemplo.json'));

function ambiente() {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-dentro-'));
  const foto = path.join(pasta, 'foto.jpg');
  fs.writeFileSync(foto, Buffer.from('foto-da-planta'));
  const pedidos = [];
  const renderizar = async (paginas, { aoAbrir }) => {
    pedidos.push(...paginas);
    for (const p of paginas) await aoAbrir({ evaluate: async () => [] }, p.saida);
    return paginas.map((p) => p.saida);
  };
  const obterFoto = async () => ({ caminho: foto, credito: 'Foto: Maria / iNaturalist (CC0)' });
  return { pasta, pedidos, renderizar, obterFoto, saida: path.join(pasta, 'saida') };
}

test('segunda foto do André vai só no slide 5; sem ela, o slide 5 usa a planta', async () => {
  const a = ambiente();
  const capa = path.join(a.pasta, 'morango-A-1.jpg');
  const dentro = path.join(a.pasta, 'morango-B-1.jpg');
  fs.writeFileSync(capa, Buffer.from('capa-do-andre'));
  fs.writeFileSync(dentro, Buffer.from('andre-de-dentro'));
  const marca = Buffer.from('andre-de-dentro').toString('base64');
  const obterCapa = async () => ({ caminho: capa, dentro, credito: 'Foto: Terra Gentil' });
  await montarDia(post(), { ...a, obterCapa, dia: '2026-10-26' });
  const com = a.pedidos.map((p, i) => (p.html.includes(marca) ? i : -1)).filter((i) => i >= 0);
  assert.deepEqual(com, [SLIDE_DENTRO]);
  assert.equal(a.pedidos[SLIDE_DENTRO].pessoa, true);
  assert.equal(SLIDE_DENTRO, 4);
  assert.equal(lerJson(path.join(a.saida, '2026-10-26-ficha.json')).dentro, 'morango-B-1.jpg');
  fs.rmSync(a.pasta, { recursive: true });
});

test('com uma foto só (sem dentro), nenhum slide além da capa leva o André', async () => {
  const a = ambiente();
  const capa = path.join(a.pasta, 'jiboia-A-1.jpg');
  fs.writeFileSync(capa, Buffer.from('capa-unica'));
  const obterCapa = async () => ({ caminho: capa, dentro: null, credito: 'Foto: Terra Gentil' });
  await montarDia(post(), { ...a, obterCapa, dia: '2026-10-26' });
  assert.deepEqual(
    a.pedidos.map((p) => p.pessoa),
    [true, false, false, false, false, false, false, false],
  );
  assert.equal(lerJson(path.join(a.saida, '2026-10-26-ficha.json')).dentro, null);
  fs.rmSync(a.pasta, { recursive: true });
});
