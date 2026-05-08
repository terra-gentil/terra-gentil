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
      onMouseMove={(e) => isDragging.current && moveTo(e.clientX)}
      onMouseDown={(e) => {
        isDragging.current = true;
        moveTo(e.clientX);
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchStart={() => (isDragging.current = true)}
      onTouchMove={(e) => isDragging.current && moveTo(e.touches[0].clientX)}
      onTouchEnd={() => (isDragging.current = false)}
      className="ba"
      style={{ '--pct': `${position}%` } as React.CSSProperties}
    >
      <div className="layer">
        <Image src={before} alt={`${alt} antes`} fill sizes="(max-width: 1480px) 100vw, 1480px" draggable={false} />
      </div>
      <div className="layer after-clip">
        <div className="layer">
          <Image src={after} alt={`${alt} depois`} fill sizes="(max-width: 1480px) 100vw, 1480px" draggable={false} />
        </div>
      </div>
      <div className="label before-label">ANTES</div>
      <div className="label after-label">DEPOIS</div>
      <div className="ba-handle" />
    </div>
  );
}
