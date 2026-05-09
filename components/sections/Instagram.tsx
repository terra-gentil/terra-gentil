import Link from 'next/link';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/lib/constants';
import { igHome, type IgPost } from '@/data/instagram';
import { fetchInstagramMedia, type IgMedia } from '@/lib/instagram';
import InstagramEmbed from '@/components/ui/InstagramEmbed';

const TONES: ReadonlyArray<readonly [string, string]> = [
  ['#11201A', '#4A8C4F'],
  ['#1F2A20', '#74C69D'],
  ['#2A1810', '#E8A33D'],
  ['#1A1F2A', '#4A8C4F'],
  ['#11201A', '#74C69D'],
  ['#2A1810', '#D8552B'],
];

function IgIcon({ kind }: { kind: 'reel' | 'photo' | 'carousel' }) {
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
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default async function Instagram() {
  const live = await fetchInstagramMedia(3);
  const items: Array<IgMedia | IgPost> = live.length > 0 ? live : igHome.slice(0, 3);

  return (
    <section id="instagram" className="ig">
      <div className="ig-head">
        <div>
          <div className="section-eyebrow">Bastidor</div>
          <h2 className="section-title">
            No <span className="ital">Instagram</span>
          </h2>
        </div>
        <a className="ig-handle" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
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
        {items.map((p, i) => {
          const tone = TONES[i % TONES.length];
          // post real (lib/instagram)
          if ('shortcode' in p && p.shortcode) {
            const isLive = 'permalink' in p;
            const caption = isLive ? (p as IgMedia).caption : (p as IgPost).title;
            return (
              <div
                key={isLive ? (p as IgMedia).id : i}
                className="ig-tile ig-tile-embed"
                style={{ '--ig-bg': tone[0], '--ig-fg': tone[1] } as React.CSSProperties}
              >
                <InstagramEmbed shortcode={p.shortcode} caption={caption} />
              </div>
            );
          }
          // placeholder (data/instagram fallback)
          const post = p as IgPost;
          return (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-tile"
              style={{ '--ig-bg': tone[0], '--ig-fg': tone[1] } as React.CSSProperties}
            >
              <div className="ig-placeholder">
                <div className="ig-pattern" />
                <div className="ig-kind">
                  <IgIcon kind={post.kind} />
                  <span>{post.kind}</span>
                </div>
                <div className="ig-meta">
                  <div className="ig-tag">#{post.tag}</div>
                  <div className="ig-title">{post.title}</div>
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
      <div className="see-more-row">
        <Link className="see-more dark" href="/instagram">
          Ver feed completo →
        </Link>
      </div>
    </section>
  );
}
