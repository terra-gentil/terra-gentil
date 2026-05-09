'use client';

import { useState } from 'react';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';

interface Case {
  id: string;
  label: string;
  description: string;
  before: string;
  after: string;
  city: string;
  duration: string;
  hue: string;
}

interface Props {
  cases: Case[];
  youtubeUrl: string;
}

export default function TransformacoesClient({ cases, youtubeUrl }: Props) {
  const [active, setActive] = useState(0);
  const c = cases[active];
  if (!c) {
    return (
      <section className="tp-stage">
        <div className="tp-stage-inner">
          <p style={{ opacity: 0.7 }}>Sem casos publicados ainda. Em breve.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="tp-stage">
        <div className="tp-stage-inner">
          <div className="tp-meta-row">
            <div>
              <div className="tp-meta-eyebrow">
                Caso {String(active + 1).padStart(2, '0')} · {c.city}
              </div>
              <h2 className="tp-meta-title">{c.label}</h2>
            </div>
            <div>
              <div
                className="tp-meta-pill"
                style={{ '--hue': c.hue } as React.CSSProperties}
              >
                tempo de obra · {c.duration}
              </div>
            </div>
          </div>

          <BeforeAfterSlider key={c.id} before={c.before} after={c.after} alt={c.label} />

          <div className="tp-cta">
            <div className="tp-cta-text">
              {c.description || 'Quer ver tudo? Esse caso virou um vídeo de 20+ minutos no canal.'}
            </div>
            <a className="tp-cta-btn" href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              Assistir no YouTube →
            </a>
          </div>
        </div>
      </section>

      <section className="tp-picker">
        <div className="tp-picker-inner">
          <div className="tp-picker-head">
            <div className="section-eyebrow">Selecione outro caso</div>
            <h2 className="tp-picker-title">
              {cases.length} transformações <em>nesta página</em>.
            </h2>
          </div>
          <div className="tp-picker-grid">
            {cases.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`tp-card ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                style={{ '--hue': t.hue } as React.CSSProperties}
                aria-pressed={i === active}
              >
                <div className="tp-card-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="tp-card-mini-ba">
                  <div className="mini-before" />
                  <div className="mini-after" />
                  <div className="mini-handle" />
                </div>
                <div className="tp-card-body">
                  <div className="tp-card-city">{t.city}</div>
                  <div className="tp-card-label">{t.label}</div>
                  <div className="tp-card-dur">{t.duration}</div>
                </div>
                {i === active && <div className="tp-card-active-tag">vendo agora</div>}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
