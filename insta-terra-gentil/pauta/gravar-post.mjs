// Grava o post em dados/posts/ depois de conferir tudo. Um post por dia, um arquivo por post.
import fs from 'node:fs';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { buscarPorPalavra } from '../dm/palavras.mjs';
import { PASTA_LIVROS, lerLivro } from './livros.mjs';
import { conferirPost, montarPost } from './roteiro.mjs';

export const PASTA_POSTS = path.join(DADOS, 'posts');

// Arquivos que começam com "_" são apoio (log da rotina), não posts.
export function lerPosts(pasta = PASTA_POSTS) {
  if (!fs.existsSync(pasta)) return [];
  return fs
    .readdirSync(pasta)
    .filter((nome) => nome.endsWith('.json') && !nome.startsWith('_'))
    .map((nome) => lerJson(path.join(pasta, nome)));
}

export function gravarPost(bruto, opcoes) {
  const { dia, palavras, pastaLivros = PASTA_LIVROS, pastaPosts = PASTA_POSTS, forcar } = opcoes;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) throw new Error(`[gravar] dia inválido: ${dia}`);
  const livro = buscarPorPalavra(palavras, bruto?.palavra ?? '');
  if (!livro) throw new Error(`[gravar] palavra desconhecida: ${bruto?.palavra}`);
  const post = montarPost(bruto, { livro, paginas: lerLivro(livro, pastaLivros), dia });
  const mesmoDia = lerPosts(pastaPosts).find((p) => p.dia === dia);
  if (mesmoDia && !forcar)
    throw new Error(`[gravar] já existe post para ${dia} (${mesmoDia.palavra})`);
  const arquivo = path.join(pastaPosts, `${dia}-${livro.palavra.toLowerCase()}.json`);
  fs.mkdirSync(pastaPosts, { recursive: true });
  fs.writeFileSync(arquivo, `${JSON.stringify(post, null, 2)}\n`);
  return { arquivo, post };
}

// Refaz a conferência de todo post gravado (passo de merge): pega arquivo editado à mão.
export function conferirTodos({ palavras, pastaLivros = PASTA_LIVROS, pastaPosts = PASTA_POSTS }) {
  if (!fs.existsSync(pastaPosts)) return [];
  const nomes = fs.readdirSync(pastaPosts).filter((n) => n.endsWith('.json') && !n.startsWith('_'));
  return nomes.map((nome) => {
    const post = lerJson(path.join(pastaPosts, nome));
    const livro = buscarPorPalavra(palavras, post.palavra ?? '');
    if (!livro) return { nome, problemas: [`palavra desconhecida: ${post.palavra}`] };
    const problemas = conferirPost(post, { livro, paginas: lerLivro(livro, pastaLivros) });
    const esperado = `${post.dia}-${livro.palavra.toLowerCase()}.json`;
    if (nome !== esperado) problemas.push(`nome do arquivo deveria ser ${esperado}`);
    return { nome, problemas };
  });
}
