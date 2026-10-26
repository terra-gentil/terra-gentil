// Testes do montar-dia com render e banco de foto simulados (molde e conversor são os reais).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { fotoDoDia } from './foto-do-dia.mjs';
import { montarDia } from './montar-dia.mjs';

const post = () => lerJson(path.join(DADOS, 'post-exemplo.json'));
const PNG_FALSO = Buffer.from('imagem');

function ambiente() {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-dia-'));
  const foto = path.join(pasta, 'foto.jpg');
  fs.writeFileSync(foto, PNG_FALSO);
  const pedidos = [];
  const renderizar = async (paginas, { aoAbrir }) => {
    pedidos.push(...paginas);
    for (const p of paginas) await aoAbrir({ evaluate: async () => [] }, p.saida);
    return paginas.map((p) => p.saida);
  };
  const obterFoto = async () => ({ caminho: foto, credito: 'Foto: Maria / iNaturalist (CC0)' });
  return { pasta, pedidos, renderizar, obterFoto, saida: path.join(pasta, 'saida') };
}

test('monta 8 slides com o molde do dia, contador, crédito e arquivos de apoio', async () => {
  const a = ambiente();
  const r = await montarDia(post(), { ...a, dia: '2026-10-26', tituloEbook: 'Jiboia' });
  assert.equal(r.molde, 'manchete');
  assert.equal(r.pngs.length, 8);
  assert.equal(path.basename(r.pngs[0]), '2026-10-26-manchete-01.png');
  assert.match(a.pedidos[0].html, /1\/8/);
  assert.match(a.pedidos[7].html, /8\/8/);
  assert.match(a.pedidos[4].html, /Passo 1/);
  assert.match(a.pedidos[5].html, /Passo 2/);
  assert.match(a.pedidos[0].html, /data:image\/jpeg;base64/);
  assert.match(fs.readFileSync(path.join(a.saida, '2026-10-26-legenda.txt'), 'utf8'), /JIBOIA/);
  const ficha = lerJson(path.join(a.saida, '2026-10-26-ficha.json'));
  assert.equal(ficha.molde, 'manchete');
  assert.deepEqual(ficha.avisos, []);
  fs.rmSync(a.pasta, { recursive: true });
});

test('outro dia, outro molde', async () => {
  const a = ambiente();
  const r = await montarDia(post(), { ...a, dia: '2026-10-27' });
  assert.equal(r.molde, 'faixas');
  fs.rmSync(a.pasta, { recursive: true });
});

test('texto que passa da borda vira aviso, sem derrubar a montagem', async () => {
  const a = ambiente();
  const renderizar = async (paginas, { aoAbrir }) => {
    await aoAbrir({ evaluate: async () => ['@canalterragentil'] }, paginas[2].saida);
    return paginas.map((p) => p.saida);
  };
  const r = await montarDia(post(), { ...a, renderizar, dia: '2026-10-26' });
  assert.equal(r.avisos.length, 1);
  assert.match(r.avisos[0].slide, /-03\.png$/);
  assert.deepEqual(r.avisos[0].textoFora, ['@canalterragentil']);
  fs.rmSync(a.pasta, { recursive: true });
});

test('roteiro inválido para antes de buscar foto ou renderizar', async () => {
  const a = ambiente();
  const p = post();
  p.slides[7].texto = '';
  let buscou = false;
  const obterFoto = async () => {
    buscou = true;
    return {};
  };
  const montar = () => montarDia(p, { ...a, obterFoto, dia: '2026-10-26' });
  await assert.rejects(montar, /roteiro inválido/);
  assert.equal(buscou, false);
  fs.rmSync(a.pasta, { recursive: true });
});

test('fotoDoDia prefere a curada e cai no banco quando não há', async () => {
  const chamadas = [];
  const baixar = async (escolhida, especie) => {
    chamadas.push(escolhida.foto.url);
    return { caminho: `${especie}.jpg`, credito: escolhida.credito };
  };
  const buscar = async () => ({
    escolhida: { foto: { url: 'https://banco/a.jpg' }, credito: 'c' },
    provedor: 'commons',
  });
  const curadas = { X: { foto: { url: 'https://curada/x.jpg', licenca: 'CC0' } } };
  const a = await fotoDoDia('X', { curadas, pasta: 'p', buscar, baixar });
  const b = await fotoDoDia('Y', { curadas, pasta: 'p', buscar, baixar });
  assert.equal(a.provedor, 'curada');
  assert.equal(b.provedor, 'commons');
  assert.deepEqual(chamadas, ['https://curada/x.jpg', 'https://banco/a.jpg']);
  const vazio = async () => ({ escolhida: null, falhas: ['commons: fora'] });
  const semFoto = () => fotoDoDia('Z', { buscar: vazio, baixar });
  await assert.rejects(semFoto, /nenhuma foto segura.*fora/);
});
