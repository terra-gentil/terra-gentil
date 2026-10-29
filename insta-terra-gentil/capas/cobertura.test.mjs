// Trava contra capa parada em silêncio: toda entrada do catálogo e toda pasta do banco têm de
// ser alcançáveis por um post válido. Pegou o erro de 29/10 (56 capas aprovadas sem uso).
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS, naRaiz } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { capaDoDia } from './banco.mjs';
import { cobertura, pastasOrfas, postQueAlcanca } from './cobertura.mjs';
import { lerRevisao } from './revisao.mjs';
import { lerRosto } from './rosto.mjs';

const { especies } = lerJson(path.join(DADOS, 'capas.json'));
const pastaBanco = naRaiz('capas', 'banco');
const opcoes = { catalogo: especies, pastaBanco, posts: [] };
opcoes.revisao = lerRevisao(pastaBanco);
opcoes.rosto = lerRosto(pastaBanco);

test('toda entrada do catálogo é alcançada por um post válido', () => {
  const paradas = cobertura(especies, opcoes).filter((l) => !l.alcanca);
  assert.deepEqual(
    paradas.map((l) => l.chave),
    [],
  );
});

test('toda pasta do banco tem entrada no catálogo', () => {
  assert.deepEqual(pastasOrfas(especies, pastaBanco), []);
});

test('toda capa aprovada sai de verdade no capaDoDia, pelo post de exemplo', () => {
  for (const l of cobertura(especies, opcoes).filter((x) => x.aprovadas)) {
    const capa = capaDoDia(l.alcanca, '2026-11-01', opcoes);
    assert.ok(capa?.caminho.includes(`${path.sep}${l.slug}${path.sep}`), `${l.chave} não sai`);
  }
});

test('o verificador acusa chave fora do formato, gênero repetido e coringa sem tema', () => {
  const cat = {
    'Fragaria × ananassa': { slug: 'morango' },
    'Dracaena trifasciata': { slug: 'espada' },
    'Dracaena sanderiana': { slug: 'bambu' },
    'coringa-fofoca': { slug: 'coringa-fofoca', coringa: true },
  };
  for (const [chave, e] of Object.entries(cat)) {
    const esperado = chave.startsWith('Dracaena') ? { especie: chave } : null;
    assert.deepEqual(postQueAlcanca(chave, e, cat), esperado, chave);
  }
});
