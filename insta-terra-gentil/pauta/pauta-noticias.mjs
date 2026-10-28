// Estado da pauta de notícias (dados/pauta-noticias.json): itens recentes e links já usados.
// Só título, link, data, categorias e fonte. O texto da matéria nunca é guardado.
import { filtrar } from './filtrar.mjs';

const DIA_MS = 24 * 60 * 60 * 1000;
export const DIAS_DE_PAUTA = 14;
// Link usado fica lembrado além da janela da pauta, para a notícia não voltar depois.
export const DIAS_DE_MEMORIA = 30;

export const estadoVazio = () => ({
  atualizadoEm: null,
  itens: [],
  usados: [],
  falhas: [],
  semFeed: [],
});

// Junta o que já estava na pauta com a coleta nova, sem repetir, sem usados e sem vencidos.
export function atualizarPauta(estado, coleta, fontes, agora = new Date()) {
  const usados = (estado.usados ?? []).filter(
    (u) => Date.parse(u.em) >= agora.getTime() - DIAS_DE_MEMORIA * DIA_MS,
  );
  const itens = filtrar([...(estado.itens ?? []), ...coleta.itens], fontes, {
    agora,
    dias: DIAS_DE_PAUTA,
    vistos: usados.map((u) => u.url),
  });
  return {
    atualizadoEm: agora.toISOString(),
    itens,
    usados,
    falhas: coleta.falhas,
    semFeed: coleta.semFeed,
  };
}

// Tira o item da pauta e lembra o link: chamado quando um post nasce dessa notícia.
export function marcarUsado(estado, url, agora = new Date()) {
  if (!estado.itens.some((i) => i.url === url) && !estado.usados.some((u) => u.url === url)) {
    throw new Error(`[pauta] link fora da pauta: ${url}`);
  }
  return {
    ...estado,
    itens: estado.itens.filter((i) => i.url !== url),
    usados: estado.usados.some((u) => u.url === url)
      ? estado.usados
      : [...estado.usados, { url, em: agora.toISOString() }],
  };
}

// Compara só o que importa: atualizadoEm e falhas mudam todo dia e não justificam commit.
export const conteudoDaPauta = (e) => JSON.stringify({ itens: e.itens, usados: e.usados });
