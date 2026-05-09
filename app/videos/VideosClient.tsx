'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
  tag: string;
  cat: string;
}

const TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'transform', label: 'Transformações' },
  { id: 'tutorial', label: 'Tutoriais' },
  { id: 'doutor', label: 'Doutor responde' },
  { id: 'live', label: 'Lives' },
] as const;

export default function VideosClient({ videos }: { videos: VideoItem[] }) {
  const [tab, setTab] = useState<string>('all');

  const filtered = useMemo(
    () => (tab === 'all' ? videos : videos.filter((v) => v.cat === tab)),
    [tab, videos],
  );

  return (
    <section className="vp">
      <div className="vp-inner">
        <div className="vp-tabs">
          {TABS.map((t) => {
            const count = t.id === 'all' ? videos.length : videos.filter((v) => v.cat === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                className={`vp-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label} <span className="vp-count">{count}</span>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.7, padding: '40px 0' }}>
            Sem vídeos nessa categoria por enquanto.
          </p>
        ) : (
          <div className="vp-grid">
            {filtered.map((v) => (
              <a
                key={v.id}
                className="vp-card"
                href={`https://youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="vp-thumb">
                  <Image
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    fill
                    sizes="(max-width: 980px) 100vw, 33vw"
                  />
                  <div className="play-btn" aria-hidden="true">▶</div>
                </div>
                <div className="vp-body">
                  <div className="vp-tag">#{v.tag}</div>
                  <div className="vp-title">{v.title}</div>
                  {v.publishedAt && (
                    <div className="vp-meta">
                      {new Date(v.publishedAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
