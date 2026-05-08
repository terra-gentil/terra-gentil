import type { Metadata } from 'next';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/constants';
import { igFull, type IgPost } from '@/data/instagram';
import InstagramEmbed from '@/components/ui/InstagramEmbed';

export const metadata: Metadata = {
  title: 'Instagram · Terra Gentil',
  description: 'Feed completo do Terra Gentil no Instagram: bastidor, dicas rápidas, planta do dia, comunidade.',
};

const TONES: ReadonlyArray<readonly [string, string]> = [
  ['#11201A', '#4A8C4F'],
  ['#1F2A20', '#74C69D'],
  ['#2A1810', '#E8A33D'],
  ['#1A1F2A', '#4A8C4F'],
  ['#11201A', '#74C69D'],
  ['#2A1810', '#D8552B'],
  ['#1F2A20', '#E8A33D'],
  ['#11201A', '#4A8C4F'],
  ['#2A1810', '#74C69D'],
  ['#1A1F2A', '#E8A33D'],
  ['#11201A', '#D8552B'],
  ['#2A1810', '#74C69D'],
];

function IgIcon({ kind }: { kind: IgPost['kind'] }) {
  if (kind === 'reel') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="10,8 16,12 10,16" fill="currentColor" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </svg>
    );
  }
  if (kind === 'carousel') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="7" y="3" width="14" height="14" rx="2" />
        <path d="M3 7v12a2 2 0 0 0 2 2h12" />
      </svg>
    );
  }
  return null;
}

export default function InstagramPage() {
  return (
    <section id="instagram" className="ig" style={{ paddingTop: 140 }}>
      <div className="ig-head">
        <div>
          <div className="section-eyebrow">Feed completo</div>
          <h2 className="section-title">
            No <span className="ital">Instagram</span>
          </h2>
        </div>
        <a className="ig-handle" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          <span>{INSTAGRAM_HANDLE}</span>
          <span className="ig-arrow">↗</span>
        </a>
      </div>
      <div className="ig-grid ig-grid-feed">
        {igFull.map((p, i) => {
          const tone = TONES[i % TONES.length];
          if (p.shortcode) {
            return (
              <div
                key={i}
                className="ig-tile ig-tile-embed"
                style={{ '--ig-bg': tone[0], '--ig-fg': tone[1] } as React.CSSProperties}
              >
                <InstagramEmbed shortcode={p.shortcode} caption={p.title} withCaption />
              </div>
            );
          }
          return (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="ig-tile"
              style={{ '--ig-bg': tone[0], '--ig-fg': tone[1] } as React.CSSProperties}
            >
              <div className="ig-placeholder">
                <div className="ig-pattern" />
                <div className="ig-kind">
                  <IgIcon kind={p.kind} />
                  <span>{p.kind}</span>
                </div>
                <div className="ig-meta">
                  <div className="ig-tag">#{p.tag}</div>
                  <div className="ig-title">{p.title}</div>
                </div>
                <div className="ig-hover">
                  <span>Ver no Instagram</span>
                  <span>↗</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      <div className="ig-foot">
        <p>
          Quer mostrar seu jardim? Marca <strong>{INSTAGRAM_HANDLE}</strong>. Repostamos os melhores toda semana.
        </p>
      </div>
    </section>
  );
}
