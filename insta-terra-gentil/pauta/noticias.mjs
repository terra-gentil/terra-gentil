// Pauta a partir de notícia: valida a fonte e monta a entrada da fila, sem copiar o texto.
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { SERIES } from './series.mjs';

export function carregarFontes(arquivo = path.join(DADOS, 'fontes-noticias.json')) {
  const { fontes } = lerJson(arquivo);
  if (!Array.isArray(fontes)) throw new Error(`[noticias] ${arquivo} sem a lista "fontes"`);
  return fontes;
}

// "https://www.RHS.org.uk/advice/x" -> "rhs.org.uk"
export function dominioDe(url) {
  let endereco;
  try {
    endereco = new URL(url);
  } catch {
    throw new Error(`[noticias] link inválido: ${url}`);
  }
  if (!['http:', 'https:'].includes(endereco.protocol)) {
    throw new Error(`[noticias] link precisa ser http(s): ${url}`);
  }
  return endereco.hostname.toLowerCase().replace(/^www\./, '');
}

// Domínio inteiro ou subdomínio: "blog.rhs.org.uk" vale, "malrhs.org.uk" não.
export function acharFonte(fontes, url) {
  const dominio = dominioDe(url);
  return fontes.find((f) => dominio === f.dominio || dominio.endsWith(`.${f.dominio}`)) ?? null;
}

// Notícia vira só o ponto de partida: tema, série e link. Os pontos do post são escritos do
// zero a partir da leitura (nunca tradução nem cópia), e a toxicidade só entra com ASPCA/Sinitox.
export function pautaDeNoticia(noticia, fontes) {
  const { url, titulo, serie, especie, gancho } = noticia;
  for (const [campo, valor] of Object.entries({ url, titulo, serie, especie, gancho })) {
    if (!valor || typeof valor !== 'string') throw new Error(`[noticias] falta o campo "${campo}"`);
  }
  if (!SERIES.includes(serie)) throw new Error(`[noticias] série desconhecida: ${serie}`);
  const fonte = acharFonte(fontes, url);
  if (!fonte) throw new Error(`[noticias] fonte fora da lista: ${dominioDe(url)}`);
  return {
    origem: 'noticia',
    serie,
    especie,
    gancho,
    pontos: [],
    palavra: null,
    fontes: [{ nome: fonte.nome, url, titulo }],
    status: 'rascunho',
  };
}
