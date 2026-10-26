// Testes da estrutura de 8 slides, do roteiro de exemplo e da legenda.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { ESTRUTURA, problemasDoRoteiro } from './estrutura.mjs';
import { legendaDe } from './legenda.mjs';
import { TIPOS } from './contrato.mjs';

const exemplo = () => lerJson(path.join(DADOS, 'post-exemplo.json'));

test('a estrutura tem 8 slides e só tipos que existem nos moldes', () => {
  assert.equal(ESTRUTURA.length, 8);
  assert.ok(ESTRUTURA.every((t) => TIPOS.includes(t)));
  assert.equal(ESTRUTURA[0], 'capa');
  assert.equal(ESTRUTURA.at(-1), 'final');
});

test('o roteiro de exemplo passa na validação', () => {
  assert.deepEqual(problemasDoRoteiro(exemplo().slides), []);
});

test('aponta slide faltando, campo vazio e travessão', () => {
  assert.match(problemasDoRoteiro([])[0], /precisa de 8 slides/);
  const slides = exemplo().slides;
  slides[1].texto = '  ';
  slides[2].nota = 'Quase todo mundo — começa assim.';
  const problemas = problemasDoRoteiro(slides);
  assert.ok(problemas.some((p) => p.includes('slide 2 (problema): falta "texto"')));
  assert.ok(problemas.some((p) => p.includes('slide 3: travessão em "nota"')));
});

test('passo não precisa de tarja nem número, o montar-dia preenche', () => {
  const slides = exemplo().slides;
  assert.equal(slides[4].tarja, undefined);
  assert.deepEqual(problemasDoRoteiro(slides), []);
});

test('legenda com palavra-chave chama o ebook e traz o crédito', () => {
  const l = legendaDe({
    gancho: 'Jiboia amarelando?',
    palavra: 'jiboia',
    tituloEbook: 'Jiboia: A Planta que Perdoa Tudo',
    credito: 'Foto: Maria / Wikimedia Commons (CC0)',
  });
  assert.match(l, /Comenta JIBOIA aqui embaixo/);
  assert.match(l, /Jiboia: A Planta que Perdoa Tudo/);
  assert.match(l, /Foto: Maria/);
  assert.match(l, /terragentil\.com\.br\/doutor/);
});

test('legenda sem palavra pede para salvar; recusa travessão e texto longo', () => {
  assert.match(legendaDe({ gancho: 'Oi' }), /Salva este post/);
  assert.throws(() => legendaDe({ gancho: 'Oi — tchau' }), /travessão/);
  assert.throws(() => legendaDe({ gancho: 'x'.repeat(2300) }), /limite é 2200/);
  assert.throws(() => legendaDe({}), /falta o gancho/);
});
