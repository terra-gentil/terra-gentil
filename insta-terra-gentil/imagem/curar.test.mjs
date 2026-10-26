// Testa a curadoria de foto: ordem das candidatas, filtro de segurança e gravação em fotos.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { candidatasPara, registrarCurada } from './curar.mjs';

const foto = (url, extra = {}) => ({
  url, titulo: 'Planta', licenca: 'CC0', mime: 'image/jpeg', largura: 1200, altura: 1500,
  autor: 'Ana', fonte: 'Wikimedia Commons', paginaUrl: `${url}/pagina`, ...extra,
});

test('junta provedores, tira repetidas e inseguras, e ordena pela nota', async () => {
  const quase = foto('u1', { altura: 1300 });
  const png = foto('u2', { mime: 'image/png' });
  const provedores = [
    { nome: 'a', buscar: async () => [quase, png] },
    { nome: 'b', buscar: async () => [foto('u1'), foto('u3', { altura: 1500 })] },
  ];
  const { candidatas } = await candidatasPara('Epipremnum aureum', { provedores });
  // u3 tem a proporção 4:5 exata e vem primeiro; u1 repetida fica com o provedor "a".
  assert.deepEqual(candidatas.map((c) => c.url), ['u3', 'u1']);
  assert.equal(candidatas[1].provedor, 'a');
});

test('falha de um provedor vira aviso e não derruba os outros', async () => {
  const provedores = [
    { nome: 'a', buscar: async () => { throw new Error('timeout'); } },
    { nome: 'b', buscar: async () => [foto('u1')] },
  ];
  const { candidatas, falhas } = await candidatasPara('Epipremnum aureum', { provedores });
  assert.equal(candidatas.length, 1);
  assert.deepEqual(falhas, ['a: timeout']);
});

test('grava a curada sem apagar as outras espécies', () => {
  const arquivo = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'curar-')), 'fotos.json');
  fs.writeFileSync(arquivo, JSON.stringify({ fotos: { 'Outra planta': { foto: { url: 'x' } } } }));
  const r = registrarCurada(arquivo, 'Epipremnum aureum', foto('u1'));
  const salvo = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  assert.equal(salvo.fotos['Outra planta'].foto.url, 'x');
  assert.equal(salvo.fotos['Epipremnum aureum'].foto.url, 'u1');
  assert.match(r.credito, /Ana \/ Wikimedia Commons \(CC0\)/);
});

test('sem espécie falha com mensagem clara', async () => {
  await assert.rejects(candidatasPara(''), /falta o nome científico/);
});
