// Link da notícia na legenda: só vai para o Instagram se a página já estiver no ar.
import { MARCA_NOTICIA } from '../../carrossel/legenda.mjs';

const dormirPadrao = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function urlDaNoticia(legenda) {
  const linha = legenda.split('\n').find((l) => l.startsWith(MARCA_NOTICIA));
  return linha ? linha.slice(MARCA_NOTICIA.length).trim() : null;
}

// Tira a linha do link e o espaço em branco que sobra no lugar dela.
export function legendaSemLink(legenda) {
  return legenda
    .split('\n')
    .filter((l) => !l.startsWith(MARCA_NOTICIA))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

// Espera a página subir (o deploy da Vercel pode atrasar). Sem página, posta sem o link: um link
// quebrado no post é pior do que nenhum. Sem linha de link na legenda, não faz nada.
export async function conferirNoticia(legenda, opcoes = {}) {
  const { http = fetch, tentativas = 20, esperaMs = 30000, dormir = dormirPadrao } = opcoes;
  const url = urlDaNoticia(legenda);
  if (!url) return { legenda, url: null, noAr: null };
  for (let i = 0; i < tentativas; i += 1) {
    const r = await http(url, { method: 'GET' }).catch(() => null);
    if (r?.ok) return { legenda, url, noAr: true };
    if (i < tentativas - 1) await dormir(esperaMs);
  }
  return { legenda: legendaSemLink(legenda), url, noAr: false };
}
