import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import NewsTracker from '@/components/analytics/NewsTracker';
import JsonLd from '@/components/seo/JsonLd';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_NAME, SITE_URL } from '@/lib/constants';
import {
  caminhoDaNoticia,
  dataLonga,
  leiaTambem,
  lerNoticias,
  noticiaPorSlug,
} from '@/lib/noticias';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return lerNoticias().map((n) => ({ slug: n.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = noticiaPorSlug(slug);
  if (!noticia) return { title: 'Notícia não encontrada' };
  const { materia } = noticia;
  const caminho = caminhoDaNoticia(slug);
  // O Google corta título acima de ~60 caracteres: nesses casos sai sem o sufixo da marca.
  const base = pageMetadata({ title: materia.titulo, description: materia.descricao, path: caminho });
  const imagem = noticia.capa
    ? [{ url: noticia.capa.src, width: 1080, height: 1350, alt: `Carrossel: ${noticia.gancho}` }]
    : base.openGraph?.images;
  return {
    ...base,
    title: `${materia.titulo} · ${SITE_NAME}`.length > 60 ? materia.titulo : base.title,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: noticia.dia,
      images: imagem,
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const noticia = noticiaPorSlug(slug);
  if (!noticia) notFound();

  const { materia, capa, ebook, fontes } = noticia;
  const caminho = caminhoDaNoticia(slug);
  const url = new URL(caminho, SITE_URL).href;
  const imagem = capa ? new URL(capa.src, SITE_URL).href : `${SITE_URL}/images/logo/full.jpg`;
  const outras = leiaTambem(slug);

  const artigo = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: materia.titulo,
    description: materia.descricao,
    datePublished: noticia.dia,
    dateModified: noticia.dia,
    image: imagem,
    inLanguage: 'pt-BR',
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  const perguntas = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: materia.faq.map((q) => ({
      '@type': 'Question',
      name: q.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: q.resposta },
    })),
  };

  return (
    <article className="bp-article">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Notícias', path: '/noticias' },
          { name: materia.titulo, path: caminho },
        ]}
      />
      <JsonLd data={artigo} />
      <NewsTracker slug={slug} serie={noticia.serie} livro={ebook?.titulo ?? noticia.palavra} />
      {materia.faq.length > 0 && <JsonLd data={perguntas} />}
      <div className="bp-inner">
        <nav className="bp-trilha" aria-label="Trilha de navegação">
          <Link href="/">Início</Link>
          <span aria-hidden="true">›</span>
          <Link href="/noticias">Notícias</Link>
        </nav>

        <div className="bp-eyebrow">
          <time dateTime={noticia.dia}>{dataLonga(noticia.dia)}</time>
          <span aria-hidden="true">·</span>
          <span>{noticia.serie}</span>
        </div>

        <h1 className="bp-title">{materia.titulo}</h1>
        <p className="bp-excerpt">{materia.descricao}</p>

        {capa && (
          <figure className="bp-capa">
            <Image
              src={capa.src}
              alt={`Capa do carrossel: ${noticia.gancho}`}
              width={1080}
              height={1350}
              sizes="(max-width: 600px) 100vw, 420px"
              preload
            />
            {capa.credito && <figcaption>{capa.credito}</figcaption>}
          </figure>
        )}

        <div className="bp-content">
          <p className="bp-lead">{materia.introducao}</p>
          {materia.secoes.map((secao) => (
            <section key={secao.titulo}>
              <h2>{secao.titulo}</h2>
              {secao.paragrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          {materia.faq.length > 0 && (
            <section>
              <h2>Perguntas frequentes</h2>
              <dl className="bp-faq">
                {materia.faq.map((q) => (
                  <div key={q.pergunta}>
                    <dt>{q.pergunta}</dt>
                    <dd>{q.resposta}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <p>{materia.conclusao}</p>
        </div>

        <div className="bp-ctas">
          {ebook && (
            <a className="btn-amber" href={ebook.url} data-cta="ebook">
              <span>Baixar o ebook grátis</span>
            </a>
          )}
          <a
            className="btn-yt"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="instagram"
          >
            Seguir {INSTAGRAM_HANDLE} →
          </a>
        </div>

        {(fontes.length > 0 || ebook) && (
          <aside className="bp-fontes">
            <h2>Fontes</h2>
            <ul>
              {fontes.map((fonte) => (
                <li key={fonte}>{fonte}</li>
              ))}
            </ul>
          </aside>
        )}

        {outras.length > 0 && (
          <nav className="bp-mais" aria-label="Leia a seguir">
            <h2>Leia a seguir</h2>
            <ul>
              {outras.map((n) => (
                <li key={n.slug}>
                  <Link href={caminhoDaNoticia(n.slug)}>{n.materia.titulo}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
