import type { Metadata } from 'next';
import { ebooks } from '@/data/ebooks';
import GuiasClient from './GuiasClient';
import StatNum from '@/components/ui/StatNum';
import { INSTAGRAM_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Ebooks · Terra Gentil',
  description:
    '18 ebooks práticos pra resolver os perrengues mais comuns. Suculentas, compostagem, pragas, hortas. Tudo grátis em PDF.',
};

const COLORS = ['#74C69D', '#4A8C4F', '#D8552B', '#E8A33D', '#74C69D', '#4A8C4F', '#E8A33D', '#D8552B', '#74C69D', '#E8A33D', '#4A8C4F', '#D8552B'] as const;

const CATS = [
  { id: 'all', label: 'Todos' },
  { id: 'iniciante', label: 'Iniciante' },
  { id: 'apartamento', label: 'Apartamento' },
  { id: 'sustentavel', label: 'Sustentável' },
  { id: 'doutor', label: 'Doutor' },
] as const;

function categorize(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('compost') || t.includes('adubo') || t.includes('reciclag')) return 'sustentavel';
  if (t.includes('apartamento') || t.includes('vertical') || t.includes('varanda') || t.includes('vaso')) return 'apartamento';
  if (t.includes('praga') || t.includes('doenç') || t.includes('toxic') || t.includes('pets')) return 'doutor';
  return 'iniciante';
}

export default function GuiasPage() {
  const books = ebooks.map((e, i) => ({
    id: String(i + 1).padStart(2, '0'),
    title: e.title.replace(/^[^a-zA-Z0-9]+/, '').trim(),
    pages: 24 + (i * 4) % 24,
    cat: categorize(e.title),
    color: COLORS[i % COLORS.length],
    pdf: e.pdf,
    cover: e.image,
  }));
  const totalPages = books.reduce((acc, b) => acc + b.pages, 0);

  return (
    <>
      <section className="gu-hero">
        <div className="gu-hero-inner">
          <div className="gu-hero-stack" aria-hidden="true">
            {books.slice(0, 3).map((b, i) => (
              <div
                key={b.id}
                className="gu-stack-book"
                style={{
                  '--c': b.color,
                  '--rot': i === 0 ? '-8deg' : i === 1 ? '4deg' : '-3deg',
                  '--y': i === 0 ? '0px' : i === 1 ? '-12px' : '-30px',
                } as React.CSSProperties}
              >
                <div className="gu-stack-num">{b.id}</div>
                <div className="gu-stack-title">{b.title}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="page-hero-eyebrow">Biblioteca · 100% grátis</div>
            <h1 className="page-hero-title">
              {books.length} ebooks <span className="ital">práticos</span>.
            </h1>
            <p className="page-hero-sub">
              Ebooks de bolso pra resolver os perrengues mais comuns. {totalPages} páginas no total. Tudo em PDF, tudo
              de graça, tudo escrito pelo André.
            </p>
            <div className="gu-stat-row">
              <div className="gu-stat">
                <div className="n"><StatNum to={books.length} /></div>
                <div className="l">ebooks</div>
              </div>
              <div className="gu-stat">
                <div className="n"><StatNum to={totalPages} /></div>
                <div className="l">páginas</div>
              </div>
              <div className="gu-stat">
                <div className="n">∞</div>
                <div className="l">downloads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GuiasClient books={books} cats={CATS} />

      <section className="page-cta">
        <h2>
          Quer um ebook <span className="ital">novo</span>?
        </h2>
        <p>Manda no DM do Instagram qual perrengue você quer ver virar ebook. Os mais pedidos viram os próximos.</p>
        <a className="btn-yt" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Pedir no Instagram →
        </a>
      </section>
    </>
  );
}
