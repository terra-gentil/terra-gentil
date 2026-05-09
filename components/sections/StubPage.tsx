import Link from 'next/link';
import { YOUTUBE_URL } from '@/lib/constants';

export interface StubPageProps {
  eyebrow: string;
  title: string;
  titleItal: string;
  sub: string;
  sections: ReadonlyArray<{ t: string; d: string }>;
  bg?: string;
  fg?: string;
  accent?: string;
  showCanal?: boolean;
}

export default function StubPage({
  eyebrow,
  title,
  titleItal,
  sub,
  sections,
  bg = '#0B1410',
  fg = '#F4ECDB',
  accent = '#E8A33D',
  showCanal = true,
}: StubPageProps) {
  return (
    <section className="stub-hero" style={{ background: bg, color: fg }}>
      <div className="stub-inner">
        <div className="stub-eyebrow" style={{ color: accent }}>{eyebrow}</div>
        <h1 className="stub-h1">
          <span>{title}</span> <em>{titleItal}</em>
        </h1>
        <p className="stub-sub">{sub}</p>
        <div className="stub-divider" style={{ background: accent }} />
        <div className="stub-grid">
          {sections.map((s, i) => (
            <div key={i} className="stub-card">
              <div className="stub-card-num" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="stub-card-t">{s.t}</div>
              <div className="stub-card-d">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="stub-cta-row">
          <Link href="/" className="stub-cta primary" style={{ background: accent, color: bg }}>
            ← Voltar pra home
          </Link>
          {showCanal && (
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="stub-cta ghost"
              style={{ borderColor: accent, color: accent }}
            >
              Inscrever no canal
            </a>
          )}
        </div>
        <div className="stub-note">Página em construção · Mais conteúdo em breve.</div>
      </div>
    </section>
  );
}
