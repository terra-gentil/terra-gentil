import Image from 'next/image';
import Link from 'next/link';
import { fetchPlaylistVideos } from '@/lib/youtube';

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
  </svg>
);

// Vídeos reais do canal Terra Gentil (UCX3xUnHpQrhSUJUGjqMAN2A) usados como
// fallback quando o feed RSS do YouTube não responde. Sincronizados com a
// listagem do app mobile (mobile/src/components/redesign/VideosScreen.tsx).
const FALLBACK = [
  {
    id: 'K1J5I9IcGIw',
    title: 'Transformei De Graça O Jardim De Um Senhor Deficiente aos 87 anos',
    tag: 'Transformação',
  },
  {
    id: 'pbQkbLbApw0',
    title: 'VIZINHOS NÃO AGUENTAVAM MAIS ESSE JARDIM ABANDONADO',
    tag: 'Transformação',
  },
  {
    id: 'w-L6Bk8i9zQ',
    title: 'Transformação Completa do Jardim Abandonado de um Senhor',
    tag: 'Live',
  },
] as const;

export default async function Videos() {
  const fetched = await fetchPlaylistVideos(3);
  const videos = fetched.length >= 3
    ? fetched.map((v, i) => ({
        id: v.id,
        title: v.title,
        tag: FALLBACK[i]?.tag ?? 'No canal',
      }))
    : FALLBACK;

  const [main, ...rest] = videos;

  return (
    <section id="videos" className="section-pad" style={{ background: 'var(--paper)' }}>
      <div className="section-head">
        <div>
          <div className="section-eyebrow">No canal · Toda semana</div>
          <h2 className="section-title">
            Os <span className="ital">últimos</span> vídeos
          </h2>
        </div>
        <p className="section-aside">
          Transformações completas, tutoriais sem enrolação e respostas pra quem mandou foto da planta morrendo no DM.
        </p>
      </div>

      <div className="videos-grid">
        <a
          href={`https://youtube.com/watch?v=${main.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="video-card"
        >
          <Image
            className="thumb"
            src={`https://i.ytimg.com/vi/${main.id}/hqdefault.jpg`}
            alt={main.title}
            fill
            sizes="(max-width: 980px) 100vw, 60vw"
          />
          <div className="veil" />
          <div className="play">
            <PlayIcon />
          </div>
          <div className="body">
            <div className="tag">{main.tag} · em destaque</div>
            <div className="title">{main.title}</div>
          </div>
        </a>
        <div className="videos-secondary">
          {rest.map((v) => (
            <a
              key={v.id}
              href={`https://youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-card small"
            >
              <Image
                className="thumb"
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt={v.title}
                fill
                sizes="(max-width: 980px) 100vw, 40vw"
              />
              <div className="veil" />
              <div className="play">
                <PlayIcon />
              </div>
              <div className="body">
                <div className="tag">{v.tag}</div>
                <div className="title">{v.title}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="see-more-row">
        <Link className="see-more dark" href="/videos">
          Ver todos os vídeos →
        </Link>
      </div>
    </section>
  );
}
