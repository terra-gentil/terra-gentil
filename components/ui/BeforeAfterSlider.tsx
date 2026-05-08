'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

export interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
  initialPosition?: number;
}

export default function BeforeAfterSlider({
  before,
  after,
  alt,
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next = position;
    switch (e.key) {
      case 'ArrowLeft':
        next = Math.max(0, position - 5);
        break;
      case 'ArrowRight':
        next = Math.min(100, position + 5);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    setPosition(next);
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={`Comparação antes e depois: ${alt}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)}% antes, ${Math.round(100 - position)}% depois`}
      onKeyDown={onKeyDown}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none bg-terra-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-terra-400"
      onMouseMove={(e) => isDragging.current && moveTo(e.clientX)}
      onMouseDown={(e) => {
        isDragging.current = true;
        moveTo(e.clientX);
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchMove={(e) => moveTo(e.touches[0].clientX)}
    >
      <Image
        src={after}
        alt={`${alt} depois`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${alt} antes`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
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
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-terra-700"
            aria-hidden="true"
          >
            <polyline points="9 18 3 12 9 6" />
            <polyline points="15 18 21 12 15 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
