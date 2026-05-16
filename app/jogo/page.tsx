import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import GamePreviewClient from './GamePreviewClient';

export const metadata: Metadata = {
  title: `Jogo · ${SITE_NAME}`,
  description:
    'Gentileza: Resgate dos Jardins. Corte a grama, resgaste as flores, salve o jardim. Jogo pixel art gratuito, roda direto no navegador. Sem login, sem anúncio, sem cobrança.',
};

const INK = '#1b1d1c';
const INKSOFT = '#4b5650';
const INKMUTE = '#93958f';
const PAPER = '#faf7f1';
const PAPERWARM = '#f3eede';
const GREEN_DEEPEST = '#1b4332';
const GREEN_DEEP = '#2d6a4f';
const GREEN = '#52b788';
const GREEN_SOFT = '#d8f3dc';
const AMBER = '#E8A33D';
const AMBER_DEEP = '#b87211';
const AMBER_SOFT = '#fef0d0';
const DIVIDER = '#e6e0cf';

const FEATURES = [
  {
    icon: '🗺️',
    title: '10 fases progressivas',
    desc: 'Cada fase um jardim diferente: quintal urbano, praça abandonada, horta comunitária. Dificuldade cresce com o labirinto de pedras e flores raras espalhadas.',
  },
  {
    icon: '🏆',
    title: 'Ranking global',
    desc: 'Pontuação por grama cortada, flores resgatadas e tempo. Top 50 atualizado em tempo real. Seu nickname do app Terra Gentil aparece direto na tabela.',
  },
  {
    icon: '🌱',
    title: 'Modo prática',
    desc: 'Sem timer, sem pressão. Explore o mapa no seu ritmo, aprenda os padrões de cada fase antes de ir pro ranking competitivo.',
  },
  {
    icon: '🌙',
    title: 'Modo olhos cansados',
    desc: 'Paleta de alto contraste otimizada pra quem joga de noite. Um toggle no HUD. Sem piscar, sem perder o progresso.',
  },
  {
    icon: '🔊',
    title: 'SFX Web Audio API',
    desc: 'Sons sintetizados diretamente no browser via Web Audio API. Nenhum arquivo de áudio externo. A trilha "Lawn Mower NES" de Shiru toca sem latência.',
  },
  {
    icon: '🌍',
    title: 'Roda em qualquer lugar',
    desc: 'Browser puro: HTML, CSS, JavaScript vanilla. Sem dependências, sem login. Funciona no celular, tablet e desktop. Salva progresso no localStorage.',
  },
] as const;

const RANKING_MOCK = [
  { pos: 1, nick: 'jardimeiro_carioca', score: 98_420, fases: 10, tempo: '02:14' },
  { pos: 2, nick: 'rosinha_verde', score: 94_110, fases: 10, tempo: '02:31' },
  { pos: 3, nick: 'andre_hz', score: 91_880, fases: 10, tempo: '02:47' },
  { pos: 4, nick: 'comigo_ninguem_pode', score: 87_250, fases: 9, tempo: '03:02' },
  { pos: 5, nick: 'plantae_br', score: 82_400, fases: 9, tempo: '03:18' },
  { pos: 6, nick: 'suculenta_fc', score: 78_900, fases: 8, tempo: '03:44' },
  { pos: 7, nick: 'terra_gentil_fan', score: 71_340, fases: 8, tempo: '04:01' },
] as const;

function medalColor(pos: number) {
  if (pos === 1) return AMBER;
  if (pos === 2) return '#a0a0a0';
  if (pos === 3) return '#cd7f32';
  return DIVIDER;
}

