import Image from 'next/image';

interface Step {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  mascot: string;
  mascotAlt: string;
  bg: string;
}

const STEPS: Step[] = [
  {
    eyebrow: '01 · A história',
    title: (
      <>
        Tudo começa com <span className="ital">terra</span> e atenção.
      </>
    ),
    body: 'André pega o cortador, o ancinho e a paciência. Antes de plantar nada, ele escuta o quintal. Que sol bate ali? Onde a chuva empoça? Que mato veio sozinho? A gentileza é técnica.',
    mascot: '/images/mascot/trimmer.png',
    mascotAlt: 'Brotinho com cortador de grama',
    bg: 'rgba(74,140,79,0.25)',
  },
  {
    eyebrow: '02 · A transformação',
    title: (
      <>
        Mato vira <span className="ital">jardim</span>, suor vira beleza.
      </>
    ),
    body: 'Capina, poda, adubação, replantio. Cada vídeo é uma transformação completa de um quintal real. Sem milagre, sem corte mágico, só cuidado em tempo real, do antes pro depois.',
    mascot: '/images/mascot/shovel.png',
    mascotAlt: 'Brotinho com pá',
    bg: 'rgba(232,163,61,0.22)',
  },
  {
    eyebrow: '03 · A escola',
    title: (
      <>
        Você aprende <span className="ital">junto.</span>
      </>
    ),
    body: '12 ebooks gratuitos, blog com guias, lives no YouTube e o Doutor das Plantas, uma IA que olha a foto da sua planta e devolve diagnóstico, plano de rega e ebook combinado.',
    mascot: '/images/mascot/laptop.png',
    mascotAlt: 'Brotinho com laptop',
    bg: 'rgba(116,198,157,0.22)',
  },
  {
    eyebrow: '04 · A comunidade',
    title: (
      <>
        Acabou? <span className="ital">Não.</span> Limpamos o resto.
      </>
    ),
    body: 'O sopro final pra deixar tudo no lugar. WhatsApp aberto, Instagram com bastidor, TikTok com dicas curtas. Se a sua planta tá mal, você não tá sozinho. Manda foto.',
    mascot: '/images/mascot/blower.png',
    mascotAlt: 'Brotinho com soprador',
    bg: 'rgba(216,85,43,0.22)',
  },
];

const ORN_COLORS = ['#4A8C4F', '#E8A33D', '#74C69D', '#D8552B'] as const;

function ManifestoOrnament({ i }: { i: number }) {
  const c = ORN_COLORS[i % ORN_COLORS.length];
  return (
    <svg className="orn" viewBox="0 0 400 400" aria-hidden="true">
      <circle
        className="orn-ring"
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke={c}
        strokeWidth="1.2"
        strokeDasharray="2 8"
        opacity="0.45"
      />
      <circle
        className="orn-ring orn-ring-2"
        cx="200"
        cy="200"
        r="180"
        fill="none"
        stroke={c}
        strokeWidth="1"
        strokeDasharray="1 10"
        opacity="0.3"
      />
      {Array.from({ length: 7 }).map((_, k) => {
        const angle = (k / 7) * Math.PI * 2;
        const r = 130 + (k % 3) * 22;
        const cx = 200 + Math.cos(angle) * r;
        const cy = 200 + Math.sin(angle) * r;
        return (
          <g
            key={k}
            className={`orn-leaf orn-leaf-${k}`}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <path
              d={`M ${cx} ${cy} q 8 -14 22 -10 q -4 14 -22 10 z`}
              fill={c}
              opacity={0.28 + (k % 3) * 0.1}
            />
          </g>
        );
      })}
      <g className="orn-sprouts" opacity="0.5">
        {[60, 120, 200, 280, 340].map((x, k) => (
          <g key={k} className={`orn-sprout orn-sprout-${k}`} style={{ transformOrigin: `${x}px 380px` }}>
            <path d={`M ${x} 380 Q ${x} 360 ${x} 340`} stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx={x - 6} cy="350" rx="6" ry="3" fill={c} opacity="0.7" transform={`rotate(-30 ${x - 6} 350)`} />
            <ellipse cx={x + 6} cy="345" rx="6" ry="3" fill={c} opacity="0.7" transform={`rotate(30 ${x + 6} 345)`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Manifesto() {
  return (
    <section id="manifesto" className="manifesto-flow">
      <div className="manifesto-head">
        <div className="section-eyebrow">Manifesto</div>
        <h2 className="section-title">
          Quatro <span className="ital">atos</span>, um jardim.
        </h2>
      </div>
      <div className="manifesto-grid">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="manifesto-row"
            style={{ '--row-bg': s.bg } as React.CSSProperties}
          >
            <div className="manifesto-row-text">
              <div className="section-eyebrow" style={{ color: '#C48226' }}>
                {s.eyebrow}
              </div>
              <h3 className="manifesto-row-title">{s.title}</h3>
              <p className="manifesto-row-body">{s.body}</p>
            </div>
            <div className="manifesto-row-visual">
              <ManifestoOrnament i={i} />
              <Image src={s.mascot} alt={s.mascotAlt} width={280} height={350} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
