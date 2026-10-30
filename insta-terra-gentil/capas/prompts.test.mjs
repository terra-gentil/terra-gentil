// Testes dos prompts das capas: bloco fixo, camiseta lisa, ids, coringas e cenário inválido.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { RODADA_2 } from './cenarios2.mjs';
import { ESTILO, EVITAR, QUADRO, filaDeCapas, promptDaCapa } from './prompts.mjs';

const { especies } = lerJson(path.join(DADOS, 'capas.json'));
const plantas = Object.fromEntries(Object.entries(especies).filter(([, e]) => !e.coringa));
const coringas = Object.fromEntries(Object.entries(especies).filter(([, e]) => e.coringa));

test('todo prompt leva a planta, o estilo fixo, o quadro e a lista do que evitar', () => {
  for (const c of ['A', 'B', 'C', 'D', 'E']) {
    const p = promptDaCapa(plantas.Phalaenopsis, c);
    for (const parte of [ESTILO, QUADRO, EVITAR, 'Phalaenopsis']) assert.ok(p.includes(parte));
  }
  assert.match(promptDaCapa(plantas.Phalaenopsis, 'C'), /greenhouse orchid nursery/);
});

test('camiseta oficial: logo entre aspas, copiada da foto de referência só da logo', () => {
  const p = promptDaCapa(plantas.Phalaenopsis, 'A');
  assert.match(p, /cap with the orange logo that reads exactly "TERRA GENTIL"/);
  assert.match(p, /official Terra Gentil dark grey t-shirt/);
  assert.match(p, /"TERRA" and "GENTIL"/);
  assert.match(p, /andre-camiseta-logo/);
  assert.doesNotMatch(p, /plain .+ t-shirt|no logo and no text/);
});

test('plano médio ou fechado em todos os cenários, para a logo ter pixels', () => {
  for (const c of ['A', 'B', 'C', 'D', 'E']) {
    assert.doesNotMatch(promptDaCapa(plantas.Phalaenopsis, c), /^Wide shot/);
  }
});

test('cenário desconhecido para', () => {
  assert.throws(() => promptDaCapa(plantas.Phalaenopsis, 'Z'), /cenário desconhecido/);
  assert.throws(() => promptDaCapa(coringas['coringa-regar'], 'D'), /cenário desconhecido/);
});

test('fila: 5 cenários por espécie, 3 por coringa, ids <slug>-<cenário>-<n> únicos', () => {
  const fila = filaDeCapas(especies);
  assert.equal(fila.length, Object.keys(plantas).length * 5 + Object.keys(coringas).length * 3);
  assert.equal(fila[0].id, 'orquidea-A-1');
  assert.equal(new Set(fila.map((f) => f.id)).size, fila.length);
  const so = { Phalaenopsis: plantas.Phalaenopsis };
  const duas = filaDeCapas(so, { cenarios: ['A', 'B'], porCenario: 2 });
  const ids = ['A-1', 'A-2', 'B-1', 'B-2'].map((s) => `orquidea-${s}`);
  assert.deepEqual(duas.map((f) => f.id), ids);
});

test('catálogo: 47 espécies e 15 coringas, slug único e sem acento', () => {
  assert.equal(Object.keys(plantas).length, 47);
  assert.equal(Object.keys(coringas).length, 15);
  const slugs = Object.values(especies).map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const e of Object.values(plantas)) {
    assert.match(e.slug, /^[a-z-]+$/);
    assert.ok(e.ingles && e.ambiente && e.nome);
  }
  for (const e of Object.values(coringas)) assert.ok(e.cena && e.ambiente && e.nome);
});

test('2a rodada: cenários F a H com estilo fixo, plano médio ou fechado, ids sem repetir', () => {
  for (const c of RODADA_2) {
    for (const e of [plantas.Phalaenopsis, coringas['coringa-regar']]) {
      const p = promptDaCapa(e, c);
      for (const parte of [ESTILO, QUADRO, EVITAR]) assert.ok(p.includes(parte));
      assert.doesNotMatch(p, /^Wide shot/);
    }
  }
  const fila = filaDeCapas(especies, { cenarios: RODADA_2 });
  assert.equal(fila.length, Object.keys(especies).length * 3);
  assert.equal(new Set(fila.map((f) => f.id)).size, fila.length);
  const rodada1 = filaDeCapas(especies).map((f) => f.id);
  assert.deepEqual(fila.filter((f) => rodada1.includes(f.id)), []);
});
