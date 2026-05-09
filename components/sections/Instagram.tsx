import Link from 'next/link';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/lib/constants';
import { igHome, type IgPost } from '@/data/instagram';
import { fetchInstagramMedia, type IgMedia } from '@/lib/instagram';
import InstagramEmbed from '@/components/ui/InstagramEmbed';
import { IgKindIcon, InstagramOutlineIcon } from '@/components/ui/icons';

const TONES: ReadonlyArray<readonly [string, string]> = [
  ['#11201A', '#4A8C4F'],
  ['#1F2A20', '#74C69D'],
  ['#2A1810', '#E8A33D'],
  ['#1A1F2A', '#4A8C4F'],
  ['#11201A', '#74C69D'],
  ['#2A1810', '#D8552B'],
];

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
          <InstagramOutlineIcon size={20} />
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
                  <IgKindIcon kind={post.kind} />
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
