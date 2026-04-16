'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { transformations } from '@/data/transformations';

function BeforeAfterSlider({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none bg-terra-100"
      onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
      onMouseDown={(e) => {
        isDragging.current = true;
        handleMove(e.clientX);
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <img
        src={after}
        alt={`${alt} depois`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          alt={`${alt} antes`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${(100 / position) * 100}%` }}
          draggable={false}
        />
      </div>

      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
        ANTES
      </div>
      <div className="absolute top-3 right-3 bg-terra-600 text-white text-xs font-medium px-3 py-1 rounded-full">
        DEPOIS
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-terra-700">
            <polyline points="9 18 3 12 9 6" />
            <polyline points="15 18 21 12 15 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Transformations() {
  return (
    <section className="py-20 bg-terra-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-terra-600 tracking-wide uppercase">
            Antes e depois
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-terra-900 mt-3 mb-4">
            Cada espaço tem um potencial
          </h2>
          <p className="text-terra-700">
            Arraste a barra para revelar a transformação. Cada projeto é uma história de cuidado e dedicação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {transformations.map((t) => (
            <div key={t.id} className="space-y-3">
              <BeforeAfterSlider before={t.beforeImage} after={t.afterImage} alt={t.title} />
              <div className="px-2">
                <h3 className="font-semibold text-terra-800">{t.title}</h3>
                {t.description && (
                  <p className="text-sm text-terra-600 mt-1">{t.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/transformacoes"
            className="inline-flex items-center gap-2 bg-terra-700 hover:bg-terra-800 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
          >
            Ver todas as transformações
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
