import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

// Imagem de previa padrao. Precisa ir explicita: quando a pagina define openGraph,
// o Next deixa de herdar o app/opengraph-image.jpg da raiz.
const DEFAULT_IMAGE = {
  url: '/opengraph-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Terra Gentil: jardinagem com gentileza e muita terra',
};

/**
 * Molde de metadados das paginas internas: <title>, description, canonical,
 * Open Graph e Twitter proprios da pagina (sem isso a previa herdava a da home).
 */
export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const { title, description, path } = opts;
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [DEFAULT_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [DEFAULT_IMAGE.url] },
  };
}

/** Item da trilha de navegacao (BreadcrumbList). `path` relativo a raiz do site. */
export interface Crumb {
  name: string;
  path: string;
}

/** JSON-LD BreadcrumbList: Inicio > ... > pagina atual. */
export function breadcrumbJsonLd(crumbs: Crumb[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Início', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.path, SITE_URL).href,
    })),
  };
  // escapa "<" pra nenhum texto fechar a tag script
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
