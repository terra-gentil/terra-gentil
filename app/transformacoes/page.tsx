'use client';

import { useState, useRef } from 'react';
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
      <img src={after} alt={`${alt} depois`} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt={`${alt} antes`} className="absolute inset-0 w-full h-full object-cover" style={{ width: `${(100 / position) * 100}%` }} draggable={false} />
      </div>
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">ANTES</div>
      <div className="absolute top-3 right-3 bg-terra-600 text-white text-xs font-medium px-3 py-1 rounded-full">DEPOIS</div>
      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
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

export default function TransformacoesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-terra-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mb-4">Antes e Depois</h1>
          <p className="text-terra-700 text-lg">
            Arraste cada imagem para revelar o poder da transformação.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {transformations.map((t) => (
              <div key={t.id} className="space-y-4">
                <BeforeAfterSlider before={t.beforeImage} after={t.afterImage} alt={t.title} />
                <div>
                  <h2 className="text-xl font-bold text-terra-800">{t.title}</h2>
                  {t.description && <p className="text-terra-600 mt-1">{t.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
