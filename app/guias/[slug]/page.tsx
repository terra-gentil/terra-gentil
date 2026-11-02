import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowDown } from 'lucide-react';
import { Fraunces, Montserrat } from 'next/font/google';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import JsonLd from '@/components/seo/JsonLd';
import LivroTracker from '@/components/analytics/LivroTracker';
import { PDF_BASE_URL, SITE_NAME, SITE_URL } from '@/lib/constants';
import { lerGuia, listarGuias, montarGuia, textoDe, type Guia } from '@/lib/guias';
import { Blocos, Fotos, fotosNosPassos } from './Blocos';

// Fontes do livro (as mesmas do PDF). Auto-hospedadas pelo Next, so carregam nesta rota.
const fraunces = Fraunces({ subsets: ['latin'], weight: ['600', '800'], variable: '--font-fraunces', display: 'swap' });
// Fonte variavel: sem lista de pesos, o Next usa um unico arquivo que serve para 600, 700 e 800.
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

export function generateStaticParams() {
  return listarGuias().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guia = lerGuia(slug);
  if (!guia) return { title: 'Livro não encontrado' };

  const { hero } = montarGuia(guia);
  const path = `/guias/${guia.slug}`;
  // O Google corta titulo acima de ~60 caracteres: nesses casos sai sem a marca.
  const comMarca = `${guia.meta.titulo} · ${SITE_NAME}`;
  const title = comMarca.length > 60 ? guia.meta.titulo : comMarca;
  const imagens = hero ? [{ url: hero.src, width: hero.largura, height: hero.altura, alt: hero.alt }] : undefined;

  return {
    title,
    description: guia.meta.descricao,
    alternates: { canonical: path },
    openGraph: {
      title: guia.meta.titulo,
      description: guia.meta.descricao,
      url: path,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'article',
      modifiedTime: guia.meta.atualizado,
      images: imagens,
    },
    twitter: { card: 'summary_large_image', title: guia.meta.titulo, description: guia.meta.descricao },
  };
}

