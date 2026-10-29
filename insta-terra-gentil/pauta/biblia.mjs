// Fatos das bíblias de plantas: confere o fato contra o catálogo exportado (dados/biblia.json).
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';

// O catálogo sai do estudo privado (youtube_terragentil/inteligencia-carrossel/exportar_biblia.py)
// só com o fato em nossas palavras, livro e página: o trecho literal fica fora do repo público.
export const ARQUIVO_BIBLIA = path.join(DADOS, 'biblia.json');

// Fonte de pet aceita: as 4 estudadas (cartilha UFG, ASPCA, artigo de Ancara, Cats Protection).
export const FONTES_PET = ['UFG', 'ASPCA', 'Ancara', 'Cats Protection'];

export function lerBiblia(arquivo = ARQUIVO_BIBLIA) {
  return lerJson(arquivo);
}

// Só lê o catálogo se algum fato do post vier da bíblia (post só de ebook não depende dele).
export function bibliaDoPost(fatos, ler = lerBiblia) {
  return Array.isArray(fatos) && fatos.some((f) => f?.biblia) ? ler() : null;
}

// "Livro, p. N" do fato, venha do ebook (titulo) ou da bíblia (catálogo).
export function fonteDoFato(fato, titulo, biblia) {
  const item = fato?.biblia ? biblia?.fatos?.[fato.biblia] : null;
  return item ? `${item.livro}, p. ${item.pagina}` : `${titulo}, p. ${fato?.pagina}`;
}

// fato = { biblia: "b1-01", texto }. O texto é o do catálogo, igual (o fato já passou pelo QA).
// Devolve { texto, biblia, pagina, fonte, fontePet } ou lança o erro com o motivo.
export function validarFatoBiblia(fato, i, biblia) {
  const item = biblia?.fatos?.[fato.biblia];
  if (!item) throw new Error(`[fatos] fato ${i}: "${fato.biblia}" não está no catálogo da bíblia`);
  if ((fato.texto ?? '').trim() !== item.texto) {
    throw new Error(`[fatos] fato ${i}: texto diferente do catálogo (${fato.biblia})`);
  }
  if (item.fontePet && !FONTES_PET.includes(item.fontePet)) {
    throw new Error(`[fatos] fato ${i}: fonte de pet desconhecida (${item.fontePet})`);
  }
  return {
    texto: item.texto,
    biblia: fato.biblia,
    pagina: item.pagina,
    fonte: `${item.livro}, p. ${item.pagina}`,
    fontePet: item.fontePet ?? null,
  };
}
