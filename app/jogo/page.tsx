import type { Metadata } from 'next';
import { GAME_ENABLED, GAME_URL, SITE_NAME, YOUTUBE_URL } from '@/lib/constants';
import JogoMockClient from './JogoMockClient';

export const metadata: Metadata = {
  title: `Jogo Gentileza · ${SITE_NAME}`,
  description:
    'Gentileza: Resgate dos Jardins. Plantar, regar, esperar. O jogo do canal Terra Gentil. Sem ranking, sem ganância, sem dinheiro premium.',
  robots: GAME_ENABLED ? undefined : { index: false, follow: false },
};

const FEATURES = [
  { icon: '⏳', t: 'Tempo real', d: 'Suas plantas crescem mesmo com o app fechado. Volta amanhã e vê.' },
  { icon: '🌧️', t: 'Clima de verdade', d: 'Pega a previsão da sua cidade. Choveu? Não precisa regar.' },
  { icon: '🚫', t: 'Sem energia premium', d: 'Sem moeda paga, sem anúncio, sem fila. Só você e o quintal.' },
  { icon: '🎨', t: 'Feito pelo André', d: 'Cada espécie do jogo veio de um vídeo. As ilustrações também.' },
] as const;

const PLANTS = [
  { name: 'Manjericão', stage: '🌱', days: 12, color: '#4A8C4F' },
  { name: 'Suculenta', stage: '🪴', days: 4, color: '#74C69D' },
  { name: 'Tomate', stage: '🍅', days: 28, color: '#D8552B' },
  { name: 'Girassol', stage: '🌻', days: 21, color: '#E8A33D' },
] as const;

export default function JogoPage() {
  const ctaPrimary = GAME_ENABLED
    ? { label: 'Jogar agora →', href: GAME_URL, target: '_blank' as const }
    : { label: 'Entrar no beta →', href: '#beta', target: '_self' as const };

  return (
    <>
      <section className="jg-hero">
        <div className="jg-hero-grid">
          <div>
            <div className="page-hero-eyebrow">
              {GAME_ENABLED ? 'Ao vivo · web · iOS · Android' : 'Em produção · beta em janeiro'}
            </div>
            <h1 className="page-hero-title">
              Plantar, regar, <span className="ital">esperar.</span>
            </h1>
            <p className="page-hero-sub">
              O jogo do canal Terra Gentil. Sem ranking, sem ganância, sem dinheiro premium. Só o tempo da terra, o seu
              cuidado e o que cresce no fim.
            </p>
            <div className="jg-cta-row">
              <a
                className="btn-yt"
                href={ctaPrimary.href}
                {...(ctaPrimary.target === '_blank' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {ctaPrimary.label}
              </a>
              <a className="jg-cta-ghost" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                Ver no canal
              </a>
            </div>
          </div>
          <JogoMockClient />
        </div>
      </section>

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      <section className="jg-features">
        <div className="jg-inner">
          <h2 className="dr-section-title">
            Por que esse <span className="ital">jogo</span>?
          </h2>
          <div className="jg-feat-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="jg-feat">
                <div className="jg-feat-ico" aria-hidden="true">{f.icon}</div>
                <div className="jg-feat-t">{f.t}</div>
                <div className="jg-feat-d">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="jg-catalog">
        <div className="jg-inner">
          <div className="page-hero-eyebrow" style={{ color: 'var(--amber)' }}>Catálogo de plantas</div>
          <h2 className="dr-section-title" style={{ color: 'var(--paper)' }}>
            40+ espécies <span className="ital">brasileiras</span>.
          </h2>
          <p className="jg-catalog-sub">
            Do manjericão da janela ao girassol do quintal. Cada uma com tempo de crescimento real.
          </p>
          <div className="jg-plants">
            {PLANTS.map((p, i) => (
              <div
                key={i}
                className="jg-plant"
                style={{ '--c': p.color } as React.CSSProperties}
              >
                <div className="jg-plant-stage" aria-hidden="true">{p.stage}</div>
                <div className="jg-plant-name">{p.name}</div>
                <div className="jg-plant-days">{p.days} dias até maduro</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beta" className="page-cta">
        <h2>
          {GAME_ENABLED ? (
            <>
              Tá <span className="ital">no ar</span>. Bora jogar?
            </>
          ) : (
            <>
              Quer entrar no <span className="ital">beta</span>?
            </>
          )}
        </h2>
        <p>
          {GAME_ENABLED
            ? 'O jogo roda direto no navegador, sem login. Salvamento local. Sem cobrança.'
            : 'Janeiro de 2026. Primeira leva: 500 jardineiros. Sem custo, sem cartão, sem promessa de ranking.'}
        </p>
        <a
          className="btn-yt"
          href={GAME_ENABLED ? GAME_URL : YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {GAME_ENABLED ? 'Jogar agora →' : 'Inscrever pra avisar →'}
        </a>
      </section>
    </>
  );
}
