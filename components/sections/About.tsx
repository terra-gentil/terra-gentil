import Link from 'next/link';
import StatNum from '@/components/ui/StatNum';

export default function About() {
  return (
    <section className="about">
      <div className="about-grid">
        <div>
          <div className="section-eyebrow">Quem está atrás disso</div>
          <p className="about-quote">
            Eu acredito que toda terra merece volta. E que a gentileza é a melhor ferramenta de jardinagem que existe.
          </p>
          <div className="about-byline">
            <div>
              <div className="name">André, Fundador</div>
              <div className="role">Canal Terra Gentil · São Paulo, SP</div>
            </div>
          </div>
        </div>
        <div className="stats">
          <div className="stat-card">
            <div className="num">
              <StatNum to={84} />
              <span className="small">k</span>
            </div>
            <div className="lbl">Inscritos no YouTube transformando o próprio quintal</div>
          </div>
          <div className="stat-card amber">
            <div className="num"><StatNum to={142} /></div>
            <div className="lbl">Vídeos publicados, todos sem enrolação</div>
          </div>
          <div className="stat-card cream">
            <div className="num"><StatNum to={12} /></div>
            <div className="lbl">Ebooks práticos pra você baixar de graça</div>
          </div>
          <div className="stat-card">
            <div className="num"><StatNum to={27} /></div>
            <div className="lbl">Quintais inteiros que viraram jardins de verdade</div>
          </div>
        </div>
      </div>
      <div className="see-more-row">
        <Link className="see-more dark" href="/manifesto">
          Leia o manifesto completo →
        </Link>
      </div>
    </section>
  );
}
