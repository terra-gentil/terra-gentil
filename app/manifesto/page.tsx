import type { Metadata } from 'next';
import Image from 'next/image';
import { whatsappLink, YOUTUBE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Manifesto · Terra Gentil',
  description:
    'A Terra Gentil não é um canal de jardinagem. É um canal de histórias humanas contadas por trás de quintais transformados. Tudo de graça, desde 2022.',
};

const MF_ACTS = [
  {
    num: '01',
    kicker: 'A história',
    title: 'Como tudo começou.',
    body:
      'Em 2022, André começou a filmar quintais que ninguém mais ia mexer. Casas de idosos, calçadas tomadas pelo mato, terrenos abandonados que viraram problema da rua. Cortou, capinou, plantou — sem cobrar, sem pedir nada em troca. A primeira pessoa que viu o resultado se emocionou. O canal começou ali. Não era pra ser sobre jardinagem. Era pra ser sobre gente.',
    mascot: '/images/mascot/trimmer.webp',
    hue: '#4A8C4F',
  },
  {
    num: '02',
    kicker: 'A transformação',
    title: 'O que acontece num vídeo da Terra Gentil.',
    body:
      'Um quintal esquecido. Uma pessoa cansada — viúva, idosa, deficiente, doente. André chega, escuta a história, e trabalha. Cada vídeo mostra a transformação inteira, sem corte mágico: o mato alto, o suor, a chuva, o cansaço. E no fim, o jardim entregue, e a reação. Esse é o ponto. A planta é o pretexto. O encontro é o que fica.',
    mascot: '/images/mascot/shovel.webp',
    hue: '#E8A33D',
  },
  {
    num: '03',
    kicker: 'A escola',
    title: 'O conhecimento também é gentileza.',
    body:
      '18 ebooks gratuitos sobre as plantas mais comuns do Brasil. Blog com guias práticos. Lives no YouTube respondendo dúvida de quem mandou foto da planta morrendo no DM. E o Doutor das Plantas, uma IA que olha a foto da sua folha amarela e devolve, em segundos, o que tá acontecendo, o que fazer e qual ebook combina. Tudo grátis, sempre. Plantar não pode ser privilégio.',
    mascot: '/images/mascot/laptop.webp',
    hue: '#74C69D',
  },
  {
    num: '04',
    kicker: 'A comunidade',
    title: 'Gentileza gera gentileza.',
    body:
      'Não é bordão. É o que a gente vê acontecer: vizinho que traz churrasco no meio da gravação, pedreiro que sugere o jardim de um tio, senhora que chama a Terra Gentil de "marciana" porque não acredita que é de graça. O canal cresce porque a bondade é contagiosa. A gente só precisa começar — o resto vem sozinho.',
    mascot: '/images/mascot/blower.webp',
    hue: '#D8552B',
  },
] as const;

const MF_PRINCIPLES = [
  {
    t: 'Gratuidade',
    d: 'Tudo aqui é de graça. O vídeo, o ebook, o diagnóstico, a transformação. Sempre. Plantar não devia custar.',
  },
  {
    t: 'Os esquecidos primeiro',
    d: 'Idosos, viúvos, deficientes, gente que não aguenta mais o quintal sozinho. A fila da Terra Gentil respeita quem mais precisa.',
  },
  {
    t: 'A história importa mais que a planta',
    d: 'Cada vídeo começa pela conversa. A planta vai pra terra depois que a gente entende quem ela é. Sem essa ordem, vira só jardinagem bonita. Com ela, vira Terra Gentil.',
  },
  {
    t: 'Gentileza gera gentileza',
    d: 'Não é o nome bonito do canal. É o efeito real: cada transformação convida a próxima. A bondade circula sozinha, a gente só precisa não atrapalhar.',
  },
] as const;

const MF_QUOTES = [
  { text: 'Você não é marciano?', cite: 'Dona Cristina, antes da transformação' },
  { text: 'Lindo de morrer.', cite: 'vizinha durante a gravação' },
  { text: 'Presente de natal.', cite: 'beneficiada após o jardim ficar pronto' },
  { text: 'Abençoo vocês.', cite: 'mensagem após a entrega' },
] as const;

const SUGGEST_MESSAGE =
  'Olá! Conheço um quintal abandonado de alguém que precisa de ajuda. Posso indicar pra Terra Gentil?';

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
            A Terra Gentil não é um canal de jardinagem. É um canal de histórias humanas contadas por trás de quintais
            transformados. Tudo de graça, desde 2022. Esse é o manifesto que guia o canal, o app, o Doutor das Plantas e
            cada quintal que ainda vai virar jardim.
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

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

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

      <section className="jg-features" style={{ paddingTop: 0 }}>
        <div className="jg-inner">
          <h2 className="dr-section-title">
            O que <span className="ital">dizem</span>.
          </h2>
          <div className="jg-feat-grid">
            {MF_QUOTES.map((q) => (
              <figure key={q.text} className="jg-feat" style={{ margin: 0 }}>
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-serif), serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(20px, 2.4vw, 28px)',
                    lineHeight: 1.25,
                    color: 'var(--ink, #0B1410)',
                  }}
                >
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="jg-feat-d" style={{ marginTop: 8 }}>
                  — {q.cite}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="page-cta">
        <h2>
          Conhece um <span className="ital">quintal</span> que precisa?
        </h2>
        <p>
          A Terra Gentil cresce com indicação. Se você sabe de um espaço esquecido — de alguém idoso, doente, sozinho —
          conta pra gente. Ou comece assistindo uma transformação completa esse fim de semana.
        </p>
        <div className="hero-cta-row" style={{ justifyContent: 'center' }}>
          <a
            className="btn-yt"
            href={whatsappLink(SUGGEST_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sugerir um quintal →
          </a>
          <a className="btn-ghost" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            Assistir no YouTube
          </a>
        </div>
      </section>
    </>
  );
}
