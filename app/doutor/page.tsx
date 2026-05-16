import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PageHero from '@/components/sections/PageHero';
import DoutorFaq from './DoutorFaq';

const PlantDoctor = dynamic(() => import('@/components/sections/PlantDoctor'), {
  loading: () => <div className="pd-card" style={{ minHeight: 480 }}><div className="pd-loading-msg">Carregando...</div></div>,
});

const DoctorScanner = dynamic(() => import('@/components/sections/DoctorScanner'), {
  loading: () => <div className="scan-stage" style={{ aspectRatio: '16 / 9' }} />,
});

export const metadata: Metadata = {
  title: 'Doutor das Plantas · Terra Gentil',
  description: 'Diagnóstico de planta por foto, com IA, em segundos. Identificação, plano de rega, ebook combinado. 100% grátis.',
};

const STEPS = [
  { num: 'PASSO 01', icon: '📷', title: 'Manda a foto', desc: 'Tira uma foto da folha, do caule ou do vaso inteiro. Quanto mais luz natural, melhor. Pode mandar várias.' },
  { num: 'PASSO 02', icon: '🌱', title: 'Conta o contexto', desc: 'Quanto tempo você tem ela? Onde fica (sol, sombra, varanda)? Com que frequência rega? Mudou alguma coisa recente?' },
  { num: 'PASSO 03', icon: '🔍', title: 'A IA lê tudo', desc: 'Identifica a espécie, cruza os sintomas com o histórico de problemas comuns, e devolve diagnóstico em segundos.' },
  { num: 'PASSO 04', icon: '📋', title: 'Plano completo', desc: 'Diagnóstico, ação imediata, plano de rega, ebook combinado e vídeos do canal sobre o caso. Tudo grátis.' },
] as const;

export default function DoutorPage() {
  return (
    <>
      <PageHero
        eyebrow="Diagnóstico por IA · 100% grátis"
        title={
          <>
            Sua planta
            <br />
            <span className="ital">conversando</span> com você.
          </>
        }
        sub="Manda foto da folha amarela, do caule mole, do bicho estranho. Em segundos, o Doutor das Plantas diz o que tá acontecendo, o que fazer, e ainda manda o ebook e o vídeo do canal sobre o assunto."
        mascot="/images/mascot/laptop.webp"
        mascotAlt="Brotinho com laptop"
      />

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      <section className="dr-scanner">
        <div className="dr-scanner-inner">
          <div className="section-eyebrow" style={{ color: 'var(--amber)' }}>Veja a IA em ação · 11 segundos</div>
          <h2 className="dr-section-title" style={{ marginBottom: 28 }}>
            O <span className="ital">Doutor</span> em ação.
          </h2>
          <DoctorScanner />
        </div>
      </section>

      <section className="dr-steps">
        <div className="dr-steps-inner">
          <h2 className="dr-section-title">
            Como <span className="ital">funciona</span> em 4 passos.
          </h2>
          <div className="dr-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="dr-step">
                <div className="step-num">{s.num}</div>
                <div className="step-icon" aria-hidden="true">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dr-demo">
        <div className="dr-demo-inner">
          <div>
            <h2 className="dr-section-title" style={{ color: 'var(--paper)' }}>
              Diagnostique <span className="ital" style={{ color: 'var(--amber)' }}>agora</span>.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.78, maxWidth: 480 }}>
              Não é receita pronta de internet. Cada resposta é montada pra sua planta, sua casa, seu clima. Vem com o
              porquê, com o passo a passo e com o material de estudo se você quiser ir mais fundo.
            </p>
          </div>
          <PlantDoctor variant="full" />
        </div>
      </section>

      <DoutorFaq />

      <section className="page-cta">
        <h2>
          Pronto pra <span className="ital">conversar</span> com sua planta?
        </h2>
        <p>Manda a foto, conta o contexto, recebe o plano. Em menos de um minuto.</p>
        <a className="btn-yt" href="#main" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          Subir e diagnosticar →
        </a>
      </section>
    </>
  );
}
