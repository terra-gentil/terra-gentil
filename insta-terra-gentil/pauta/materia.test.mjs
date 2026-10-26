// Testa a matéria do site: o modelo do exemplo passa e cada regra de tamanho e fonte barra.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { buscarPorPalavra, carregarPalavras } from '../dm/palavras.mjs';
import { lerLivro } from './livros.mjs';
import { palavrasDaMateria, problemasDaMateria } from './materia.mjs';
import { conferirPost, montarPost } from './roteiro.mjs';

const exemplo = () => lerJson(path.join(DADOS, 'bruto-exemplo.json'));
const materia = (ajuste) => ({ ...exemplo().materia, ...ajuste });
const QTD = exemplo().fatos.length;
const problemas = (m) => problemasDaMateria(m, QTD);

test('a matéria do exemplo passa e tem mais de 600 palavras', () => {
  assert.deepEqual(problemas(materia()), []);
  assert.ok(palavrasDaMateria(materia()) >= 600);
});

test('texto curto é recusado com a contagem de palavras', () => {
  const curta = materia({ introducao: 'Curta.', conclusao: 'Curta.', secoes: materia().secoes.map(
    (s) => ({ ...s, paragrafos: ['Texto.'] }),
  ), faq: materia().faq.map((q) => ({ ...q, resposta: 'Sim.' })) });
  assert.match(problemas(curta).join('|'), /palavras, o mínimo é 600/);
});

test('seção sem fato, ou com fato que não existe, é recusada', () => {
  const [primeira, ...resto] = materia().secoes;
  const vazia = [{ ...primeira, fatosUsados: [] }, ...resto];
  assert.match(problemas(materia({ secoes: vazia }))[0], /seção 0/);
  const falso = [{ ...primeira, fatosUsados: [QTD] }, ...resto];
  assert.match(problemas(materia({ secoes: falso }))[0], /seção 0 precisa citar/);
});

test('número de seções e de perguntas fora da faixa é recusado', () => {
  const secoes = materia().secoes.slice(0, 2);
  assert.match(problemas(materia({ secoes })).join('|'), /3 a 5 seções/);
  assert.match(problemas(materia({ faq: materia().faq.slice(0, 1) })).join('|'), /faq com 2 a 3/);
});

test('travessão, toxicidade, slug e descrição inválidos são recusados', () => {
  const com = (campo, valor) => problemas(materia({ [campo]: valor })).join('|');
  assert.match(com('conclusao', 'Regue aos poucos — sempre.'), /travessão/);
  assert.match(com('introducao', 'Cuidado: a planta é tóxica para gatos.'), /toxicidade/);
  assert.match(com('slug', 'Jiboia Regar'), /slug/);
  assert.match(com('descricao', 'Curta demais.'), /descrição de 150 a 160/);
  assert.match(com('titulo', 'x'.repeat(61)), /título até 60/);
});

test('o post montado leva a matéria, e matéria ruim barra o post', () => {
  const livro = buscarPorPalavra(carregarPalavras(), 'JIBOIA');
  const paginas = lerLivro(livro);
  const montar = (b) => montarPost(b, { livro, paginas, dia: '2026-10-27' });
  const post = montar(exemplo());
  assert.equal(post.materia.slug, exemplo().materia.slug);
  assert.deepEqual(conferirPost(post, { livro, paginas }), []);
  assert.throws(() => montar({ ...exemplo(), materia: materia({ slug: 'Ruim Slug' }) }), /slug/);
  const { materia: _tira, ...semMateria } = exemplo();
  assert.throws(() => montar(semMateria), /faltam chaves: materia/);
});

test('post antigo, sem matéria, continua válido', () => {
  const livro = buscarPorPalavra(carregarPalavras(), 'JIBOIA');
  const paginas = lerLivro(livro);
  const post = montarPost(exemplo(), { livro, paginas, dia: '2026-10-27' });
  delete post.materia;
  assert.deepEqual(conferirPost(post, { livro, paginas }), []);
});
