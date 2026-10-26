// Baixa o RSS de cada fonte com feed. Fonte fora do ar vira "falha" e não derruba as outras.
import { lerFeed } from './feed.mjs';

const AGENTE = 'Mozilla/5.0 (compatible; TerraGentilPauta/0.1; +https://terragentil.com.br)';

export async function coletarFonte(fonte, buscar = fetch, limiteMs = 15000) {
  const resposta = await buscar(fonte.feed, {
    headers: { 'user-agent': AGENTE, accept: 'application/rss+xml, application/xml' },
    signal: AbortSignal.timeout(limiteMs),
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return lerFeed(await resposta.text()).map((item) => ({ ...item, fonte: fonte.nome }));
}

export async function coletar(fontes, buscar = fetch) {
  const comFeed = fontes.filter((f) => f.feed);
  const resultados = await Promise.allSettled(comFeed.map((f) => coletarFonte(f, buscar)));
  const itens = [];
  const falhas = [];
  resultados.forEach((r, i) => {
    if (r.status === 'fulfilled') itens.push(...r.value);
    else falhas.push({ fonte: comFeed[i].nome, motivo: r.reason?.message ?? String(r.reason) });
  });
  return { itens, falhas, semFeed: fontes.filter((f) => !f.feed).map((f) => f.nome) };
}
