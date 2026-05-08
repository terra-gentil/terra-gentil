import Image from 'next/image';
import Link from 'next/link';
import { GAME_URL } from '@/lib/constants';

export default function Game() {
  return (
    <section id="jogo" className="game">
      <div className="game-inner">
        <div className="game-copy">
          <div className="section-eyebrow" style={{ color: 'var(--amber)' }}>Joguinho oficial</div>
          <h2 className="game-title">
            Gentileza: <span className="ital">Resgate</span>
            <br />
            dos Jardins
          </h2>
          <p className="game-body">
            Um joguinho de celular feito por nós. Você entra num quintal abandonado, capina, planta, rega, vê o jardim
            renascer. Sem ads, sem login, só abrir e jogar.
          </p>
          <div className="game-meta">
            <div className="game-tag">
              <span className="dot" />
              Web · iOS · Android
            </div>
            <div className="game-tag">
              <span className="dot amber" />
              De graça
            </div>
            <div className="game-tag">
              <span className="dot leaf" />
              Modo paisagem
            </div>
          </div>
          <div className="game-cta-row">
            <a className="btn-amber" href={GAME_URL} target="_blank" rel="noreferrer">
              Jogar agora <span>→</span>
            </a>
            <a className="btn-ghost-light" href={GAME_URL} target="_blank" rel="noreferrer">
              Ver no celular
            </a>
          </div>
        </div>
        <div className="game-device" aria-hidden="true">
          <div className="game-phone">
            <div className="game-screen">
              <div className="game-sky" />
              <div className="game-ground" />
              <div className="game-tree" style={{ left: '18%' }} />
              <div className="game-tree small" style={{ left: '34%' }} />
              <div className="game-tree" style={{ left: '62%' }} />
              <div className="game-tree small" style={{ left: '78%' }} />
              <div className="game-flower" style={{ left: '12%' }} />
              <div className="game-flower" style={{ left: '46%' }} />
              <div className="game-flower" style={{ left: '70%' }} />
              <Image
                className="game-mascot-overlay"
                src="/images/mascot/shovel.png"
                alt=""
                width={100}
                height={140}
              />
              <div className="game-hud">
                <div className="game-coin">🌱 12</div>
                <div className="game-coin amber">★ 340</div>
              </div>
              <div className="game-tap">Toque pra plantar</div>
            </div>
            <div className="game-notch" />
          </div>
          <div className="game-shadow" />
        </div>
      </div>
      <div className="see-more-row">
        <Link className="see-more light" href="/jogo">
          Saiba mais sobre o jogo →
        </Link>
      </div>
    </section>
  );
}
