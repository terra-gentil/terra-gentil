import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'App · Terra Gentil',
  description:
    'Diagnóstico por foto, plano de rega, biblioteca de espécies brasileiras e comunidade. Tudo grátis, no seu bolso. Em desenvolvimento, lança em 2026.',
};

const APP_FT = [
  { ico: '📷', t: 'Diagnóstico por foto', d: 'Aponta a câmera, Gemini identifica espécie e doença em segundos.' },
  { ico: '💧', t: 'Plano de rega', d: 'Lembretes baseados na sua planta, sua casa e o clima da semana.' },
  { ico: '📚', t: 'Biblioteca', d: '600+ espécies brasileiras com fichas escritas pelo André.' },
  { ico: '👥', t: 'Comunidade', d: 'Mostre seu jardim, peça ajuda, conheça outros jardineiros.' },
  { ico: '🔔', t: 'Lembretes', d: 'Notificação pra regar, podar e adubar na hora certa.' },
  { ico: '🆓', t: '100% grátis', d: 'Sem cartão, sem trial, sem anúncio. Pra sempre.' },
] as const;

export default function AppPage() {
  return (
    <>
      <section className="jg-hero">
        <div className="jg-hero-grid">
          <div>
            <div className="page-hero-eyebrow">Em desenvolvimento · 2026</div>
            <h1 className="page-hero-title">
              O <span className="ital">app</span> completo.
            </h1>
            <p className="page-hero-sub">
              Diagnóstico por foto, plano de rega, biblioteca de espécies brasileiras e comunidade. Tudo grátis, no seu
              bolso.
            </p>
            <div className="jg-cta-row">
              <a className="btn-yt" href="#beta">Avise quando lançar →</a>
              <Link className="jg-cta-ghost" href="/doutor">Usar o Doutor agora</Link>
            </div>
          </div>
          <Image
            className="page-hero-mascot"
            src="/images/mascot/laptop.webp"
            alt=""
            width={480}
            height={480}
            priority
          />
        </div>
      </section>

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      <section className="jg-features">
        <div className="jg-inner">
          <h2 className="dr-section-title">
            O que <span className="ital">vem</span> dentro.
          </h2>
          <div className="jg-feat-grid">
            {APP_FT.map((f) => (
              <div key={f.t} className="jg-feat">
                <div className="jg-feat-ico" aria-hidden="true">{f.ico}</div>
                <div className="jg-feat-t">{f.t}</div>
                <div className="jg-feat-d">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beta" className="page-cta">
        <h2>
          Quer ser <span className="ital">avisado</span>?
        </h2>
        <p>Inscreva-se na newsletter na home pra entrar na primeira leva de testes.</p>
        <Link className="btn-yt" href="/#newsletter">Voltar pra home →</Link>
      </section>
    </>
  );
}
