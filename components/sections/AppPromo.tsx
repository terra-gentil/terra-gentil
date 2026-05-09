import Link from 'next/link';
import { INSTAGRAM_URL } from '@/lib/constants';

const FEATURES = [
  { icon: '📷', t: 'Diagnóstico por foto', d: 'Aponta a câmera, IA Gemini identifica espécie e doença em segundos.' },
  { icon: '💧', t: 'Plano de rega', d: 'Lembretes inteligentes baseados na sua planta, sua casa e o clima da semana.' },
  { icon: '📚', t: 'Histórico vivo', d: 'Cada planta vira um diário com fotos, regas e bilhetes pra você acompanhar.' },
  { icon: '🌎', t: 'Comunidade', d: 'Posta a sua transformação, troca dica com outros jardineiros, salva favoritas.' },
] as const;

const APP_PLANTS = [
  { n: 'Costela', s: 'Saudável', c: 'leaf' },
  { n: 'Suculenta', s: 'Atenção', c: 'amber' },
  { n: 'Manjericão', s: 'Saudável', c: 'leaf' },
  { n: 'Orquídea', s: 'Em diagnóstico', c: 'rust' },
] as const;

export default function AppPromo() {
  return (
    <section id="app" className="app-promo">
      <div className="app-promo-inner">
        <div className="app-copy">
          <div className="section-eyebrow" style={{ color: 'var(--amber-deep)' }}>
            Aplicativo · iOS e Android
          </div>
          <h2 className="app-title">
            O Doutor
            <br />
            no seu <span className="ital">bolso.</span>
          </h2>
          <p className="app-body">
            Tudo que você ama do canal, agora num app. Diagnóstico por foto com IA, plano de rega personalizado,
            histórico de cada planta e a nossa comunidade do lado.
          </p>
          <div className="app-stack">
            <span>Powered by</span>
            <strong>Gemini 2.5</strong>
            <span>·</span>
            <strong>React Native</strong>
            <span>·</span>
            <strong>Supabase</strong>
          </div>
          <div className="app-store-row" aria-label="Lojas em breve">
            <div className="app-store app-store-soon">
              <div className="app-store-icon" />
              <div>
                <div className="app-store-small">Em breve na</div>
                <div className="app-store-big">App Store</div>
              </div>
            </div>
            <div className="app-store app-store-soon">
              <div className="app-store-icon android" />
              <div>
                <div className="app-store-small">Em breve no</div>
                <div className="app-store-big">Google Play</div>
              </div>
            </div>
          </div>
          <a className="app-beta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Quero ser beta tester (DM no Insta) →
          </a>
        </div>

        <div className="app-screens" aria-hidden="true">
          <div className="app-phone phone-back">
            <div className="app-phone-screen">
              <div className="app-screen-hd">
                <span>Minhas plantas</span>
                <span className="app-screen-hd-r">+</span>
              </div>
              <div className="app-card-list">
                {APP_PLANTS.map((p, i) => (
                  <div key={i} className="app-card-row">
                    <div className={`app-card-thumb t${i}`} />
                    <div>
                      <div className="app-card-name">{p.n}</div>
                      <div className={`app-card-stat ${p.c}`}>● {p.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="app-phone-notch" />
          </div>

          <div className="app-phone phone-front">
            <div className="app-phone-screen">
              <div className="app-screen-hd">
                <span>Diagnóstico</span>
                <span className="app-screen-hd-r">×</span>
              </div>
              <div className="app-photo">
                <div className="app-photo-leaf" />
                <div className="app-scan-line" />
              </div>
              <div className="app-verdict-pill">● Excesso de água</div>
              <div className="app-verdict-title">Costela-de-adão</div>
              <div className="app-verdict-rows">
                <div className="app-vr">
                  <span>Confiança</span>
                  <span className="b">94%</span>
                </div>
                <div className="app-vr">
                  <span>Próxima rega</span>
                  <span className="b">em 6 dias</span>
                </div>
                <div className="app-vr">
                  <span>Vídeo do canal</span>
                  <span className="b amber">Assistir →</span>
                </div>
              </div>
              <button type="button" className="app-btn-primary">
                Salvar no histórico
              </button>
            </div>
            <div className="app-phone-notch" />
          </div>
        </div>
      </div>

      <div className="app-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="app-feat">
            <div className="app-feat-icon" aria-hidden="true">
              {f.icon}
            </div>
            <div className="app-feat-t">{f.t}</div>
            <div className="app-feat-d">{f.d}</div>
          </div>
        ))}
      </div>

      <div className="see-more-row">
        <Link className="see-more dark" href="/app">
          Conheça o app completo →
        </Link>
      </div>
    </section>
  );
}
