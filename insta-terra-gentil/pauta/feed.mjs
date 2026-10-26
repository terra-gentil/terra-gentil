// Lê um RSS 2.0 já baixado: só título, link, data e categorias, nunca o texto da matéria.
const ENTIDADES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&apos;': "'",
};

function limpar(texto) {
  return texto
    .replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&(?:amp|lt|gt|quot|apos);/g, (e) => ENTIDADES[e])
    .trim();
}

function campo(bloco, tag) {
  const padrao = String.raw`<${tag}(?:\s[^>]*)?>([\s\S]*?)</${tag}>`;
  const achou = bloco.match(new RegExp(padrao));
  return achou ? limpar(achou[1]) : null;
}

export function lerFeed(xml) {
  if (typeof xml !== 'string' || !xml.includes('<rss')) {
    throw new Error('[feed] conteúdo não é um RSS');
  }
  const itens = [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)].map((m) => m[0]);
  return itens
    .map((bloco) => {
      const data = campo(bloco, 'pubDate');
      const categorias = [...bloco.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/g)].map(
        (c) => limpar(c[1]),
      );
      return {
        titulo: campo(bloco, 'title'),
        url: campo(bloco, 'link'),
        publicadoEm: data && !Number.isNaN(Date.parse(data)) ? new Date(data).toISOString() : null,
        categorias,
      };
    })
    .filter((item) => item.titulo && item.url);
}
