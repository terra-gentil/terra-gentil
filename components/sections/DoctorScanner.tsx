'use client';

import { useEffect, useRef, useState } from 'react';

const PHASES = {
  intro: [0, 1.6],
  scan: [1.6, 3.6],
  think: [3.6, 5.2],
  result: [5.2, 7.4],
  plan: [7.4, 9.4],
  ebook: [9.4, 11.0],
} as const;

const LOOP_DURATION = 11.0;

type PhaseKey = keyof typeof PHASES;

const ACTS: Array<{ key: PhaseKey; src: string; focus: string }> = [
  { key: 'intro', src: '/images/mascot/pose-4.jpg', focus: '50% 60%' },
  { key: 'scan', src: '/images/mascot/pose-3.jpg', focus: '50% 55%' },
  { key: 'think', src: '/images/mascot/pose-2.jpg', focus: '52% 55%' },
  { key: 'result', src: '/images/mascot/pose-5.jpg', focus: '50% 55%' },
  { key: 'plan', src: '/images/mascot/pose-7.jpg', focus: '50% 60%' },
  { key: 'ebook', src: '/images/mascot/pose-1.jpg', focus: '50% 55%' },
];

interface Example {
  name: string;
  problem: string;
  severity: string;
  sevColor: string;
  plan: [string, string, string];
  ebook: string;
}

const EXAMPLES: Example[] = [
  {
    name: 'Tomateiro',
    problem: 'Pinta-preta (Alternaria)',
    severity: 'Moderado',
    sevColor: '#E8A33D',
    plan: [
      'Remover folhas com manchas escuras',
      'Borrifar bicarbonato + sabão neutro',
      'Reaplicar a cada 5 dias',
    ],
    ebook: 'Pragas e fungos no jardim',
  },
  {
    name: 'Pothos',
    problem: 'Excesso de rega · raízes encharcadas',
    severity: 'Leve',
    sevColor: '#74C69D',
    plan: [
      'Suspender rega imediatamente',
      'Trocar substrato em 2 dias',
      'Voltar a regar só quando seco',
    ],
    ebook: 'Plantas de interior 101',
  },
  {
    name: 'Manjericão',
    problem: 'Pulgão na face inferior das folhas',
    severity: 'Atenção',
    sevColor: '#D8552B',
    plan: [
      'Banho de água + detergente neutro',
      'Inspecionar brotos novos amanhã',
      'Calêndula plantada por perto repele',
    ],
    ebook: 'Horta orgânica em casa',
  },
];

const inPhase = (t: number, name: PhaseKey) => t >= PHASES[name][0] && t < PHASES[name][1];

const phaseProgress = (t: number, name: PhaseKey) => {
  const [a, b] = PHASES[name];
  if (t < a) return 0;
  if (t > b) return 1;
  return (t - a) / (b - a);
};

const opacityFor = (t: number, name: PhaseKey, fade = 0.45) => {
  const [a, b] = PHASES[name];
  if (t >= a - fade && t < a) return (t - (a - fade)) / fade;
  if (t >= a && t <= b) return 1;
  if (t > b && t < b + fade) return 1 - (t - b) / fade;
  return 0;
};

interface DoctorScannerProps {
  compact?: boolean;
}

