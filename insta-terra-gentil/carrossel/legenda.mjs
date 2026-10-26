// Legenda do post: gancho, resumo, chamada da palavra-chave, Doutor, crédito da foto e hashtags.
import { DOUTOR_URL } from '../lib/config.mjs';

const LIMITE_INSTAGRAM = 2200;
const HASHTAGS = ['#jardinagem', '#plantas', '#plantasdecasa', '#terragentil'];
const TRAVESSAO = /[—–]/;

// A linha do link da notícia. O workflow de postar a tira se a página não estiver no ar.
export const MARCA_NOTICIA = 'Leia a matéria completa: ';

// Sem palavra-chave, a chamada vira "salva este post". Com ela, o ebook sai no direct.
function chamada(palavra, tituloEbook) {
  if (!palavra) return 'Salva este post para consultar depois.';
  const livro = tituloEbook ? ` o ebook "${tituloEbook}"` : ' o ebook';
  return `Comenta ${palavra.toUpperCase()} aqui embaixo e eu te mando${livro} no direct. De graça.`;
}

export function legendaDe(post) {
  const { gancho, resumo, palavra, tituloEbook, credito, urlNoticia, hashtags = HASHTAGS } = post;
  if (!gancho || typeof gancho !== 'string') throw new Error('[legenda] falta o gancho');
  const partes = [
    gancho.trim(),
    resumo?.trim(),
    urlNoticia && `${MARCA_NOTICIA}${urlNoticia}`,
    chamada(palavra, tituloEbook),
    `Quer saber o que a sua planta tem? Manda a foto para o Doutor das Plantas: ${DOUTOR_URL}`,
    credito,
    hashtags.join(' '),
  ].filter(Boolean);
  const legenda = partes.join('\n\n');
  if (TRAVESSAO.test(legenda)) throw new Error('[legenda] travessão no texto do post');
  if (legenda.length > LIMITE_INSTAGRAM) {
    throw new Error(`[legenda] ${legenda.length} caracteres, o limite é ${LIMITE_INSTAGRAM}`);
  }
  return legenda;
}
