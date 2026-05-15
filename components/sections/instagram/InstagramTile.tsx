'use client';

import { useState } from 'react';
import { IgKindIcon, PlayIcon } from '@/components/ui/icons';
import { Pattern } from './patterns';
import type { IgTile } from './data';

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 5 19 12 13 19" />
    </svg>
  );
}

const KIND_LABEL: Record<IgTile['kind'], string> = {
  reel: 'Reel',
  photo: 'Foto',
  carousel: 'Carrossel',
};

interface Props {
  tile: IgTile;
  sizeClass?: string;
  idx?: number;
  pinned?: boolean;
}

export default function InstagramTile({ tile, sizeClass = '', idx = 0, pinned = false }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const [bg, fg] = tile.tone;
  const showImage = Boolean(tile.thumbnailUrl) && !imgFailed;
  const isReel = tile.kind === 'reel';

  return (
    <a
      className={`igx-tile ${sizeClass}`}
      href={tile.permalink}
      target="_blank"
      rel="noopener noreferrer"
      style={
        {
          '--ig-bg': bg,
          '--ig-fg': fg,
          animationDelay: `${Math.min(idx * 60, 600)}ms`,
        } as React.CSSProperties
      }
    >
      <div className="igx-tile-art" />
      {showImage ? (
        // next/image inviavel aqui: URL do CDN do Instagram e assinada e
        // expira, o otimizador do Next cachearia uma URL morta. <img> puro
        // recarrega na revalidacao. CSP ja libera *.cdninstagram.com/*.fbcdn.net.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="igx-tile-img"
          src={tile.thumbnailUrl as string}
          alt={tile.title}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="igx-tile-pattern">
          <Pattern name={tile.pattern} fg={fg} bg={bg} />
        </div>
      )}
      <div className="igx-tile-veil" />

      <div className="igx-tile-top">
        <div className="igx-tile-kind">
          <span className="igx-dot" />
          <IgKindIcon kind={tile.kind} />
          <span>{KIND_LABEL[tile.kind]}</span>
        </div>
        {pinned && (
          <div className="igx-tile-pin" title="Fixado" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L14 8 L20 9 L15.5 13 L17 19 L12 16 L7 19 L8.5 13 L4 9 L10 8 Z" />
            </svg>
          </div>
        )}
      </div>

      {isReel && (
        <div className="igx-tile-play">
          <PlayIcon size={sizeClass.includes('is-feature') ? 30 : 22} />
        </div>
      )}

      <div className="igx-tile-bottom">
        <div className="igx-tile-title">{tile.title}</div>
      </div>

      <div className="igx-tile-hover">
        <span className="igx-pill">
          Ver no Instagram <ArrowIcon size={14} />
        </span>
      </div>
    </a>
  );
}
