import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon } from '@/components/ui/icons';
import { fetchPlaylistVideos } from '@/lib/youtube';

// Vídeos reais do canal @TerraGentil (UCfZn0uytIhsk30SMQtoKeLA) usados como
// fallback quando o feed RSS do YouTube não responde. Mesmos vídeos da aba
// Vídeos do app (mobile/src/components/redesign/VideosScreen.tsx).
const FALLBACK = [
  {
    id: 'Q9FzrwE7nBA',
    title: 'JARDIM ABANDONADO da Senhora de 90 anos Invadiu a Calçada: Limpei Tudo de GRAÇA!',
    tag: 'Transformação',
  },
  {
    id: 'ykCh1KKHcvg',
    title: '17 HORAS Limpando de GRAÇA o JARDIM ABANDONADO dessa Senhora!',
    tag: 'Transformação',
  },
  {
    id: '5xIySYrszC4',
    title: 'Viúvo aos 87, não dá mais conta do JARDIM ABANDONADO. Limpei tudo de GRAÇA!',
    tag: 'Transformação',
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
        <Link className="see-more dark" href="/videos#conteudo">
          Ver todos os vídeos →
        </Link>
      </div>
    </section>
  );
}
