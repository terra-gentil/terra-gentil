import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import PageHero from '@/components/sections/PageHero';
import { caminhoDaNoticia, dataLonga, lerNoticias } from '@/lib/noticias';
import { pageMetadata } from '@/lib/seo';

const base = pageMetadata({
  title: 'Notícias de jardinagem',
  description:
    'Cuidados com plantas explicados com calma e sem culpa: rega, luz, mitos e erros comuns, com fonte nos ebooks do André.',
  path: '/noticias',
});

// Sem nenhuma notícia a página fica fina demais para o Google: sai de fora até a primeira chegar.
export function generateMetadata(): Metadata {
  return lerNoticias().length ? base : { ...base, robots: { index: false, follow: true } };
}

export default function NoticiasPage() {
  const noticias = lerNoticias();
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: 'Notícias', path: '/noticias' }]} />
      <PageHero
        eyebrow={`Notícias · ${noticias.length} ${noticias.length === 1 ? 'texto' : 'textos'}`}
        title={
          <>
            Planta com <span className="ital">calma</span>,
            <br />
            sem culpa.
          </>
        }
        sub="Os cuidados que viram carrossel no Instagram também ganham texto completo aqui, com a fonte de cada informação."
        mascot="/images/mascot/laptop.webp"
        mascotAlt="Brotinho com laptop"
      />

      <section className="section-pad">
        {noticias.length === 0 ? (
          <p className="blog-excerpt" style={{ textAlign: 'center' }}>
            Os primeiros textos chegam em breve.
          </p>
        ) : (
          <div className="blog-grid">
            {noticias.map((n) => (
              <Link key={n.slug} href={caminhoDaNoticia(n.slug)} className="blog-card">
                {n.capa ? (
                  <div className="blog-thumb">
                    <Image
                      src={n.capa.src}
                      alt={`Capa do carrossel: ${n.gancho}`}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="blog-thumb blog-thumb-fallback" aria-hidden="true">
                    <span>Terra Gentil</span>
                  </div>
                )}
                <div className="blog-body">
                  <time dateTime={n.dia} className="blog-date">
                    {dataLonga(n.dia)}
                  </time>
                  <h2 className="blog-title">{n.materia.titulo}</h2>
                  <p className="blog-excerpt">{n.materia.descricao}</p>
                  <span className="blog-read">
                    Ler texto <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
