// Filtra os itens coletados: recentes, sem repetição, sem link já usado e com domínio da lista.
import { acharFonte } from './noticias.mjs';

const DIA_MS = 24 * 60 * 60 * 1000;

export function filtrar(itens, fontes, { agora = new Date(), dias = 14, vistos = [] } = {}) {
  const jaVistos = new Set(vistos);
  const limite = agora.getTime() - dias * DIA_MS;
  const unicos = new Map();
  for (const item of itens) {
    const data = item.publicadoEm ? Date.parse(item.publicadoEm) : NaN;
    if (Number.isNaN(data) || data < limite || data > agora.getTime() + DIA_MS) continue;
    if (jaVistos.has(item.url) || unicos.has(item.url)) continue;
    if (!acharFonte(fontes, item.url)) continue;
    unicos.set(item.url, item);
  }
  return [...unicos.values()].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
}
