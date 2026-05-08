import Link from 'next/link';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import { transformations } from '@/data/transformations';

export default function Transformations() {
  const featured = transformations[0];

  return (
    <section id="transformacoes" className="transform-section">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Antes · depois</div>
          <h2 className="section-title">
            Quintais que <span className="ital">renasceram</span>
          </h2>
        </div>
        <p className="section-aside">
          Arrasta a alça pra ver o &ldquo;antes&rdquo; e o &ldquo;depois&rdquo; de uma das transformações reais. Cada
          uma rendeu um vídeo de 20+ minutos.
        </p>
      </div>
      {featured ? (
        <BeforeAfterSlider before={featured.beforeImage} after={featured.afterImage} alt={featured.title} />
      ) : null}
      <div className="transform-foot">
        <div>
          <span className="count">{transformations.length}+</span> · transformações no acervo
        </div>
        <Link href="/transformacoes" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
          Ver galeria completa →
        </Link>
      </div>
    </section>
  );
}
