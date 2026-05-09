'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

interface Book {
  id: string;
  title: string;
  pages: number;
  cat: string;
  color: string;
  pdf: string;
  cover: string;
}

interface Cat {
  id: string;
  label: string;
}

export default function GuiasClient({ books, cats }: { books: Book[]; cats: ReadonlyArray<Cat> }) {
  const [cat, setCat] = useState<string>('all');
  const filtered = useMemo(
    () => (cat === 'all' ? books : books.filter((b) => b.cat === cat)),
    [cat, books],
  );

  return (
    <section className="gu-library">
      <div className="gu-inner">
        <div className="gu-tabs">
          {cats.map((c) => {
            const count = c.id === 'all' ? books.length : books.filter((b) => b.cat === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                className={`vp-tab ${cat === c.id ? 'active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.label} <span className="vp-count">{count}</span>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.65, padding: '40px 0' }}>
            Sem ebooks nessa categoria. Em breve.
          </p>
        ) : (
          <div className="gu-grid">
            {filtered.map((b) => (
              <a
                key={b.id}
                className="gu-card"
                style={{ '--c': b.color } as React.CSSProperties}
                href={b.pdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="gu-cover">
                  <Image
                    src={b.cover}
                    alt={b.title}
                    fill
                    sizes="(max-width: 720px) 50vw, 240px"
                    className="gu-cover-img"
                  />
                  <div className="gu-cover-veil" />
                  <div className="gu-cover-foot">
                    <span>{b.id}</span>
                    <span>{b.pages} pp</span>
                  </div>
                </div>
                <div className="gu-card-meta">
                  <div className="gu-card-cat">#{b.cat}</div>
                  <div className="gu-card-dl">Baixar PDF →</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
