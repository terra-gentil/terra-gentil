'use client';

import { useEffect, useState } from 'react';

interface Leaf {
  left: number;
  delay: number;
  dur: number;
  size: number;
  rot: number;
  op: number;
}

interface LeavesProps {
  count?: number;
}

export default function Leaves({ count = 16 }: LeavesProps) {
  const [items, setItems] = useState<Leaf[]>([]);

  useEffect(() => {
    // Populamos só no client pra evitar hydration mismatch (Math.random no SSR
    // gera valores diferentes do client). Esse padrão é intencional, daí o disable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 16,
        dur: 14 + Math.random() * 14,
        size: 14 + Math.random() * 18,
        rot: Math.random() * 360,
        op: 0.4 + Math.random() * 0.5,
      })),
    );
  }, [count]);

  if (items.length === 0) return null;

  return (
    <div className="leaves" aria-hidden="true">
      {items.map((p, i) => (
        <svg
          key={i}
          className="leaf"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.op,
            transform: `rotate(${p.rot}deg)`,
          }}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2 C6 4 2 9 2 14 C2 18 5 22 10 22 C16 22 22 16 22 8 C22 5 21 3 19 2 C16 2 13 2 12 2 Z M12 6 C12 10 10 14 6 18"
            fill={i % 3 === 0 ? '#E8A33D' : i % 3 === 1 ? '#74C69D' : '#4A8C4F'}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}
