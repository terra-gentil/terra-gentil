// Palavras-chave dos ebooks: carrega o registro e reconhece a palavra num comentário.
import path from 'node:path';
import { DADOS, SITE_URL } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';

// "Jiboía!!" -> "JIBOIA": sem acento, maiúsculo, só letras, números e espaço.
export function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
}

// O comentário pede o PDF se tiver a palavra inteira, no singular ou no plural.
// "quero jiboias 🙏" pede JIBOIA; "jiboiada" não pede.
export function comentarioPede(comentario, palavra) {
  const alvo = normalizar(palavra);
  if (!alvo) return false;
  return normalizar(comentario)
    .split(' ')
    .some((p) => p === alvo || p === `${alvo}S` || p === `${alvo}ES`);
}

export function carregarPalavras(arquivo = path.join(DADOS, 'palavras.json')) {
  const { palavras } = lerJson(arquivo);
  if (!Array.isArray(palavras)) throw new Error(`[palavras] ${arquivo} sem a lista "palavras"`);
  return palavras;
}

export function buscarPorPalavra(palavras, palavra) {
  const alvo = normalizar(palavra);
  return palavras.find((p) => normalizar(p.palavra) === alvo) ?? null;
}

// Link público do PDF no site (os arquivos ficam em public/ebooks/).
export const linkDoPdf = (item) => `${SITE_URL}/ebooks/${encodeURIComponent(item.pdf)}`;
