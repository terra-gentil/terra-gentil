import Link from 'next/link';
import { ebooks } from '@/data/ebooks';

export default function Ebooks() {
  const display = ebooks.slice(0, 4);

  return (
    <section id="guias" className="ebooks">
      <div className="section-head">
        <div>
          <div className="section-eyebrow" style={{ color: 'var(--amber)' }}>De graça</div>
          <h2 className="section-title" style={{ color: 'var(--paper)' }}>
            {ebooks.length} <span className="ital" style={{ color: 'var(--amber)' }}>guias</span> pra baixar
          </h2>
        </div>
        <p className="section-aside" style={{ color: 'rgba(244,236,219,0.7)' }}>
          PDFs práticos, sem fórmula mágica. Cada um nasceu de uma pergunta repetida no comentário do canal.
        </p>
      </div>
      <div className="ebook-grid">
        {display.map((g, i) => (
          <a key={g.title} href={g.pdf} target="_blank" rel="noopener noreferrer" className="ebook">
            <div>
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <div className="pgs">PDF · grátis</div>
            </div>
            <div className="ttl">{g.title.replace(/^[^a-zA-Z0-9]+/, '')}</div>
            <div className="icon" aria-hidden="true">🌿</div>
          </a>
        ))}
      </div>
      <div className="see-more-row">
        <Link className="see-more light" href="/guias">
          Ver todos os {ebooks.length} guias →
        </Link>
      </div>
    </section>
  );
}
