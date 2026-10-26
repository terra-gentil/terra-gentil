import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { caminhoDaNoticia, lerNoticias } from '@/lib/noticias';

// Gerado no build: as notícias só mudam quando o site é publicado de novo.
export const dynamic = 'force-static';

const escapar = (texto: string) =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function GET() {
  const noticias = lerNoticias();
  const itens = noticias
    .map((n) => {
      const link = new URL(caminhoDaNoticia(n.slug), SITE_URL).href;
      const data = new Date(`${n.dia}T07:00:00-03:00`).toUTCString();
      return [
        '    <item>',
        `      <title>${escapar(n.materia.titulo)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${data}</pubDate>`,
        `      <description>${escapar(n.materia.descricao)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapar(SITE_NAME)}: notícias de jardinagem</title>`,
    `    <link>${SITE_URL}/noticias</link>`,
    '    <description>Cuidados com plantas, com calma e sem culpa.</description>',
    '    <language>pt-BR</language>',
    itens,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
