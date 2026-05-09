'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';

export interface LiteYouTubeEmbedProps {
  videoId: string;
  title: string;
  /** Tamanho da thumb. hqdefault = 480x360. maxresdefault nao existe pra todo video. */
  thumbnailQuality?: 'hqdefault' | 'mqdefault' | 'sddefault';
  className?: string;
}

/**
 * Embed leve do YouTube: mostra so a thumbnail (1 request) e troca pro iframe
 * de verdade ao clicar. Cada iframe do YouTube custa ~500KB de JS+CSS, entao
 * em paginas com varios videos isso poupa MB no primeiro load.
 */
export default function LiteYouTubeEmbed({
  videoId,
  title,
  thumbnailQuality = 'hqdefault',
  className = '',
}: LiteYouTubeEmbedProps) {
  const [activated, setActivated] = useState(false);
  // encodeURIComponent pq videoId pode vir de fonte externa (RSS, API) com caracteres
  // que quebrariam a URL ou abririam injection de query params.
  const safeId = encodeURIComponent(videoId);
  const thumbUrl = `https://i.ytimg.com/vi/${safeId}/${thumbnailQuality}.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${safeId}?autoplay=1&rel=0`;

  if (activated) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className={`w-full h-full border-0 ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Reproduzir: ${title}`}
      className={`relative group w-full h-full bg-terra-100 overflow-hidden ${className}`}
    >
      <Image
        src={thumbUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play size={28} className="text-terra-700 ml-1" fill="currentColor" />
        </div>
      </div>
    </button>
  );
}