export default function DoctorScanner({ compact = false }: DoctorScannerProps) {
  const [t, setT] = useState(0);
  const [exampleIdx, setExampleIdx] = useState(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const tick = (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setT((curr) => {
        const next = (curr + dt) % LOOP_DURATION;
        if (curr > LOOP_DURATION - 1.5 && next < 1) {
          setExampleIdx((i) => (i + 1) % EXAMPLES.length);
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, []);

  const example = EXAMPLES[exampleIdx];
  const scanP = phaseProgress(t, 'scan');
  const resultP = phaseProgress(t, 'result');
  const planP = phaseProgress(t, 'plan');
  const ebookP = phaseProgress(t, 'ebook');

  const showScanner = inPhase(t, 'scan');
  const showThink = inPhase(t, 'think');
  const showResult = t >= PHASES.result[0];
  const showPlan = t >= PHASES.plan[0];
  const showEbook = t >= PHASES.ebook[0];

  let statusLabel = 'PRONTO';
  let statusTone: 'idle' | 'scan' | 'alert' | 'ok' = 'idle';
  if (inPhase(t, 'intro')) {
    statusLabel = 'CÂMERA · INICIANDO';
    statusTone = 'idle';
  } else if (inPhase(t, 'scan')) {
    statusLabel = 'ESCANEANDO PLANTA';
    statusTone = 'scan';
  } else if (inPhase(t, 'think')) {
    statusLabel = 'IA ANALISANDO · · ·';
    statusTone = 'scan';
  } else if (inPhase(t, 'result')) {
    statusLabel = 'DIAGNÓSTICO PRONTO';
    statusTone = 'alert';
  } else if (inPhase(t, 'plan')) {
    statusLabel = 'PLANO DE AÇÃO';
    statusTone = 'ok';
  } else if (inPhase(t, 'ebook')) {
    statusLabel = 'EBOOK ENVIADO';
    statusTone = 'ok';
  }

  return (
    <div className={`scan-stage scan-stage--photo${compact ? ' compact' : ''}`}>
      {/* Pilha de fotos com crossfade */}
      <div className="ss-photos">
        {ACTS.map((act) => {
          const op = opacityFor(t, act.key);
          return (
            <div
              key={act.key}
              className="ss-photo"
              style={{
                opacity: op,
                backgroundImage: `url(${act.src})`,
                backgroundPosition: act.focus,
                transform: `scale(${1.02 + op * 0.02})`,
              }}
              aria-hidden="true"
            />
          );
        })}
        <div className="ss-vignette" />
      </div>

      {/* Cantos viewfinder */}
      <div className="ss-vf" aria-hidden="true">
        <span className="vf-c tl" />
        <span className="vf-c tr" />
        <span className="vf-c bl" />
        <span className="vf-c br" />
      </div>

      {/* HUD topo */}
      <div className="hud-top">
        <div className="hud-brand">
          <span className="hud-mark">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M12 2c-2 6-6 8-6 12a6 6 0 0 0 12 0c0-4-4-6-6-12Z" />
            </svg>
          </span>
          <span className="hud-brand-name">Doutor Gentileza</span>
        </div>
        <div className={`hud-chip hud-chip--${statusTone}`}>
          <span className="hud-dot" />
          {statusLabel}
        </div>
      </div>

      {/* Linha do scanner */}
      {showScanner && (
        <>
          <div className="ss-scanline" style={{ top: `${15 + scanP * 70}%` }} />
          <div className="ss-scan-glow" style={{ top: `${15 + scanP * 70}%` }} />
        </>
      )}

      {/* Pílula "Analisando" */}
      {showThink && (
        <div className="ss-think">
          <div className="th-pill">
            <span className="brain">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M12 2a4 4 0 0 0-4 4 3 3 0 0 0-3 3 3 3 0 0 0 1 5v1a3 3 0 0 0 3 3h1v3h2v-3h2v3h2v-3h1a3 3 0 0 0 3-3v-1a3 3 0 0 0 1-5 3 3 0 0 0-3-3 4 4 0 0 0-4-4z" />
              </svg>
            </span>
            Analisando padrões na folha
            <span className="dots"><i /><i /><i /></span>
          </div>
        </div>
      )}

      {/* Card de diagnóstico */}
      {showResult && (
        <div
          className="ss-result"
          style={{
            opacity: Math.min(1, resultP * 3),
            transform: `translateY(${(1 - Math.min(1, resultP * 3)) * 14}px)`,
          }}
        >
          <div className="rs-row">
            <div className="rs-name">{example.name}</div>
            <div className="rs-sev" style={{ background: example.sevColor }}>{example.severity}</div>
          </div>
          <div className="rs-prob">
            <span className="rs-bullet" style={{ background: example.sevColor }} />
            {example.problem}
          </div>
        </div>
      )}

      {/* Pílulas de plano (cascata) */}
      {showPlan && !compact && (
        <div className="ss-plan">
          {(['Hoje', 'Amanhã', 'Esta semana'] as const).map((day, i) => {
            const local = Math.max(0, Math.min(1, (planP - i * 0.18) * 2.5));
            return (
              <div
                key={day}
                className="pl-pill"
                style={{
                  opacity: local,
                  transform: `translateY(${(1 - local) * 14}px)`,
                }}
              >
                <span className="pl-day">{day}</span>
                <span className="pl-act">{example.plan[i]}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Badge ebook */}
      {showEbook && !compact && (
        <div
          className="ss-ebook"
          style={{
            opacity: Math.min(1, ebookP * 2),
            transform: `scale(${0.85 + Math.min(1, ebookP * 2) * 0.15}) rotate(-4deg)`,
          }}
        >
          <span className="eb-tag">EBOOK GRÁTIS</span>
          <span className="eb-title">{example.ebook}</span>
        </div>
      )}
    </div>
  );
}
