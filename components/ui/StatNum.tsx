'use client';

import { useEffect, useRef, useState } from 'react';

interface StatNumProps {
  to: number;
  duration?: number;
}

export default function StatNum({ to, duration = 1500 }: StatNumProps) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (reduceMotion) {
              setN(to);
              io.disconnect();
              return;
            }
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / duration);
              // Easing out cubic pra desacelerar no fim, sensacao mais natural
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.floor(eased * to));
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return <span ref={ref}>{n.toLocaleString('pt-BR')}</span>;
}
