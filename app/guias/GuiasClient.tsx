import Image from 'next/image';
import type { EbookCategoria } from '@/data/ebooks';

interface Book {
  id: string;
  title: string;
  pages: number;
  cat: string;
  color: string;
  pdf: string;
  /** /guias/<slug> quando o assunto ja tem livro novo com pagina propria. */
  pagina?: string;
  cover: string;
}

// Biblioteca de PDFs dividida em prateleiras por categoria. A barra de chips
// fica fixa no topo e leva direto para cada prateleira (ancoras, sem JS).
export default function GuiasClient({
  books,
  cats,
}: {
  books: Book[];
  cats: ReadonlyArray<EbookCategoria>;
}) {
  const prateleiras = cats
    .map((c) => ({ cat: c, livros: books.filter((b) => b.cat === c.id) }))
    .filter((p) => p.livros.length > 0);

  return (
    <section className="gu-library">
      <div className="gu-inner">
        <nav className="gu-chips" aria-label="Categorias de ebooks">
          {prateleiras.map(({ cat, livros }) => (
            <a key={cat.id} href={`#cat-${cat.id}`} className="gu-chip" style={{ '--c': cat.cor } as React.CSSProperties}>
              <span aria-hidden="true">{cat.emoji}</span> {cat.nome} <span className="gu-chip-n">{livros.length}</span>
            </a>
          ))}
        </nav>

        {prateleiras.map(({ cat, livros }) => (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="gu-shelf"
            style={{ '--c': cat.cor } as React.CSSProperties}
            aria-labelledby={`shelf-${cat.id}`}
          >
            <header className="gu-shelf-head">
              <span className="gu-shelf-emoji" aria-hidden="true">{cat.emoji}</span>
              <div>
                <h2 id={`shelf-${cat.id}`} className="gu-shelf-title">
                  {cat.nome} <span className="gu-shelf-n">{livros.length}</span>
                </h2>
                <p className="gu-shelf-sub">{cat.chamada}</p>
              </div>
            </header>
            <div className="gu-grid">
              {livros.map((b) => (
                <a
                  key={b.id}
                  className="gu-card"
                  style={{ '--c': b.color } as React.CSSProperties}
                  href={b.pagina ?? b.pdf}
                  {...(b.pagina ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
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
                    <div className="gu-card-title">{b.title}</div>
                    <div className="gu-card-row">
                      <div className="gu-card-cat">{cat.nome}</div>
                      <div className="gu-card-dl">{b.pagina ? 'Ler no site →' : 'Baixar PDF →'}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
