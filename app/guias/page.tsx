import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { ebooks, ebookCategorias } from '@/data/ebooks';
import GuiasClient from './GuiasClient';
import StatNum from '@/components/ui/StatNum';
import { INSTAGRAM_URL, SITE_URL } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { listarGuias, totalEbooks } from '@/lib/guias';
import { TEMAS, temaDe, paginaDoEbookAntigo } from '@/lib/temas';
import JsonLd from '@/components/seo/JsonLd';
import { COLECAO_ID, PUBLISHER } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Ebooks',
  description:
    `${totalEbooks()} ebooks práticos pra resolver os perrengues mais comuns. Suculentas, orquídeas, horta, pragas. Leia no site ou baixe grátis em PDF.`,
  path: '/guias',
});

const COLORS = ['#74C69D', '#4A8C4F', '#D8552B', '#E8A33D', '#74C69D', '#4A8C4F', '#E8A33D', '#D8552B', '#74C69D', '#E8A33D', '#4A8C4F', '#D8552B'] as const;

export default function GuiasPage() {
  const books = ebooks.map((e, i) => ({
    id: String(i + 1).padStart(2, '0'),
    title: e.title.replace(/^[^a-zA-Z0-9]+/, '').trim(),
    pages: 24 + (i * 4) % 24,
    cat: e.categoria,
    color: COLORS[i % COLORS.length],
    pdf: e.pdf,
    pagina: paginaDoEbookAntigo(e.pdf) ? `/guias/${paginaDoEbookAntigo(e.pdf)}` : undefined,
    cover: e.image,
  }));
  const livros = listarGuias();
  const total = books.length + livros.length;
  const totalPages = books.reduce((acc, b) => acc + b.pages, 0) + livros.reduce((acc, g) => acc + g.paginas.length, 0);


  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: 'Ebooks', path: '/guias' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': COLECAO_ID,
          url: `${SITE_URL}/guias`,
          name: 'Coleção Terra Gentil: livros grátis de jardinagem',
          inLanguage: 'pt-BR',
          isAccessibleForFree: true,
          publisher: PUBLISHER,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: livros.length,
            itemListElement: livros.map((g, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/guias/${g.slug}`,
              name: g.titulo,
            })),
          },
        }}
      />
      <section className="gu-hero">
        <div className="gu-hero-inner">
          <div className="gu-hero-stack" aria-hidden="true">
            {books.slice(0, 3).map((b, i) => (
              <div
                key={b.id}
                className="gu-stack-book"
                style={{
                  '--c': b.color,
                  '--rot': i === 0 ? '-8deg' : i === 1 ? '4deg' : '-3deg',
                  '--y': i === 0 ? '0px' : i === 1 ? '-12px' : '-30px',
                } as React.CSSProperties}
              >
                <div className="gu-stack-num">{b.id}</div>
                <div className="gu-stack-title">{b.title}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="page-hero-eyebrow">Biblioteca · 100% grátis</div>
            <h1 className="page-hero-title">
              {total} ebooks <span className="ital">práticos</span>.
            </h1>
            <p className="page-hero-sub">
              Ebooks de bolso pra resolver os perrengues mais comuns. {totalPages} páginas no total. Tudo em PDF, tudo
              de graça, tudo escrito pelo André.
            </p>
            <div className="gu-stat-row">
              <div className="gu-stat">
                <div className="n"><StatNum to={total} /></div>
                <div className="l">ebooks</div>
              </div>
              <div className="gu-stat">
                <div className="n"><StatNum to={totalPages} /></div>
                <div className="l">páginas</div>
              </div>
              <div className="gu-stat">
                <div className="n">∞</div>
                <div className="l">downloads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      {livros.length > 0 && (
        <section className="gu-library gu-livros" aria-labelledby="gu-livros-titulo">
          <div className="gu-inner">
            <h2 id="gu-livros-titulo" className="gu-livros-titulo">
              Coleção Terra Gentil: <span className="ital">leia no site</span>
            </h2>
            <p className="gu-livros-sub">
              {livros.length} livros curtos para ler aqui mesmo, com o PDF grátis para baixar no fim.
            </p>
            {TEMAS.map((t) => {
              const doTema = livros.filter((g) => temaDe(g.codigo).id === t.id);
              if (!doTema.length) return null;
              return (
                <section key={t.id} id={t.id} className="gu-tema" aria-labelledby={`tema-${t.id}`}>
                  <h3 id={`tema-${t.id}`} className="gu-tema-titulo">
                    {t.nome} <span className="gu-tema-n">{doTema.length}</span>
                  </h3>
                  <p className="gu-tema-chamada">{t.chamada}</p>
                  <div className="gu-grid gu-grid--livros">
                    {doTema.map((g) => (
                      <Link key={g.slug} className="gu-card" href={`/guias/${g.slug}`}>
                        <div className="gu-cover gu-cover--livro">
                          {g.capa && (
                            <Image src={g.capa.src} alt={g.capa.alt} fill sizes="(max-width: 720px) 45vw, 180px" className="gu-cover-img" />
                          )}
                        </div>
                        <div className="gu-card-meta">
                          <div className="gu-card-title">{g.titulo}</div>
                          <div className="gu-card-row">
                            <div className="gu-card-cat">{g.codigo.replace('TG', 'TG ')}</div>
                            <div className="gu-card-dl">Ler →</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      )}

      <GuiasClient books={books} cats={ebookCategorias} />

      <section className="page-cta">
        <h2>
          Quer um ebook <span className="ital">novo</span>?
        </h2>
        <p>Manda no DM do Instagram qual perrengue você quer ver virar ebook. Os mais pedidos viram os próximos.</p>
        <a className="btn-yt" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Pedir no Instagram →
        </a>
      </section>
    </>
  );
}
