import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { caminhoDaNoticia, dataLonga, lerNoticias } from '@/lib/noticias';

// Home: porta de entrada do Google para as notícias (link <a href> real). Some enquanto não há nenhuma.
export default function UltimasNoticias() {
  const noticias = lerNoticias().slice(0, 3);
  if (noticias.length === 0) return null;

  return (
    <section id="noticias" className="section-pad">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Notícias</div>
          <h2 className="section-title">
            Planta com <span className="ital">calma</span>
          </h2>
        </div>
        <p className="section-aside">
          Os cuidados que viram carrossel no Instagram, em texto completo e com a fonte de cada
          informação.
        </p>
      </div>
      <div className="blog-grid">
        {noticias.map((n) => (
          <Link key={n.slug} href={caminhoDaNoticia(n.slug)} className="blog-card">
            {n.capa ? (
              <div className="blog-thumb">
                <Image
                  src={n.capa.src}
                  alt={`Capa do carrossel: ${n.gancho}`}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="blog-thumb blog-thumb-fallback" aria-hidden="true">
                <span>Terra Gentil</span>
              </div>
            )}
            <div className="blog-body">
              <time dateTime={n.dia} className="blog-date">
                {dataLonga(n.dia)}
              </time>
              <h3 className="blog-title">{n.materia.titulo}</h3>
              <p className="blog-excerpt">{n.materia.descricao}</p>
              <span className="blog-read">
                Ler texto <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="see-more-row">
        <Link href="/noticias" className="btn-amber">
          <span>Ver todas as notícias</span>
        </Link>
      </div>
    </section>
  );
}
