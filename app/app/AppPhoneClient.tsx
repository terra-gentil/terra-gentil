'use client';

import { useState } from 'react';

// Pixel Garden brand tokens
const PG = {
  green: '#16a34a', greenDark: '#15803d', greenDeep: '#14532d',
  greenSoft: '#dcfce7', greenLeaf: '#22c55e',
  coral: '#fb6f92', coralDeep: '#e63b6e', coralSoft: '#ffe1ec',
  amber: '#f59e0b', amberDeep: '#b45309', amberSoft: '#fef3c7',
  sky: '#38bdf8', skyDeep: '#0284c7', skySoft: '#e0f2fe',
  lavender: '#a78bfa', lavenderSoft: '#ede9fe',
  bg: '#f6f1e7', card: '#ffffff',
  ink: '#1c1917', inkSoft: '#57534e', inkMute: '#a8a29e',
  divider: '#efeae0',
};

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 300, aspectRatio: '9/19.5', background: '#0a0a0a', borderRadius: 44, padding: 11, boxShadow: '0 30px 60px rgba(27,67,50,0.25), 0 0 0 2px rgba(0,0,0,0.4) inset', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#0a0a0a', borderRadius: 14, zIndex: 3 }} />
      <div style={{ width: '100%', height: '100%', background: PG.bg, borderRadius: 32, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px 6px', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', fontWeight: 700, fontSize: 13, zIndex: 4, position: 'relative', color: PG.ink }}>
          <span>9:41</span>
          <span>
            <svg width="16" height="11" viewBox="0 0 16 11" fill={PG.ink}><path d="M1 7h2v3H1zM5 5h2v5H5zM9 3h2v7H9zM13 1h2v9h-2z" /></svg>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function TabBar({ active = 'home' }: { active?: string }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'community', icon: '👥', label: 'Comunidade' },
    { id: 'fab', icon: '📷', label: '' },
    { id: 'videos', icon: '▶', label: 'Vídeos' },
    { id: 'me', icon: '👤', label: 'Eu' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '8px 6px 14px', background: 'white', borderTop: `1px solid ${PG.divider}`, position: 'relative', flexShrink: 0 }}>
      {tabs.map(t => t.id === 'fab' ? (
        <div key="fab" style={{ width: 56, height: 56, borderRadius: 18, background: PG.green, border: `2px solid ${PG.greenDark}`, boxShadow: `0 5px 0 ${PG.greenDeep}`, color: 'white', display: 'grid', placeItems: 'center', fontSize: 22, marginTop: -28 }}>📷</div>
      ) : (
        <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active === t.id ? PG.greenDark : PG.inkMute, fontSize: 10, fontWeight: 700, padding: '4px 8px' }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

function ScreenHome() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: PG.bg, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: PG.green, border: `2px solid ${PG.greenDark}`, display: 'grid', placeItems: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>A</div>
          <div>
            <div style={{ fontSize: 11, color: PG.inkMute, fontWeight: 600 }}>Bom dia,</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: PG.ink }}>André 🌱</div>
          </div>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'white', border: `1.5px solid ${PG.divider}`, display: 'grid', placeItems: 'center', fontSize: 14 }}>🔔</div>
      </div>

      <div style={{ margin: '12px 20px 0', padding: '12px 14px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: `2px solid ${PG.amber}`, borderRadius: 14, boxShadow: `0 3px 0 ${PG.amberDeep}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#92400e', fontWeight: 700 }}>SUA SEQUÊNCIA</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#78350f' }}>🔥 12 dias cuidando</div>
        </div>
        <div style={{ fontSize: 22 }}>›</div>
      </div>

      <div style={{ margin: '12px 20px 0', background: 'white', border: `2px solid ${PG.ink}`, borderRadius: 18, boxShadow: `0 5px 0 ${PG.ink}`, overflow: 'hidden' }}>
        <div style={{ aspectRatio: '16/10', background: `linear-gradient(180deg, ${PG.greenSoft}, #bbf7d0)`, position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascot/pose-1.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: 999, fontSize: 9, fontWeight: 800, border: `1.5px solid ${PG.ink}` }}>● ANALISANDO</div>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: PG.ink }}>Tire uma foto da sua planta</div>
          <div style={{ fontSize: 12, color: PG.inkSoft, marginTop: 2 }}>Doutor Gentileza analisa em segundos.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={{ flex: 1, background: PG.green, color: 'white', border: `2px solid ${PG.greenDark}`, borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 800, boxShadow: `0 3px 0 ${PG.greenDeep}` }}>📷 Tirar foto</button>
            <button style={{ flex: 1, background: 'white', border: `2px solid ${PG.ink}`, borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 800, color: PG.ink }}>🖼 Galeria</button>
          </div>
        </div>
      </div>

      <div style={{ margin: '12px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { tone: 'amber', icon: '📖', label: 'Ebooks', sub: '20 grátis', bg: PG.amberSoft, border: PG.amber, deep: PG.amberDeep },
          { tone: 'sky', icon: '🏷', label: 'Promoções', sub: 'Em breve', bg: PG.skySoft, border: PG.sky, deep: PG.skyDeep },
          { tone: 'coral', icon: '💬', label: 'Comunidade', sub: '142 hoje', bg: PG.coralSoft, border: PG.coral, deep: PG.coralDeep },
          { tone: 'lavender', icon: '▶', label: 'Vídeos', sub: '15 novos', bg: PG.lavenderSoft, border: PG.lavender, deep: '#6d28d9' },
        ].map(s => (
          <div key={s.tone} style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 14, padding: '10px 12px', boxShadow: `0 3px 0 ${s.deep}` }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: s.deep }}>{s.label}</div>
            <div style={{ fontSize: 10, color: s.deep, opacity: 0.75 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenDiagnosis() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: PG.bg, overflow: 'auto', minHeight: 0 }}>
      <div style={{ position: 'relative', aspectRatio: '16/11', overflow: 'hidden', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascot/pose-3.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        <div style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 10, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', color: 'white' }}>←</div>
        <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 10, background: PG.green, display: 'grid', placeItems: 'center', color: 'white', border: '2px solid white', fontSize: 14 }}>♥</div>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: PG.greenSoft, color: PG.greenDeep, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>● SAUDÁVEL</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: '#fee2e2', color: '#b91c1c', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠ TÓXICA</span>
        </div>
        <div style={{ fontSize: 11, color: PG.inkMute, fontWeight: 700, marginBottom: 2 }}>Dieffenbachia seguine</div>
        <div style={{ fontFamily: 'Nunito, system-ui, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15, color: PG.ink }}>Comigo-ninguém-pode</div>
        <div style={{ fontSize: 12, color: PG.inkSoft, marginTop: 2 }}>95% confiança · Doutor Gentileza</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 12 }}>
          {[
            { icon: '💧', v: '7d', l: 'rega', bg: PG.skySoft, border: PG.sky },
            { icon: '☀', v: '90%', l: 'luz', bg: PG.amberSoft, border: PG.amber },
            { icon: '🌡', v: '18-29°', l: 'temp', bg: PG.coralSoft, border: PG.coral },
          ].map(s => (
            <div key={s.l} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: PG.ink }}>{s.v}</div>
              <div style={{ fontSize: 9, color: PG.inkSoft, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '10px 12px', background: '#fee2e2', border: '2px solid #f87171', borderRadius: 12 }}>
          <div style={{ fontSize: 10, color: '#b91c1c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠ Tóxica para pets e crianças</div>
          <div style={{ fontSize: 11, color: '#7f1d1d', marginTop: 2 }}>Oxalato de cálcio nas folhas. Mantenha longe.</div>
        </div>
        <div style={{ marginTop: 14, fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 800, fontSize: 14, color: PG.ink }}>Plano de cuidado</div>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { n: '1', t: 'Esta semana', a: 'Monitore umidade do solo' },
            { n: '2', t: 'A cada 2-4 semanas', a: 'Adube com fertilizante balanceado' },
            { n: '3', t: 'Anualmente', a: 'Verifique se precisa vaso maior' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: PG.green, color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 11, border: `1.5px solid ${PG.greenDark}`, flexShrink: 0 }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 11, color: PG.greenDark, fontWeight: 800 }}>{step.t}</div>
                <div style={{ fontSize: 12, color: PG.inkSoft }}>{step.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenCommunity() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: PG.bg, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ padding: '12px 18px 8px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, background: 'white', border: `1.5px solid ${PG.divider}`, borderRadius: 12, padding: '8px 12px', fontSize: 12, color: PG.inkMute }}>🔍 Buscar plantas, autores, tags</div>
      </div>
      <div style={{ padding: '0 18px 8px', display: 'flex', gap: 6 }}>
        {['Populares', 'Meus posts', 'Pragas'].map((label, i) => (
          <button key={label} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, background: i === 0 ? PG.coral : 'white', color: i === 0 ? 'white' : PG.inkSoft, border: `1.5px solid ${i === 0 ? PG.coralDeep : PG.divider}`, whiteSpace: 'nowrap', boxShadow: i === 0 ? `0 2px 0 ${PG.coralDeep}` : 'none' }}>{label}</button>
        ))}
      </div>
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
        {[
          { gradient: `linear-gradient(135deg, ${PG.coral}, #fda4af)`, author: '@maria_jardineira', badge: '🌸', title: 'Achei manchas marrons na suculenta...', cat: 'Pragas', likes: '4,2K', comments: '83' },
          { gradient: `linear-gradient(135deg, ${PG.green}, #4ade80)`, author: 'Doutor Gentileza', badge: '✓', title: 'Como saber quando regar de verdade', cat: 'Dica', likes: '12K', comments: '240' },
        ].map((card) => (
          <div key={card.author} style={{ background: 'white', border: `2px solid ${PG.ink}`, borderRadius: 16, boxShadow: `0 4px 0 ${PG.ink}`, overflow: 'hidden' }}>
            <div style={{ aspectRatio: '16/9', background: card.gradient, position: 'relative', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ background: 'rgba(0,0,0,0.45)', color: 'white', padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, alignSelf: 'flex-start' }}>{card.cat}</div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 14, textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>{card.title}</div>
            </div>
            <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: PG.ink }}>{card.badge} {card.author}</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 10, color: PG.inkSoft, fontWeight: 700 }}>
                <span>♥ {card.likes}</span><span>💬 {card.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenProfile() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: PG.bg, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ height: 110, background: `linear-gradient(135deg, ${PG.greenDark}, ${PG.greenLeaf})`, position: 'relative', flexShrink: 0 }}>
        <svg viewBox="0 0 320 80" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 30 }}><path d={`M0 40 Q80 10 160 40 T320 30 V80 H0Z`} fill={PG.bg} /></svg>
        <div style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 10, background: 'rgba(255,255,255,0.25)', display: 'grid', placeItems: 'center', color: 'white' }}>⚙</div>
      </div>
      <div style={{ marginTop: -38, marginLeft: 20, width: 76, height: 76, borderRadius: '50%', background: PG.greenSoft, border: '4px solid white', boxShadow: `0 0 0 3px ${PG.green}`, display: 'grid', placeItems: 'center', overflow: 'hidden', position: 'relative', zIndex: 2, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascot/pose-7.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      </div>
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 900, fontSize: 18, color: PG.ink }}>André H.</div>
        <div style={{ fontSize: 11, color: PG.inkSoft }}>@andre_zoom · cuidando desde 2024</div>
      </div>
      <div style={{ margin: '10px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[{ v: '38', l: 'diagnósticos' }, { v: '12', l: 'espécies' }, { v: '3', l: 'selos' }].map(s => (
          <div key={s.l} style={{ background: 'white', border: `2px solid ${PG.ink}`, borderRadius: 12, padding: '8px 6px', textAlign: 'center', boxShadow: `0 3px 0 ${PG.ink}` }}>
            <div style={{ fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 900, fontSize: 18, color: PG.ink }}>{s.v}</div>
            <div style={{ fontSize: 9, color: PG.inkMute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '10px 20px 0', padding: '10px 12px', background: 'white', border: `2px solid ${PG.ink}`, borderRadius: 14, boxShadow: `0 4px 0 ${PG.ink}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: PG.inkMute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nível 3 de 5</div>
            <div style={{ fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 900, fontSize: 16, color: PG.ink }}>🌿 Jardineiro</div>
          </div>
          <div style={{ fontSize: 11, color: PG.greenDark, fontWeight: 800 }}>→ Botânico</div>
        </div>
        <div style={{ marginTop: 8, height: 8, background: PG.greenSoft, borderRadius: 999, overflow: 'hidden', border: `1.5px solid ${PG.greenDark}` }}>
          <div style={{ width: '62%', height: '100%', background: `linear-gradient(90deg, ${PG.green}, ${PG.greenLeaf})` }} />
        </div>
      </div>
      <div style={{ margin: '12px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 800, fontSize: 13, color: PG.ink }}>Conquistas</div>
        <div style={{ fontSize: 10, color: PG.greenDark, fontWeight: 700 }}>Ver tudo</div>
      </div>
      <div style={{ margin: '6px 20px 14px', display: 'flex', gap: 6 }}>
        {['🌱', '🌿', '🌳', '🌸', '🏆'].map((e, i) => (
          <div key={e} style={{ flex: 1, aspectRatio: '1', borderRadius: 12, background: i < 3 ? PG.amberSoft : PG.divider, border: `1.5px solid ${i < 3 ? PG.amber : PG.inkMute}`, display: 'grid', placeItems: 'center', fontSize: 20, opacity: i < 3 ? 1 : 0.35 }}>{e}</div>
        ))}
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  home: <ScreenHome />,
  diagnosis: <ScreenDiagnosis />,
  community: <ScreenCommunity />,
  profile: <ScreenProfile />,
};

const TABS = [
  { id: 'home', label: 'Início', caption: 'Atalhos, scanner, recentes' },
  { id: 'diagnosis', label: 'Diagnóstico', caption: '21 campos, plano gentil' },
  { id: 'community', label: 'Comunidade', caption: 'Feed, comentários, busca' },
  { id: 'profile', label: 'Eu', caption: 'Gamificação, conquistas, jardim' },
];

export default function AppPhoneClient() {
  const [screen, setScreen] = useState('home');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', marginTop: 56 }}>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <div key={screen} style={{ animation: 'fadeUp 320ms ease both' }}>
          <PhoneFrame>
            {SCREENS[screen]}
            <TabBar active={screen === 'diagnosis' ? 'home' : screen === 'profile' ? 'me' : screen} />
          </PhoneFrame>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setScreen(t.id)}
            style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 18, alignItems: 'center',
              padding: '20px 24px',
              background: screen === t.id ? '#1b4332' : '#f3eede',
              color: screen === t.id ? '#faf7f1' : '#1b1d1c',
              border: '1px solid',
              borderColor: screen === t.id ? '#1b4332' : '#e6e0cf',
              borderRadius: 20, textAlign: 'left', transition: 'all 200ms', cursor: 'pointer',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono, JetBrains Mono, monospace)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: screen === t.id ? '#E8A33D' : '#2d6a4f' }}>0{i + 1}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 22, letterSpacing: '-0.01em' }}>{t.label}</div>
              <div style={{ fontSize: 14, color: screen === t.id ? 'rgba(250,247,241,0.7)' : '#4b5650', marginTop: 2 }}>{t.caption}</div>
            </div>
            <div style={{ fontSize: 14, opacity: 0.5 }}>{screen === t.id ? '● visualizando' : '→'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { PhoneFrame, TabBar, ScreenHome, ScreenDiagnosis };