function CartaoBaixar({ guia, posicao }: { guia: Guia; posicao: 'topo' | 'fim' }) {
  // Sem endereco dos PDFs (R2) configurado, nao mostra um botao quebrado.
  if (!PDF_BASE_URL) return null;
  return (
    <div className="lv-download">
      <div className="lv-download__glow" aria-hidden="true" />
      <div className="lv-palco">
        <div className="lv-sombra" aria-hidden="true" />
        <div className="lv-flutua">
          <div className="lv-livro3d">
            <span className="lv-lombada" aria-hidden="true" />
            {guia.capa && (
              <Image src={guia.capa.src} alt={guia.capa.alt} width={guia.capa.largura} height={guia.capa.altura} sizes="176px" />
            )}
            <span className="lv-lustro" aria-hidden="true" />
          </div>
        </div>
        <span className="lv-selo-gratis" aria-hidden="true">
          Grátis
        </span>
      </div>
      <div className="lv-download__acao">
        <a className="lv-botao" href={`${PDF_BASE_URL}/${guia.meta.pdf}`} download rel="noopener" data-livro-baixar={posicao}>
          <span className="lv-botao__anel" aria-hidden="true" />
          <span className="lv-botao__brilho" aria-hidden="true">
            <span />
          </span>
          <span className="lv-botao__texto">Baixar o livro grátis (PDF)</span>
          <span className="lv-botao__seta" aria-hidden="true">
            <ArrowDown size={18} strokeWidth={2.4} />
          </span>
        </a>
        <p className="lv-download__nota">PDF grátis, sem cadastro.</p>
      </div>
    </div>
  );
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guia = lerGuia(slug);
  if (!guia) notFound();

  const m = montarGuia(guia);
  const path = `/guias/${guia.slug}`;
  const outros = listarGuias().filter((g) => g.slug !== guia.slug).slice(0, 3);

  const artigo = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guia.titulo,
    description: guia.meta.descricao,
    image: m.hero ? `${SITE_URL}${m.hero.src}` : `${SITE_URL}/images/logo/full.jpg`,
    datePublished: guia.meta.atualizado,
    dateModified: guia.meta.atualizado,
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
    author: { '@type': 'Person', name: 'André Zimermann' },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
  };

  // Marcacao FAQ so quando as perguntas aparecem na tela (regra do Google) e ha 2 ou mais.
  const faqJson =
    m.faq.length >= 2
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: m.faq.map((f) => ({
            '@type': 'Question',
            name: f.pergunta,
            acceptedAnswer: { '@type': 'Answer', text: textoDe(f.resposta) },
          })),
        }
      : null;

  return (
    <article className={`bp-article lv-pag ${fraunces.variable} ${montserrat.variable}`}>
      <LivroTracker codigo={guia.codigo} slug={guia.slug} />
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Ebooks', path: '/guias' },
          { name: guia.titulo, path },
        ]}
      />
      <JsonLd data={artigo} />
      {faqJson && <JsonLd data={faqJson} />}

      <div className="bp-inner">
        <nav className="bp-trilha" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/guias">Ebooks</Link>
          <span aria-hidden="true">/</span>
          <span>{guia.titulo}</span>
        </nav>

        <header className="lv-hero">
          <div className="lv-hero-texto">
            <span className="lv-selo">{`Livro ${guia.codigo.replace('TG', 'TG ')} · 100% de graça`}</span>
            <h1 className="lv-titulo">{guia.titulo}</h1>
            {m.subtitulo && <p className="lv-subtitulo">{m.subtitulo}</p>}
            <p className="lv-autor">por André Zimermann</p>
            <CartaoBaixar guia={guia} posicao="topo" />
          </div>
          {m.hero && (
            <figure className="lv-foto-abertura">
              <div className="lv-foto-flutua">
                <div className="lv-foto-inclina">
                  <span className="lv-foto-fundo" aria-hidden="true" />
                  <div className="lv-foto-moldura">
                    <Image
                      src={m.hero.src}
                      alt={m.hero.alt}
                      width={m.hero.largura}
                      height={m.hero.altura}
                      sizes="(max-width: 720px) 90vw, 440px"
                      preload
                    />
                    <span className="lv-reflexo" aria-hidden="true" />
                  </div>
                  <span className="lv-pill" aria-hidden="true">
                    100% de graça
                  </span>
                </div>
              </div>
            </figure>
          )}
        </header>

        <nav className="lv-sumario" aria-label="Neste livro">
          <span>Neste livro</span>
          {[...m.secoes.map((x) => ({ id: x.id, t: x.titulo })), ...(m.faq.length ? [{ id: 'faq', t: 'Perguntas frequentes' }] : [])].map((x) => (
            <a key={x.id} href={`#${x.id}`}>
              {x.t}
            </a>
          ))}
        </nav>

        <div className="bp-content">
          {m.carta && (
            <section className="lv-carta" aria-label="Carta do André">
              {m.carta.fotos[0] && (
                <Image
                  className="lv-carta-foto"
                  src={m.carta.fotos[0].src}
                  alt={m.carta.fotos[0].alt}
                  width={160}
                  height={160}
                  sizes="160px"
                />
              )}
              <div>
                <h2>{m.carta.titulo}</h2>
                <Blocos blocos={m.carta.blocos} />
              </div>
            </section>
          )}

          {m.secoes.map((s) => (
            <section key={s.id} id={s.id} className="lv-secao">
              <div className="lv-secao-cabeca">
                {s.rotulo && <p className="lv-eyebrow">{s.rotulo}</p>}
                <h2 className="lv-h2">{s.titulo}</h2>
              </div>
              <Blocos blocos={s.blocos} fotos={s.fotos} />
              {!fotosNosPassos(s.blocos, s.fotos) && <Fotos fotos={s.fotos} />}
            </section>
          ))}

          {m.faq.length > 0 && (
            <section aria-labelledby="faq" className="lv-secao">
              <div className="lv-secao-cabeca">
                <p className="lv-eyebrow">Tire suas dúvidas</p>
                <h2 id="faq" className="lv-h2">
                  Perguntas frequentes
                </h2>
              </div>
              <div className="lv-faq">
                {m.faq.map((f) => (
                  <div key={f.id} id={f.id} className="lv-faq-item">
                    <h3>{f.pergunta}</h3>
                    <Blocos blocos={f.blocos} fotos={f.fotos} />
                    {!fotosNosPassos(f.blocos, f.fotos) && <Fotos fotos={f.fotos} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="lv-final">
            <h2>Leve o livro com você</h2>
            <p>Tudo isso em PDF, para ler no celular ou imprimir. De graça, como toda a coleção.</p>
            <CartaoBaixar guia={guia} posicao="fim" />
            {m.proximo && <p>{m.proximo}</p>}
          </section>

          <ul className="lv-mais" aria-label="Veja também">
            {outros.map((o) => (
              <li key={o.slug}>
                <Link href={`/guias/${o.slug}`}>Se gostou, leia: {o.titulo} →</Link>
              </li>
            ))}
            <li>
              <Link href="/guias">Ver todos os ebooks da coleção →</Link>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
