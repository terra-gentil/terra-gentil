// Notícia usada como gancho de tema: o post guarda só quem, título e link, nunca o texto dela.
import { acharFonte, carregarFontes } from './noticias.mjs';

// url = o que a rotina escreveu em "noticia" (link ou null). Só vale link da pauta de hoje.
export function resolverNoticia(url, pauta) {
  if (url === null) return null;
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('[noticia] "noticia" deve ser o link de um item da pauta ou null');
  }
  const item = pauta?.itens?.find((i) => i.url === url);
  if (!item) throw new Error(`[noticia] link fora da pauta de hoje: ${url}`);
  return { nome: item.fonte, titulo: item.titulo, url };
}

// Post antigo não tem o campo (undefined). Quando existe, o link tem de ser de uma fonte da lista.
export function problemasDaFonteNoticia(valor, fontes = carregarFontes()) {
  if (valor === undefined || valor === null) return [];
  const campos = ['nome', 'titulo', 'url'];
  if (typeof valor !== 'object' || campos.some((c) => !valor[c] || typeof valor[c] !== 'string')) {
    return ['"fonteNoticia" deve ter nome, titulo e url'];
  }
  let fonte = null;
  try {
    fonte = acharFonte(fontes, valor.url);
  } catch {
    return [`"fonteNoticia": link inválido: ${valor.url}`];
  }
  if (!fonte) return [`"fonteNoticia": fonte fora da lista: ${valor.url}`];
  if (fonte.nome !== valor.nome) return ['"fonteNoticia": nome não bate com a fonte do link'];
  return [];
}
