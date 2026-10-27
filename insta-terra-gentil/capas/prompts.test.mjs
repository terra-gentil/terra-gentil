// Testes dos prompts das capas: bloco fixo, camiseta lisa, ids, coringas e cenário inválido.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
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

test('camiseta é lisa: sem logo nem texto, só o boné tem a marca', () => {
  const p = promptDaCapa(plantas.Phalaenopsis, 'A');
  assert.match(p, /plain .+ t-shirt with no print, no logo and no text/);
  assert.match(ESTILO, /cap with the orange logo that reads exactly "TERRA GENTIL"/);
  assert.doesNotMatch(ESTILO, /t-shirt/);
  assert.doesNotMatch(p, /microphone is|lavalier microphone,/);
});

test('a cor da camiseta vem da lista da espécie e varia entre os cenários', () => {
  const orquidea = plantas.Phalaenopsis;
  const corDe = (c) => /plain (.+) t-shirt/.exec(promptDaCapa(orquidea, c))[1];
  const cores = ['A', 'B', 'C', 'D', 'E'].map(corDe);
  for (const cor of cores) assert.ok(orquidea.cores.includes(cor));
  assert.ok(new Set(cores).size > 1);
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

test('catálogo: 36 espécies e 10 coringas, slug único e sem acento', () => {
  assert.equal(Object.keys(plantas).length, 36);
  assert.equal(Object.keys(coringas).length, 10);
  const slugs = Object.values(especies).map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const e of Object.values(plantas)) {
    assert.match(e.slug, /^[a-z-]+$/);
    assert.ok(e.ingles && e.ambiente && e.nome);
  }
  for (const e of Object.values(coringas)) assert.ok(e.cena && e.ambiente && e.nome);
});
