'use client';

import { useMemo, useState } from 'react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/constants';
import { InstagramOutlineIcon, IgKindIcon } from '@/components/ui/icons';
import type { IgProfile } from '@/lib/instagram';
import InstagramTile from './InstagramTile';
import { Pattern } from './patterns';
import { KINDS, formatCompact, mosaicSizeClass, type IgTile } from './data';

const IG_DM = 'https://ig.me/m/canalterragentil';

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MessageIcon({ size = 14 }: { size?: number }) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 17 0z" />
    </svg>
  );
}

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

function ProfileAvatar({ avatarUrl }: { avatarUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(avatarUrl) && !failed;
  return (
    <div className="igx-avatar">
      <div className="igx-avatar-inner">
        {showImg ? (
          // URL de avatar do CDN do Instagram e assinada/efemera, mesmo motivo
          // do tile: <img> puro em vez de next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl as string}
            alt={`Foto de perfil ${INSTAGRAM_HANDLE}`}
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <Pattern name="leaves" fg="#74C69D" bg="#11201A" />
            <span className="igx-avatar-mark">tg</span>
          </>
        )}
      </div>
    </div>
  );
}

function Profile({ profile }: { profile: IgProfile | null }) {
  const stats: Array<{ num: string; label: string }> = [];
  if (profile?.mediaCount != null)
    stats.push({ num: formatCompact(profile.mediaCount), label: 'Posts' });
  if (profile?.followersCount != null)
    stats.push({ num: formatCompact(profile.followersCount), label: 'Seguidores' });
  if (profile?.followsCount != null)
    stats.push({ num: formatCompact(profile.followsCount), label: 'Seguindo' });

  return (
    <section className="igx-profile" aria-label={`Perfil ${INSTAGRAM_HANDLE}`}>
      <ProfileAvatar avatarUrl={profile?.avatarUrl ?? null} />
      <div className="igx-profile-meta">
        <div className="igx-handle-row">
          <span className="igx-handle">{INSTAGRAM_HANDLE}</span>
          <span className="igx-verified" aria-label="Verificado">
            <CheckIcon size={12} />
          </span>
        </div>
        <p className="igx-bio">
          Jardinagem com gentileza. <strong>Diagnóstico de plantas</strong>, transformações de
          quintal e dicas rápidas. Marca a gente que repostamos os melhores.
        </p>
        {stats.length > 0 && (
          <div className="igx-stats">
            {stats.map((s) => (
              <div key={s.label} className="igx-stat">
                <span className="igx-stat-num">{s.num}</span>
                <span className="igx-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="igx-profile-actions">
        <a
          className="igx-btn-follow"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramOutlineIcon size={16} />
          <span>Seguir</span>
        </a>
        <a
          className="igx-btn-message"
          href={IG_DM}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageIcon size={14} />
          <span>Mandar mensagem</span>
        </a>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="igx-cta">
      <div className="igx-cta-inner">
        <div>
          <h2 className="igx-cta-title">
            Mostra o teu jardim. <span className="igx-ital">A gente reposta.</span>
          </h2>
          <p className="igx-cta-body">
            Marca <strong>{INSTAGRAM_HANDLE}</strong> nos teus antes-e-depois, plantas resgatadas,
            primeiro vaso. Repostamos os melhores toda semana, sem filtro, sem pose, só quintal de
            verdade.
          </p>
        </div>
        <div className="igx-cta-actions">
          <a
            className="igx-btn-amber"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramOutlineIcon size={16} />
            <span>Abrir Instagram</span>
            <ArrowIcon size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    'Transformações reais',
    'Plantas resgatadas',
    'Doutor Gentileza',
    'Quintal de verdade',
    'Dicas rápidas',
    'Antes e depois',
    'Comunidade gentil',
  ];
  const list = [...words, ...words, ...words];
  return (
    <div className="igx-marquee" aria-hidden="true">
      <div className="igx-marquee-track">
        {list.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}

export default function InstagramExperience({
  tiles,
  profile,
}: {
  tiles: IgTile[];
  profile: IgProfile | null;
}) {
  const [kind, setKind] = useState<'all' | IgTile['kind']>('all');
  const [visible, setVisible] = useState(12);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: tiles.length,
      reel: 0,
      photo: 0,
      carousel: 0,
    };
    tiles.forEach((t) => {
      c[t.kind] = (c[t.kind] || 0) + 1;
    });
    return c;
  }, [tiles]);

  const filtered = useMemo(
    () => (kind === 'all' ? tiles : tiles.filter((t) => t.kind === kind)),
    [tiles, kind],
  );

  return (
    <div className="igx">
      <header className="igx-hero">
        <div className="igx-eyebrow">Feed completo · Atualiza sozinho</div>
        <h1 className="igx-title">
          No <span className="igx-ital">Instagram</span>, sem filtro
        </h1>
        <Profile profile={profile} />
      </header>

      <section className="igx-tabs-bar" aria-label="Filtros">
        <div className="igx-tabs" role="tablist" aria-label="Filtrar por tipo">
          {KINDS.map((k) => (
            <button
              key={k.id}
              role="tab"
              type="button"
              aria-selected={kind === k.id}
              className={`igx-tab ${kind === k.id ? 'is-active' : ''}`}
              onClick={() => {
                setKind(k.id);
                setVisible(12);
              }}
            >
              {k.id === 'all' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              ) : (
                <IgKindIcon kind={k.id} />
              )}
              <span>{k.label}</span>
              <span className="igx-count">{counts[k.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="igx-feed-wrap" aria-label="Feed">
        <div className="igx-feed">
          {filtered.slice(0, visible).map((tile, i) => (
            <InstagramTile
              key={tile.key}
              tile={tile}
              sizeClass={mosaicSizeClass(i)}
              idx={i}
              pinned={i === 0}
            />
          ))}
        </div>
        {visible < filtered.length && (
          <div className="igx-load-more-row">
            <button
              className="igx-btn-load-more"
              type="button"
              onClick={() => setVisible((v) => v + 6)}
            >
              <span>Carregar mais</span>
              <ArrowIcon size={14} />
            </button>
          </div>
        )}
      </section>

      <CtaBand />
      <Marquee />
    </div>
  );
}
