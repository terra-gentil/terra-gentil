import type { Metadata } from 'next';
import Image from 'next/image';
import { transformations } from '@/data/transformations';
import { YOUTUBE_URL } from '@/lib/constants';
import TransformacoesClient from './TransformacoesClient';

export const metadata: Metadata = {
  title: 'Transformações · Terra Gentil',
  description:
    'Galeria de quintais reais que renasceram. Arrasta o slider pra ver o antes e o depois de cada caso.',
};

const HUES = ['#4A8C4F', '#74C69D', '#E8A33D', '#D8552B', '#74C69D', '#4A8C4F'] as const;
const CITIES = [
  'São Paulo, SP',
  'Recife, PE',
  'Atibaia, SP',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Porto Alegre, RS',
] as const;

export default function TransformacoesPage() {
  const cases = transformations.map((t, i) => ({
    id: t.id,
    label: t.title,
    description: t.description ?? '',
    before: t.beforeImage,
    after: t.afterImage,
    city: CITIES[i] ?? CITIES[0],
    duration: i % 3 === 0 ? '1 dia' : i % 3 === 1 ? '2 fins de semana' : '3 dias',
    hue: HUES[i % HUES.length],
  }));

  return (
    <>
      <section className="tp-hero">
        <div className="tp-hero-inner">
          <div className="tp-hero-eyebrow">Galeria · {cases.length} transformações</div>
          <h1 className="tp-hero-title">
            Quintais que <em>renasceram</em>.
          </h1>
          <p className="tp-hero-sub">
            Cada antes e depois é um final de semana de trabalho gentil. Arrasta a alça pra ver a virada de cada quintal real.
          </p>
          <Image
            className="tp-logo-mark tp-logo-mark--below"
            src="/images/logo/full.jpg"
            alt="Terra Gentil"
            width={132}
            height={132}
          />
        </div>
      </section>

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      <TransformacoesClient cases={cases} youtubeUrl={YOUTUBE_URL} />

      <section className="tp-rules">
        <div className="tp-rules-inner">
          <Image
            className="tp-rules-mark"
            src="/images/logo/full.jpg"
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
          />
          <div>
            <div className="section-eyebrow" style={{ color: 'var(--amber)' }}>Como a gente trabalha</div>
            <h2 className="tp-rules-title">Sem milagre, sem corte mágico.</h2>
            <ul className="tp-rules-list">
              <li><span>01</span> Visita o quintal antes, escuta a história, mede o sol.</li>
              <li><span>02</span> Capina, poda, adubação. Tudo registrado em tempo real.</li>
              <li><span>03</span> Replantio com espécies que fazem sentido pro clima local.</li>
              <li><span>04</span> Volta um mês depois pra ver como tá indo. Sempre.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
