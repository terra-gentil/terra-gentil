import Link from 'next/link';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/lib/constants';
import { igHome } from '@/data/instagram';
import { fetchInstagramMedia } from '@/lib/instagram';
import { InstagramOutlineIcon } from '@/components/ui/icons';
import InstagramTile from '@/components/sections/instagram/InstagramTile';
import { tilesFromMedia, tilesFromFallback } from '@/components/sections/instagram/data';

export default async function Instagram() {
  const live = await fetchInstagramMedia(6);
  const tiles =
    live.length > 0
      ? tilesFromMedia(live).slice(0, 6)
      : tilesFromFallback(igHome).slice(0, 6);

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

      <div className="igx-home-grid">
        {tiles.map((tile, i) => (
          <InstagramTile key={tile.key} tile={tile} idx={i} />
        ))}
      </div>

      <div className="ig-foot">
        <p>
          Quer mostrar seu jardim? Marca <strong>{INSTAGRAM_HANDLE}</strong>. Repostamos os melhores
          toda semana.
        </p>
      </div>
      <div className="see-more-row">
        <Link className="see-more dark" href="/instagram#conteudo">
          Ver feed completo →
        </Link>
      </div>
    </section>
  );
}
