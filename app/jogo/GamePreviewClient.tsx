'use client';

const FASE_1_LAYOUT = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const TILE_NAMES = ['tile_cut', 'tile_tall', 'tile_flowers', 'tile_stone'];

export default function GamePreviewClient({ level = 1 }: { level?: number }) {
  return (
    <div style={{
      background: '#1b4332', borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 24px 56px rgba(27,67,50,0.16)',
      position: 'relative', aspectRatio: '16/9',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      {/* Tilemap */}
      <div style={{
        display: 'grid', width: '100%', height: '100%',
        gridTemplateColumns: 'repeat(20, 1fr)',
        gridTemplateRows: 'repeat(11, 1fr)',
        imageRendering: 'pixelated',
        background: '#1b4332',
        position: 'absolute', inset: 0,
      }}>
        {FASE_1_LAYOUT.flat().map((t, i) => (
          <div key={i} style={{ backgroundImage: `url('/images/game/${TILE_NAMES[t]}.png')`, backgroundSize: 'cover', imageRendering: 'pixelated' }} />
        ))}
      </div>

      {/* Fuel barrel */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/game/fuel_barrel.png" alt="" style={{
        position: 'absolute', left: 'calc(70% - 18px)', top: 'calc(28% - 24px)',
        width: 36, height: 48, imageRendering: 'pixelated', zIndex: 2,
      }} />

      {/* Gentileza sprite */}
      <div style={{
        position: 'absolute', left: 'calc(35% - 32px)', top: 'calc(45% - 40px)',
        width: 64, height: 90,
        backgroundImage: "url('/images/game/gentileza.png')",
        backgroundSize: '768px 90px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        imageRendering: 'pixelated',
        animation: 'gentileza-walk 0.6s steps(4) infinite',
        zIndex: 2,
      }} />

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 14, left: 14, right: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
        color: 'white', fontWeight: 700, fontSize: 13,
        textShadow: '1px 1px 0 #000, 0 0 6px rgba(0,0,0,0.4)',
        pointerEvents: 'none', zIndex: 3,
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>FASE {String(level).padStart(2, '0')} / 10</div>
          <div style={{ marginTop: 6, width: 180, height: 12, border: '2px solid white', background: 'rgba(0,0,0,0.5)', borderRadius: 3, overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', background: 'linear-gradient(90deg, #E8A33D, #fde047)', width: '72%' }} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, opacity: 0.85 }}>GRAMA RESTANTE</div>
          <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em' }}>43</div>
        </div>
      </div>

      {/* D-Pad */}
      <div style={{
        position: 'absolute', left: 18, bottom: 18,
        width: 108, height: 108,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 3, zIndex: 3,
      }}>
        {[
          { label: '↑', col: 2, row: 1 },
          { label: '←', col: 1, row: 2 },
          { label: '', col: 2, row: 2, empty: true },
          { label: '→', col: 3, row: 2 },
          { label: '↓', col: 2, row: 3 },
        ].map((btn) => (
          <div key={btn.label + btn.col + btn.row} style={{
            gridColumn: btn.col, gridRow: btn.row,
            background: btn.empty ? 'transparent' : 'rgba(0,0,0,0.5)',
            border: btn.empty ? 'none' : '2px solid rgba(255,255,255,0.7)',
            borderRadius: 5, color: 'white', fontWeight: 900, fontSize: 16,
            display: 'grid', placeItems: 'center',
          }}>{btn.label}</div>
        ))}
      </div>
    </div>
  );
}
