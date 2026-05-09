import type { Metadata } from 'next';
import Image from 'next/image';
import { YOUTUBE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Manifesto · Terra Gentil',
  description:
    'Quatro atos, um jardim. Tudo começa com terra e atenção. A filosofia que guia a Terra Gentil desde 2022: cuidado, escola e comunidade.',
};

const MF_ACTS = [
  {
    num: '01',
    kicker: 'A história',
    title: 'Tudo começa com terra e atenção.',
    body:
      'André pega o cortador, o ancinho e a paciência. Antes de plantar nada, ele escuta o quintal. Que sol bate ali? Onde a chuva empoça? Que mato veio sozinho? A gentileza é técnica.',
    mascot: '/images/mascot/trimmer.webp',
    hue: '#4A8C4F',
  },
  {
    num: '02',
    kicker: 'A transformação',
    title: 'Mato vira jardim, suor vira beleza.',
    body:
      'Capina, poda, adubação, replantio. Cada vídeo é uma transformação completa de um quintal real. Sem milagre, sem corte mágico, só cuidado em tempo real, do antes pro depois.',
    mascot: '/images/mascot/shovel.webp',
    hue: '#E8A33D',
  },
  {
    num: '03',
    kicker: 'A escola',
    title: 'Você aprende junto.',
    body:
      '12 ebooks gratuitos, blog com guias, lives no YouTube e o Doutor das Plantas, uma IA que olha a foto da sua planta e devolve diagnóstico, plano de rega e ebook combinado.',
    mascot: '/images/mascot/laptop.webp',
    hue: '#74C69D',
  },
  {
    num: '04',
    kicker: 'A comunidade',
    title: 'Acabou? Não. Limpamos o resto.',
    body:
      'O sopro final pra deixar tudo no lugar. WhatsApp aberto, Instagram com bastidor, TikTok com dicas curtas. Se a sua planta tá mal, você não tá sozinho. Manda foto.',
    mascot: '/images/mascot/blower.webp',
    hue: '#D8552B',
  },
] as const;

const MF_PRINCIPLES = [
  {
    t: 'Toda planta merece um diagnóstico',
    d: 'Não jogue fora antes de entender. Plantas falam, só precisamos aprender a escutar.',
  },
  {
    t: 'Quintal é jardim',
    d: 'Não importa se é 4m² ou 400m². Espaço esquecido pode virar espaço vivo.',
  },
  {
    t: 'Conhecimento é grátis',
    d: 'Tudo que ensinamos no canal, no app e nos ebooks: zero pago. Sempre.',
  },
  {
    t: 'A comunidade é o sol',
    d: 'Sem vocês, nada disso cresce. Cada like, comentário e foto plantada conta.',
  },
] as const;

export default function ManifestoPage() {
  return (
    <>
      <section className="tp-hero">
        <div className="tp-hero-inner">
          <div className="tp-hero-eyebrow">A filosofia · desde 2022</div>
          <h1 className="tp-hero-title">
            Quatro <em>atos,</em>
            <br />
            um jardim.
          </h1>
          <p className="tp-hero-sub">
            A Terra Gentil acredita que jardinagem é cuidado, escola e comunidade. Esse é o manifesto que guia tudo: do
            vídeo ao Doutor.
          </p>
          <Image
            className="tp-logo-mark tp-logo-mark--below"
            src="/images/logo/full.jpg"
            alt="Terra Gentil"
            width={132}
            height={132}
            priority
          />
        </div>
      </section>

      <section className="manifesto-flow" style={{ paddingTop: 60 }}>
        <div className="manifesto-grid">
          {MF_ACTS.map((a) => (
            <div
              key={a.num}
              className="manifesto-row"
              style={{ '--row-bg': `${a.hue}33` } as React.CSSProperties}
            >
              <div className="manifesto-row-text">
                <div className="sticky-eyebrow">
                  <span className="num">
                    {a.num} · {a.kicker}
                  </span>
                </div>
                <h3 className="manifesto-row-title">{a.title}</h3>
                <p className="manifesto-row-body">{a.body}</p>
              </div>
              <div className="manifesto-row-visual">
                <Image src={a.mascot} alt="" width={400} height={400} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="jg-features">
        <div className="jg-inner">
          <h2 className="dr-section-title">
            Quatro <span className="ital">princípios</span>.
          </h2>
          <div className="jg-feat-grid">
            {MF_PRINCIPLES.map((p, i) => (
              <div key={p.t} className="jg-feat">
                <div
                  className="jg-feat-ico"
                  style={{
                    color: 'var(--amber)',
                    fontFamily: 'var(--font-mono, JetBrains Mono), monospace',
                    fontSize: 16,
                    letterSpacing: '0.1em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="jg-feat-t">{p.t}</div>
                <div className="jg-feat-d">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-cta">
        <h2>
          Comece pelo <span className="ital">primeiro</span> ato.
        </h2>
        <p>Inscreva-se no canal e assista uma transformação completa esse fim de semana.</p>
        <a className="btn-yt" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          Ir pro YouTube →
        </a>
      </section>
    </>
  );
}
