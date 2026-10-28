// Testes de consistência: o prompt da rotina e o guia de voz não podem divergir do código.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LIMITES_TEXTO } from '../carrossel/estrutura.mjs';
import { naRaiz } from '../lib/config.mjs';
import { PASTAS_PERMITIDAS, PREFIXO_RAMO } from '../publicar/rotina/validar.mjs';
import { CHAVES_DO_BRUTO } from './esquema.mjs';
import { SERIES } from './series.mjs';

const ler = (...partes) => fs.readFileSync(naRaiz(...partes), 'utf8');
const rotina = ler('pauta', 'routine-prompt.md');
const voz = ler('pauta', 'prompts', 'voz-terra-gentil.md');
const TRAVESSAO = /[—–]/;

test('prompt e guia de voz não têm travessão', () => {
  assert.equal(TRAVESSAO.test(rotina), false);
  assert.equal(TRAVESSAO.test(voz), false);
});

test('o guia de voz traz o limite exato de cada campo do código', () => {
  for (const [campo, maximo] of Object.entries(LIMITES_TEXTO)) {
    assert.match(voz, new RegExp(`${campo} até ${maximo}\\b`), campo);
  }
});

test('o guia de voz lista todas as séries aceitas', () => {
  for (const serie of SERIES) assert.ok(voz.includes(serie), serie);
});

test('o prompt usa o prefixo de branch e as pastas que o validador aceita', () => {
  assert.ok(rotina.includes(`${PREFIXO_RAMO}AAAAMMDD-HHMM`));
  assert.ok(rotina.includes('claude/insta-routine-$TS'));
  for (const pasta of PASTAS_PERMITIDAS) assert.ok(rotina.includes(pasta), pasta);
});

test('os comandos do prompt existem na CLI e o exemplo cobre todas as chaves do bruto', () => {
  const cli = ler('pauta', 'rotina-cli.mjs');
  for (const comando of ['proximo', 'noticias', 'ler', 'gravar', 'conferir']) {
    assert.ok(rotina.includes(`rotina-cli.mjs ${comando}`), comando);
    assert.ok(cli.includes(`comando === '${comando}'`), comando);
  }
  const exemplo = JSON.parse(ler('dados', 'bruto-exemplo.json'));
  assert.deepEqual(Object.keys(exemplo), [...CHAVES_DO_BRUTO]);
  assert.ok(fs.existsSync(path.join(naRaiz('dados'), 'posts', '.gitkeep')));
});

test('o prompt trata a notícia só como gancho de tema e pede o link no log', () => {
  assert.ok(rotina.includes('gancho de tema, nunca fonte de fato'));
  assert.ok(rotina.includes('"noticia"'));
  assert.ok(rotina.includes('noticias --max 15'));
});
