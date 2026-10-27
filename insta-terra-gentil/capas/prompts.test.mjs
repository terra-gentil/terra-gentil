// Testes dos prompts das capas: bloco fixo sempre presente, ids estáveis e cenário inválido.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { ESTILO, EVITAR, QUADRO, filaDeCapas, promptDaCapa } from './prompts.mjs';

const { especies } = lerJson(path.join(DADOS, 'capas.json'));

test('todo prompt leva a planta, o estilo fixo, o quadro 4:5 e a lista do que evitar', () => {
  for (const c of ['A', 'B', 'C']) {
    const p = promptDaCapa(especies.Phalaenopsis, c);
    for (const parte of [ESTILO, QUADRO, EVITAR, 'Phalaenopsis']) assert.ok(p.includes(parte));
  }
  assert.match(promptDaCapa(especies.Phalaenopsis, 'C'), /greenhouse orchid nursery/);
});

test('cenário desconhecido para', () => {
  assert.throws(() => promptDaCapa(especies.Phalaenopsis, 'Z'), /cenário desconhecido/);
});

test('fila com 3 cenários por espécie e ids <slug>-<cenário>-<n>', () => {
  const fila = filaDeCapas(especies);
  assert.equal(fila.length, Object.keys(especies).length * 3);
  assert.equal(fila[0].id, 'orquidea-A-1');
  assert.equal(new Set(fila.map((f) => f.id)).size, fila.length);
  const duas = filaDeCapas({ Phalaenopsis: especies.Phalaenopsis }, { porCenario: 2 });
  const ids = ['A-1', 'A-2', 'B-1', 'B-2', 'C-1', 'C-2'].map((s) => `orquidea-${s}`);
  assert.deepEqual(
    duas.map((f) => f.id),
    ids,
  );
});

test('catálogo: slug único, sem acento e com descrição em inglês e ambiente', () => {
  const slugs = Object.values(especies).map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const e of Object.values(especies)) {
    assert.match(e.slug, /^[a-z-]+$/);
    assert.ok(e.ingles && e.ambiente && e.nome);
  }
});
