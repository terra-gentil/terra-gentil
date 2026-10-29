// Testes dos fatos da bíblia: catálogo, texto igual, fonte de pet e o post montado com eles.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { buscarPorPalavra, carregarPalavras } from '../dm/palavras.mjs';
import { bibliaDoPost, fonteDoFato } from './biblia.mjs';
import { validarFatos } from './fatos.mjs';
import { lerLivro } from './livros.mjs';
import { problemasDaMateria } from './materia.mjs';
import { montarPost } from './roteiro.mjs';

const livro = buscarPorPalavra(carregarPalavras(), 'JIBOIA');
const paginas = lerLivro(livro);
const bruto = () => lerJson(path.join(DADOS, 'bruto-exemplo.json'));
const biblia = {
  fatos: {
    'q3-10': {
      texto: 'Jiboia aguenta sombra, mas cresce mais perto da janela',
      livro: 'Squire',
      pagina: '40',
      fontePet: null,
    },
    't13-07': {
      texto: 'A jiboia é tóxica para cães e gatos',
      livro: 'UFG',
      pagina: '8',
      fontePet: 'UFG',
    },
    'x1-01': { texto: 'Planta tóxica para gatos', livro: 'X', pagina: '1', fontePet: 'Blog' },
  },
};
const comBiblia = (id) => [
  ...bruto().fatos.slice(0, 2),
  { biblia: id, texto: biblia.fatos[id].texto },
];
const base = { paginas, titulo: 'T', biblia };

test('fato da bíblia vira fonte "Livro, p. N" do catálogo, sem trecho literal', () => {
  const [, , fato] = validarFatos(comBiblia('q3-10'), base);
  assert.equal(fato.fonte, 'Squire, p. 40');
  assert.equal(fato.trecho, undefined);
  assert.equal(fonteDoFato({ biblia: 'q3-10' }, 'T', biblia), 'Squire, p. 40');
  assert.equal(fonteDoFato({ pagina: 9 }, 'T', biblia), 'T, p. 9');
});

test('barra fato fora do catálogo, texto mexido e fonte de pet desconhecida', () => {
  assert.throws(() => validarFatos(comBiblia('q3-10'), { ...base, biblia: null }), /catálogo/);
  const mexido = comBiblia('q3-10');
  mexido[2].texto = 'Jiboia aguenta sombra total';
  assert.throws(() => validarFatos(mexido, base), /texto diferente/);
  assert.throws(() => validarFatos(comBiblia('x1-01'), base), /fonte de pet desconhecida/);
});

test('toxicidade e pet passam só com fonte de pet; do ebook continuam barrados', () => {
  assert.equal(validarFatos(comBiblia('t13-07'), base)[2].fontePet, 'UFG');
  const ebook = [
    ...bruto().fatos.slice(0, 2),
    { ...bruto().fatos[2], texto: 'É tóxica para gatos' },
  ];
  assert.throws(() => validarFatos(ebook, base), /sem fonte de pet/);
});

test('bibliaDoPost só lê o catálogo quando algum fato vem dela', () => {
  const ler = () => biblia;
  assert.equal(bibliaDoPost(bruto().fatos, ler), null);
  assert.equal(bibliaDoPost(comBiblia('q3-10'), ler), biblia);
});

test('matéria fala de pet só se o post usar fato com fonte de pet', () => {
  const m = { ...bruto().materia, introducao: 'Cuidado: a jiboia é tóxica para gatos.' };
  assert.match(problemasDaMateria(m, 3).join(), /toxicidade/);
  assert.doesNotMatch(problemasDaMateria(m, 3, true).join(), /toxicidade/);
});

test('post montado com fato da bíblia: fontes batem e a conferência passa', () => {
  const b = bruto();
  b.fatos[2] = { biblia: 'q3-10', texto: biblia.fatos['q3-10'].texto };
  b.fatosUsados = [...new Set([...b.fatosUsados, 2])];
  const post = montarPost(b, { livro, paginas, dia: '2026-10-29', biblia });
  assert.ok(post.fontes.includes('Squire, p. 40'));
});

test('tema do post: vazio ou um dos temas com coringa', () => {
  const b = bruto();
  b.tema = 'praga';
  assert.equal(montarPost(b, { livro, paginas, dia: '2026-10-29' }).tema, 'praga');
  b.tema = 'fofoca';
  assert.throws(() => montarPost(b, { livro, paginas, dia: '2026-10-29' }), /tema desconhecido/);
  delete b.tema;
  assert.equal(montarPost(b, { livro, paginas, dia: '2026-10-29' }).tema, null);
});
