'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Leaves from './Leaves';
import { YouTubeIcon } from '@/components/ui/icons';
import { YOUTUBE_URL } from '@/lib/constants';

const PHOTOS = [
  { src: '/images/photos/andre-bench.png', label: 'Andre no quintal', focus: '50% 30%' },
  { src: '/images/photos/andre-ia.png', label: 'Lancamento da IA', focus: '40% 35%' },
  { src: '/images/photos/canal-girl.png', label: 'Canal Terra Gentil', focus: '50% 28%' },
] as const;

const ROTATE_INTERVAL_MS = 3500;

export default function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PHOTOS.length), ROTATE_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="hero">
      <Leaves count={18} />
      <div className="hero-grid">
        <div>
          <div className="hero-pill">
            <span className="dot" /> AO VIVO NO YOUTUBE · NOVO VÍDEO TODA SEMANA
          </div>
          <h1>
            <span className="row">Jardinagem</span>
            <span className="row">
              <span className="ital">com</span> gentileza
            </span>
            <span className="row stroke">e muita terra</span>
          </h1>
          <p className="hero-sub">
            Cada quintal esquecido vira um espaço vivo. Cada planta sofrida ganha um diagnóstico. André,
            junto do nosso Brotinho, transforma mato bagunçado em jardim toda semana, e te ensinam o
            caminho.
          </p>
          <div className="hero-cta-row">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="btn-yt">
              <YouTubeIcon size={18} />
              Assistir no YouTube
            </a>
            <Link href="#doutor" className="btn-ghost">
              Diagnosticar minha planta →
            </Link>
          </div>
        </div>

        <div className="hero-mascot t-polaroid">
          <div className="glow" />
          {PHOTOS.map((p, i) => {
            const offset = i - idx;
            const pos = ((offset % PHOTOS.length) + PHOTOS.length) % PHOTOS.length;
            return (
              <figure key={p.src} className={`pol pol-${pos}`} aria-hidden={pos !== 0}>
                <span className="pol-tape" aria-hidden="true" />
                <Image
                  src={p.src}
                  alt={p.label}
                  width={520}
                  height={650}
                  sizes="(max-width: 1000px) 60vw, 28vw"
                  style={{ objectPosition: p.focus }}
                  priority={i === 0}
                />
                <figcaption>{p.label}</figcaption>
              </figure>
            );
          })}
          <Image
            className="pol-mascot"
            src="/images/mascot/wave.webp"
            alt="Brotinho mascote da Terra Gentil acenando"
            width={992}
            height={1024}
            sizes="(max-width: 1000px) 50vw, 24vw"
            priority
          />
        </div>
      </div>
      <div className="hero-meta">
        <span>EST. 2022 · @TERRAGENTIL · BRASIL</span>
        <span className="scroll">SCROLL</span>
      </div>

      <div className="slide-ctrl" aria-label="Selecionar foto">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={`sc-dot ${i === idx ? 'on' : ''}`}
            onClick={() => setIdx(i)}
            title={p.label}
            aria-label={`Mostrar foto ${i + 1}: ${p.label}`}
          />
        ))}
      </div>
    </section>
  );
}
