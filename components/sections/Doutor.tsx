import Link from 'next/link';
import dynamic from 'next/dynamic';

const PlantDoctor = dynamic(() => import('@/components/sections/PlantDoctor'), {
  loading: () => (
    <div className="pd-card" style={{ minHeight: 480 }}>
      <div className="pd-loading-msg">Carregando o Doutor das Plantas...</div>
    </div>
  ),
});

export default function Doutor() {
  return (
    <section id="doutor" className="doctor">
      <div className="doctor-grid">
        <PlantDoctor />
        <div className="doctor-text">
          <div className="section-eyebrow" style={{ color: 'var(--amber)' }}>
            Inteligência artificial · grátis
          </div>
          <h2 className="section-title" style={{ color: 'var(--paper)' }}>
            O <span className="ital" style={{ color: 'var(--amber)' }}>Doutor</span> das Plantas
          </h2>
          <p style={{ marginTop: 24 }}>
            Tira foto da folha sofrida, manda pra gente. Em segundos a IA devolve nome da planta, diagnóstico, plano
            de tratamento por dia, toxicidade e ebook combinado pra estudar o assunto. De graça, sem cadastro.
          </p>
          <div className="doctor-features">
            <div className="doctor-feature">
              <div className="check">1</div>
              <div>
                <div className="feat-title">Foto da folha ou caule</div>
                <div className="feat-body">Funciona pelo celular, nem precisa de luz boa.</div>
              </div>
            </div>
            <div className="doctor-feature">
              <div className="check">2</div>
              <div>
                <div className="feat-title">Diagnóstico em 8s</div>
                <div className="feat-body">Identificação, problema detectado, gravidade.</div>
              </div>
            </div>
            <div className="doctor-feature">
              <div className="check">3</div>
              <div>
                <div className="feat-title">Plano de ação por dia</div>
                <div className="feat-body">O que fazer hoje, amanhã, na semana que vem.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="see-more-row">
        <Link className="see-more light" href="/doutor">
          Como funciona o Doutor →
        </Link>
      </div>
    </section>
  );
}
