// Testes do montador do post: fatos conferidos no livro, formato, tamanhos e gravação em disco.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { buscarPorPalavra, carregarPalavras } from '../dm/palavras.mjs';
import { validarFatos } from './fatos.mjs';
import { gravarPost, lerPosts } from './gravar-post.mjs';
import { lerLivro, normalizarTexto, paginasDoTexto, trechoEstaNaPagina } from './livros.mjs';
import { diaDoPost, proximoLivro } from './proxima.mjs';
import { montarPost } from './roteiro.mjs';

const palavras = carregarPalavras();
const livro = buscarPorPalavra(palavras, 'JIBOIA');
const paginas = lerLivro(livro);
const bruto = () => lerJson(path.join(DADOS, 'bruto-exemplo.json'));
const montar = (b) => montarPost(b, { livro, paginas, dia: '2026-10-27' });

test('normalizarTexto ignora acento, caixa, pontuação e quebra de linha', () => {
  assert.equal(
    normalizarTexto('Esqueça o calendário\nfixo ("regue!")'),
    'esqueca o calendario fixo regue',
  );
});

test('paginasDoTexto separa por form feed e descarta a página vazia do fim', () => {
  assert.deepEqual(paginasDoTexto('a\fb\fc\f'), ['a', 'b', 'c']);
  const trecho = 'enfie o dedo na terra';
  assert.equal(trechoEstaNaPagina(['x', 'Enfie o dedo,\nna terra!'], 2, trecho), true);
  assert.equal(trechoEstaNaPagina(['x', 'outra coisa'], 2, trecho), false);
  assert.equal(trechoEstaNaPagina(['x'], 5, trecho), false);
});

test('o livro da jiboia está no repositório com 19 páginas', () => {
  assert.equal(paginas.length, 19);
  assert.ok(trechoEstaNaPagina(paginas, 12, 'Regar todo dia só um pouquinho'));
});

test('o bruto de exemplo vira um post completo, com fechamento fixo e fontes só das usadas', () => {
  const post = montar(bruto());
  assert.equal(post.slides.length, 8);
  assert.equal(post.slides[7].linha1, 'Gentileza');
  assert.equal(post.dia, '2026-10-27');
  assert.equal(post.fatos[0].fonte, 'Jiboia: A Planta que Perdoa Tudo, p. 12');
  assert.deepEqual(post.fontes, [
    'Jiboia: A Planta que Perdoa Tudo, p. 12',
    'Jiboia: A Planta que Perdoa Tudo, p. 9',
    'Jiboia: A Planta que Perdoa Tudo, p. 11',
  ]);
});

test('barra fato inventado: trecho que não está na página, página errada e trecho curto', () => {
  const f = (extra) => [...bruto().fatos.slice(0, 2), { ...bruto().fatos[2], ...extra }];
  const base = { paginas, titulo: 'T' };
  assert.throws(
    () => validarFatos(f({ trecho: 'A jiboia precisa de adubo todo mês sem falta' }), base),
    /não existe na página 12/,
  );
  assert.throws(() => validarFatos(f({ pagina: 3 }), base), /não existe na página 3/);
  assert.throws(() => validarFatos(f({ pagina: 99 }), base), /página inválida/);
  assert.throws(() => validarFatos(f({ trecho: 'rega' }), base), /sem trecho literal/);
  assert.throws(() => validarFatos(bruto().fatos.slice(0, 2), base), /pelo menos 3/);
});

test('toxicidade e pet são recusados mesmo com trecho verdadeiro', () => {
  const fatos = [
    ...bruto().fatos.slice(0, 2),
    { ...bruto().fatos[2], texto: 'A jiboia é tóxica para gatos.' },
  ];
  assert.throws(() => validarFatos(fatos, { paginas, titulo: 'T' }), /toxicidade ou pet/);
});

test('barra travessão, campo grande, série e palavra erradas, e fatosUsados inexistente', () => {
  const b = bruto();
  b.slide2_problema = { ...b.slide2_problema, nota: 'Calma — não é culpa sua.' };
  b.slide3_problema = { ...b.slide3_problema, linha1: 'Uma linha de título longa demais' };
  b.serie = 'Receita';
  b.fatosUsados = [0, 99];
  assert.throws(
    () => montar(b),
    (e) => {
      for (const parte of [
        /travessão em "nota"/,
        /"linha1" com 32/,
        /série desconhecida/,
        /fatosUsados/,
      ]) {
        assert.match(e.message, parte);
      }
      return true;
    },
  );
  assert.throws(() => montar({ ...bruto(), palavra: 'LUZ' }), /não é a do livro/);
  const semSlide = bruto();
  delete semSlide.slide5_passo;
  assert.throws(() => montar(semSlide), /faltam chaves: slide5_passo/);
});

test('rodízio: livro nunca usado primeiro, depois o de post mais antigo', () => {
  const ps = [{ palavra: 'CODIGO' }, { palavra: 'IMORTAL' }];
  assert.equal(proximoLivro(palavras, []).palavra, 'CODIGO');
  assert.equal(
    proximoLivro(palavras, [{ palavra: 'CODIGO', dia: '2026-10-01' }]).palavra,
    'IMORTAL',
  );
  const todos = palavras.map((l, i) => ({
    palavra: l.palavra,
    dia: `2026-09-${String(i + 1).padStart(2, '0')}`,
  }));
  assert.equal(proximoLivro(palavras, todos).palavra, 'CODIGO');
  todos[0].dia = '2026-10-30';
  assert.equal(proximoLivro(palavras, todos).palavra, 'IMORTAL');
  assert.equal(ps.length, 2);
});

test('o dia do post é amanhã em Brasília', () => {
  assert.equal(diaDoPost(new Date('2026-10-26T15:00:00Z')), '2026-10-27');
  assert.equal(diaDoPost(new Date('2026-10-27T01:00:00Z')), '2026-10-27');
});

test('gravarPost grava um arquivo por dia e recusa o segundo post do mesmo dia', () => {
  const pastaPosts = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-posts-'));
  const { arquivo, post } = gravarPost(bruto(), { dia: '2026-10-27', palavras, pastaPosts });
  assert.equal(path.basename(arquivo), '2026-10-27-jiboia.json');
  assert.equal(lerPosts(pastaPosts)[0].gancho, post.gancho);
  assert.throws(
    () => gravarPost(bruto(), { dia: '2026-10-27', palavras, pastaPosts }),
    /já existe post/,
  );
  assert.ok(gravarPost(bruto(), { dia: '2026-10-27', palavras, pastaPosts, forcar: true }));
  assert.throws(() => gravarPost(bruto(), { dia: '27/10', palavras, pastaPosts }), /dia inválido/);
  fs.rmSync(pastaPosts, { recursive: true });
});
