import type { Metadata } from 'next';
import { INSTAGRAM_URL, SITE_NAME, SITE_URL, TIKTOK_URL, YOUTUBE_URL } from '@/lib/constants';

// Imagem de previa padrao. Precisa ir explicita: quando a pagina define openGraph,
// o Next deixa de herdar o app/opengraph-image.jpg da raiz.
export const DEFAULT_IMAGE = {
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

// Entidades do site para o JSON-LD. Todas as paginas apontam para os mesmos @id, assim o Google
// junta tudo numa entidade so (a marca Terra Gentil e o autor André) em vez de varias soltas.
export const ORG_ID = `${SITE_URL}/#organization`;
export const AUTOR_ID = `${SITE_URL}/#andre`;
export const COLECAO_ID = `${SITE_URL}/guias#colecao`;

/** Editora/marca: referencia por @id com nome e logo (o Google pede os dois em Article). */
export const PUBLISHER = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
};

/** O André, autor dos livros e rosto do canal. */
export const AUTOR = {
  '@type': 'Person',
  '@id': AUTOR_ID,
  name: 'André Zimermann',
  url: `${SITE_URL}/manifesto`,
  sameAs: [YOUTUBE_URL, INSTAGRAM_URL, TIKTOK_URL],
  worksFor: { '@id': ORG_ID },
};

/** Data do JSON-LD com hora e fuso (o Google avisa quando vem so "AAAA-MM-DD"). Meio-dia de Brasilia. */
export function dataIso(dia: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(dia) ? `${dia}T12:00:00-03:00` : dia;
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