export default function JogoPage() {
  return (
    <>
      {/* ================================================================ */}
      {/* HERO — fundo claro, título pixel, imagem title_bg               */}
      {/* ================================================================ */}
      <section style={{ background: PAPER, color: INK, padding: '100px 28px 72px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, left: -80, width: 340, height: 340, borderRadius: '50%', background: GREEN_SOFT, opacity: 0.55, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: -100, right: -60, width: 380, height: 380, borderRadius: '50%', background: AMBER_SOFT, opacity: 0.45, filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
          <div className="jg-hero-grid" style={{ alignItems: 'center' }}>
            <div>
              <div className="page-hero-eyebrow" style={{ color: GREEN_DEEP }}>
                Grátis · web · sem login
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display, Archivo Black, sans-serif)',
                fontWeight: 400,
                fontSize: 'clamp(48px, 8vw, 112px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: INK,
                marginBottom: 24,
                textTransform: 'none',
              }}>
                Cortar.<br /><span className="ital">Resgatar.</span><br />Repetir.
              </h1>
              <p style={{
                fontFamily: 'var(--font-sans, Inter, sans-serif)',
                fontSize: 'clamp(17px, 1.3vw, 21px)',
                color: INKSOFT,
                maxWidth: '50ch',
                lineHeight: 1.55,
                marginBottom: 32,
              }}>
                Gentileza: Resgate dos Jardins. Corte a grama alta, resgaste as flores escondidas e salve cada jardim abandonado.
                Jogo pixel art do canal Terra Gentil. Sem custo, sem anúncio, sem conta.
              </p>
              <div className="jg-cta-row">
                <a
                  href="#jogar"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18,
                    padding: '20px 32px', borderRadius: 999,
                    background: GREEN_DEEPEST, color: PAPER,
                    border: `1px solid ${GREEN_DEEPEST}`,
                    transition: 'transform 140ms ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Jogar agora →
                </a>
                <Link
                  href="/#newsletter"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18,
                    padding: '19px 30px', borderRadius: 999,
                    background: 'transparent', color: GREEN_DEEPEST,
                    border: `1.5px solid ${GREEN_DEEPEST}`,
                    transition: 'background 140ms, color 140ms',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Ver o canal
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 44, flexWrap: 'wrap' }}>
                {[
                  { stat: '10', label: 'fases pixel art' },
                  { stat: '50', label: 'vagas no ranking global' },
                  { stat: '0', label: 'anúncios, pra sempre' },
                ].map(({ stat, label }) => (
                  <div key={stat}>
                    <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 44, color: GREEN_DEEPEST, lineHeight: 1, letterSpacing: '-0.02em' }}>{stat}</div>
                    <div style={{ fontSize: 13, color: INKSOFT, fontWeight: 500, maxWidth: '18ch', marginTop: 6, lineHeight: 1.4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Imagem do título do jogo */}
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: 420 }}>
              <div style={{
                width: '100%', maxWidth: 520,
                borderRadius: 24, overflow: 'hidden',
                position: 'relative', aspectRatio: '4/3',
                background: GREEN_DEEPEST,
                border: `1px solid ${DIVIDER}`,
                boxShadow: '0 30px 80px rgba(27,67,50,0.22)',
                imageRendering: 'pixelated',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/game/title_bg.png"
                  alt="Gentileza: Resgate dos Jardins"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', bottom: 18, left: 18, right: 18,
                  background: 'rgba(27,67,50,0.88)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 18px', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em', color: AMBER, marginBottom: 4 }}>
                    ● Jogo em produção
                  </div>
                  <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 17, color: PAPER, letterSpacing: '-0.01em' }}>
                    Gentileza: Resgate dos Jardins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      {/* ================================================================ */}
      {/* GAMEPLAY PREVIEW — dark, tilemap interativo                     */}
      {/* ================================================================ */}
      <section id="jogar" style={{ background: GREEN_DEEPEST, padding: '96px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,163,61,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: AMBER, marginBottom: 18 }}>
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Gameplay · Fase 01
            </div>
            <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: PAPER, textTransform: 'none' }}>
              Veja o jogo <span className="ital" style={{ color: AMBER }}>por dentro</span>.
            </h2>
            <p style={{ color: 'rgba(250,247,241,0.72)', fontSize: 18 }}>
              Grade 20x11, tiles pixel art, sprite animado. O Gentileza corta a grama alta e coleta barris de combustível pra avançar de fase.
            </p>
          </div>

          {/* Preview do jogo */}
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <GamePreviewClient level={1} />
          </div>

          {/* Legenda dos tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
            {[
              { img: '/images/game/tile_cut.png', name: 'Grama cortada', desc: 'Tile limpo — já passou por aqui' },
              { img: '/images/game/tile_tall.png', name: 'Grama alta', desc: 'Bloqueia a visão, abriga flores' },
              { img: '/images/game/tile_flowers.png', name: 'Flores silvestres', desc: 'Resgatar vale pontos extras' },
              { img: '/images/game/tile_stone.png', name: 'Pedra', desc: 'Obstáculo intransponível' },
            ].map(tile => (
              <div key={tile.name} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.img} alt="" width={36} height={36} style={{ imageRendering: 'pixelated', borderRadius: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 13, color: PAPER, letterSpacing: '-0.01em', marginBottom: 4 }}>{tile.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(250,247,241,0.6)', lineHeight: 1.4 }}>{tile.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cards: personagem + barril */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/game/gentileza.png" alt="" width={64} height={90} style={{ imageRendering: 'pixelated', objectFit: 'none', objectPosition: '0 0', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 15, color: PAPER, marginBottom: 6 }}>Gentileza</div>
                <div style={{ fontSize: 13, color: 'rgba(250,247,241,0.65)', lineHeight: 1.45 }}>Personagem principal. Spritesheet 12 frames de 64x90 px. Animado em steps(4) por direção.</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/game/fuel_barrel.png" alt="" width={36} height={48} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 15, color: PAPER, marginBottom: 6 }}>Barril de combustível</div>
                <div style={{ fontSize: 13, color: 'rgba(250,247,241,0.65)', lineHeight: 1.45 }}>Recarrega a barra de combustível. Coletar todos é obrigatório pra completar a fase.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* POR QUE ESSE JOGO — 6 features                                  */}
      {/* ================================================================ */}
      <section style={{ background: PAPERWARM, borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}`, padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Por que esse jogo?
            </div>
            <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
              Simples por <span className="ital">design</span>.
            </h2>
            <p style={{ color: INKSOFT, fontSize: 18 }}>
              Feito pra quem nunca jogou videogame. Sem tutorial obrigatório, sem mecânica complexa. Pega, joga, entende em 10 segundos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: PAPER, border: `1px solid ${DIVIDER}`, borderRadius: 22, padding: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: GREEN_SOFT, display: 'grid', placeItems: 'center', fontSize: 26, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 22, marginBottom: 8, letterSpacing: '-0.01em', color: INK }}>{f.title}</div>
                <div style={{ fontSize: 15.5, color: INKSOFT, lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* RANKING — mock com 7 jogadores                                  */}
      {/* ================================================================ */}
      <section style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
                <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Ranking global
              </div>
              <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
                Top 50. Seu nome, <span className="ital">pra valer</span>.
              </h2>
              <p style={{ color: INKSOFT, fontSize: 17, lineHeight: 1.6, marginBottom: 24 }}>
                Pontuação por grama cortada, flores resgatadas e tempo de conclusão. Ranking atualizado em tempo real. Sem bots, sem pay-to-win.
              </p>
              <div style={{ background: PAPERWARM, border: `1px solid ${DIVIDER}`, borderRadius: 18, padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: GREEN_DEEP, marginBottom: 12 }}>Anti-cheat</div>
                <div style={{ fontSize: 14.5, color: INKSOFT, lineHeight: 1.55 }}>
                  Pontuação validada server-side. Tempo mínimo por fase calculado pelo mapa. Score impossível de alcançar no tempo registrado é rejeitado automaticamente.
                </div>
              </div>
            </div>

            <div style={{ background: PAPERWARM, border: `1px solid ${DIVIDER}`, borderRadius: 22, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${DIVIDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 18, color: INK, letterSpacing: '-0.01em' }}>Placar desta semana</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: INKMUTE }}>Ao vivo</div>
              </div>
              <div>
                {/* Cabeçalho */}
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 50px 70px', gap: 8, padding: '10px 24px', background: PAPER, borderBottom: `1px solid ${DIVIDER}` }}>
                  {['#', 'Jogador', 'Pontos', 'Fases', 'Tempo'].map(h => (
                    <div key={h} style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: INKMUTE, textAlign: h === 'Pontos' || h === 'Fases' || h === 'Tempo' ? 'right' : 'left' }}>{h}</div>
                  ))}
                </div>
                {RANKING_MOCK.map(player => (
                  <div key={player.pos} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 50px 70px', gap: 8, padding: '14px 24px', borderBottom: `1px solid ${DIVIDER}`, alignItems: 'center', background: player.pos <= 3 ? 'rgba(232,163,61,0.04)' : PAPERWARM }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: medalColor(player.pos), display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: 12, fontWeight: 700, color: player.pos <= 3 ? GREEN_DEEPEST : INKSOFT }}>
                      {player.pos}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)', fontSize: 14, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.nick}</div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, fontWeight: 600, color: GREEN_DEEPEST, textAlign: 'right' }}>{player.score.toLocaleString('pt-BR')}</div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: INKSOFT, textAlign: 'right' }}>{player.fases}/10</div>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: INKMUTE, textAlign: 'right' }}>{player.tempo}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 24px', background: PAPER, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: INKMUTE }}>Dados simulados. Ranking real ao lançar.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CRÉDITOS — Shiru + Lawn Mower NES                               */}
      {/* ================================================================ */}
      <section style={{ background: PAPERWARM, borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}`, padding: '80px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ background: GREEN_DEEPEST, borderRadius: 24, padding: '48px 52px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.18em', color: AMBER, marginBottom: 18 }}>♪ Trilha sonora</div>
              <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: PAPER, marginBottom: 16, textTransform: 'none' }}>
                Lawn Mower NES,<br />por <span className="ital" style={{ color: AMBER }}>Shiru</span>.
              </h2>
              <p style={{ color: 'rgba(250,247,241,0.72)', fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
                Trilha chiptune 8-bit de domínio público. Criada por Shiru para jogos no estilo NES. Sintetizada via Web Audio API no browser, sem arquivo de áudio.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Chiptune', 'NES-style', 'Domínio público', 'Web Audio API'].map(tag => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.08)', color: 'rgba(250,247,241,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '28px 32px' }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: AMBER, marginBottom: 16 }}>Créditos completos</div>
              {[
                ['Jogo', 'André HZ · Terra Gentil'],
                ['Pixel art', 'André HZ'],
                ['Sprites', 'Personagem Gentileza'],
                ['Trilha', 'Shiru · Lawn Mower NES'],
                ['Engine', 'JavaScript vanilla'],
                ['Licença', 'Todos os direitos reservados'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
                  <span style={{ color: 'rgba(250,247,241,0.5)', fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>{k}</span>
                  <span style={{ color: PAPER, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA FINAL — gradiente verde, tile pattern                       */}
      {/* ================================================================ */}
      <section style={{ padding: '96px 28px', background: `linear-gradient(135deg, ${GREEN_DEEPEST} 0%, ${GREEN_DEEP} 100%)`, position: 'relative', overflow: 'hidden' }}>
        {/* Pattern de tiles como fundo */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: "url('/images/game/tile_tall.png')",
          backgroundSize: '48px 48px',
          imageRendering: 'pixelated',
          opacity: 0.08,
        }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(135deg, ${GREEN_DEEPEST}cc 0%, ${GREEN_DEEPEST}88 100%)` }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.18em', color: AMBER, marginBottom: 18 }}>Pronto pra começar?</div>
          <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(48px, 8vw, 100px)', lineHeight: 0.95, letterSpacing: '-0.02em', color: PAPER, marginBottom: 24, textTransform: 'none' }}>
            Bora <span className="ital" style={{ color: AMBER }}>jogar</span>?
          </h2>
          <p style={{ color: 'rgba(250,247,241,0.72)', fontSize: 19, maxWidth: '44ch', margin: '0 auto 36px', lineHeight: 1.55 }}>
            Sem login, sem download, sem conta. Abre no navegador, começa em dois segundos e salva o progresso localmente.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#jogar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 20,
                padding: '22px 40px', borderRadius: 999,
                background: AMBER, color: GREEN_DEEPEST,
                border: `1px solid ${AMBER_DEEP}`,
                transition: 'transform 140ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              Jogar agora →
            </a>
            <Link
              href="/app"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18,
                padding: '21px 32px', borderRadius: 999,
                background: 'transparent', color: PAPER,
                border: `1.5px solid rgba(250,247,241,0.5)`,
                transition: 'border-color 140ms',
                whiteSpace: 'nowrap',
              }}
            >
              Ver o app →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
