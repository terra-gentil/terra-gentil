import type { Metadata } from 'next';
import { fetchPlaylistVideos } from '@/lib/youtube';
import { YOUTUBE_URL } from '@/lib/constants';
import PageHero from '@/components/sections/PageHero';
import VideosClient from './VideosClient';

export const metadata: Metadata = {
  title: 'Vídeos · Terra Gentil',
  description: 'Todos os vídeos do canal, atualizados automaticamente. Transformações, tutoriais e o Doutor responde.',
};

export const revalidate = 3600;

const FALLBACK_TAG = ['Transformação', 'Tutorial', 'Doutor responde', 'Live', 'Dica rápida'] as const;

export default async function VideosPage() {
  const fetched = await fetchPlaylistVideos();
  const videos = fetched.map((v, i) => ({
    id: v.id,
    title: v.title,
    publishedAt: v.publishedAt,
    tag: FALLBACK_TAG[i % FALLBACK_TAG.length].toLowerCase(),
    cat: ((): string => {
      const t = v.title.toLowerCase();
      if (t.includes('transform') || t.includes('quintal')) return 'transform';
      if (t.includes('live')) return 'live';
      if (t.includes('doutor') || t.includes('diagnóstic')) return 'doutor';
      return 'tutorial';
    })(),
  }));

  return (
    <>
      <PageHero
        eyebrow={videos.length > 0
          ? `Canal no YouTube · ${videos.length} vídeos`
          : 'Canal no YouTube'}
        title={
          <>
            Toda <span className="ital">terça</span>
            <br />
            tem vídeo novo.
          </>
        }
        sub="Transformações completas de quintais reais, tutoriais práticos pra quem mora em apartamento, lives respondendo dúvidas e o Doutor das Plantas em vídeo. Tudo grátis, sem fórmula mágica."
        mascot="/images/mascot/laptop.png"
        mascotAlt="Brotinho com laptop"
      />

      <VideosClient videos={videos} />

      <section className="vp-playlists">
        <div className="vp-inner">
          <h2 className="dr-section-title">
            Por <span className="ital">playlist</span>.
          </h2>
          <div className="vp-pl-grid">
            <a
              className="vp-pl"
              style={{ '--accent': 'rgba(74,140,79,0.4)' } as React.CSSProperties}
              href={`${YOUTUBE_URL}/playlists`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="num">01</div>
              <div className="name">Quintais que renasceram</div>
              <div className="ct">14 vídeos</div>
            </a>
            <a
              className="vp-pl"
              style={{ '--accent': 'rgba(232,163,61,0.4)' } as React.CSSProperties}
              href={`${YOUTUBE_URL}/playlists`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="num">02</div>
              <div className="name">Tutoriais sem enrolação</div>
              <div className="ct">32 vídeos</div>
            </a>
            <a
              className="vp-pl"
              style={{ '--accent': 'rgba(116,198,157,0.4)' } as React.CSSProperties}
              href={`${YOUTUBE_URL}/playlists`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="num">03</div>
              <div className="name">Doutor responde</div>
              <div className="ct">48 vídeos</div>
            </a>
          </div>
        </div>
      </section>

      <section className="page-cta">
        <h2>
          Inscreve no <span className="ital">canal</span> e recebe os novos.
        </h2>
        <p>Toda terça tem vídeo. Toda sexta tem live. E quando aparece foto da sua planta no DM, vira vídeo do Doutor.</p>
        <a className="btn-yt" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          Inscrever no YouTube →
        </a>
      </section>
    </>
  );
}
