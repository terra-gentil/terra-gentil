import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AppPhoneClient from './AppPhoneClient';

export const metadata: Metadata = {
  title: 'App · Terra Gentil',
  description:
    'O app completo do Doutor das Plantas: diagnóstico por IA, plano de rega, biblioteca brasileira e comunidade. Em desenvolvimento, lança em 2026. Tudo grátis, pra sempre.',
};

// Cores do design system do site (usadas fora do phone frame)
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
const CORAL = '#d8552b';
const CORAL_SOFT = '#fde2d4';
const DIVIDER = '#e6e0cf';

const FEATURES = [
  { icon: '📷', badge: 'Gemini 2.5 Flash', title: 'Diagnóstico por foto', tone: 'green', desc: 'JPEG até 10 MB. Backend FastAPI no Railway responde em ~6s com 21 campos validados por Pydantic. Retry automático se o JSON vier truncado.' },
  { icon: '💧', badge: 'A cada N dias', title: 'Plano de rega', tone: 'green', desc: 'Calculado pela espécie e clima. "Diariamente" se rega_dias ≤ 1, "A cada 7 dias" pra Comigo-ninguém-pode, com condição: "quando os 2-3 cm do solo estiverem secos".' },
  { icon: '📚', badge: '600+ espécies', title: 'Biblioteca brasileira', tone: 'amber', desc: 'Fichas escritas pelo André, não geradas por IA. Foco em espécies que crescem no clima daqui — do manjericão da janela ao mandacaru do quintal.' },
  { icon: '🌿', badge: 'AsyncStorage', title: 'Meu Jardim', tone: 'green', desc: 'Cada diagnóstico vira ficha no histórico local. Grid 3 colunas com foto + emoji da planta. Salva offline. Buffer 20, mostra 5 no Home.' },
  { icon: '👥', badge: 'Local + cloud em breve', title: 'Comunidade', tone: 'coral', desc: 'Feed com 5 filtros (Populares, Meus posts, Seguindo, Pragas, Suculentas). Postagem com 5 paletas de cor, tags, preview ao vivo. Comentários, share nativo.' },
  { icon: '▶', badge: 'YouTube oficial', title: '15 vídeos do canal', tone: 'coral', desc: 'Transformações, Shorts, Lives. Thumbnails reais via img.youtube.com. Cada vídeo abre o link individual no app do YouTube.' },
  { icon: '📖', badge: 'PDF + download', title: '19 ebooks grátis', tone: 'amber', desc: 'Biblioteca completa do site dentro do app. WebView do PDF (iOS direto, Android via Google Docs). Botão baixar abre menu nativo "Salvar em Arquivos".' },
  { icon: '🎮', badge: 'WebView landscape', title: 'Jogo integrado', tone: 'green', desc: 'Resgate dos Jardins roda fullscreen via WebView do GitHub Pages. Lock landscape no mount, restore portrait no unmount. Nickname propagado via URL param.' },
  { icon: '🏆', badge: 'Semente → Doutor', title: 'Gamificação 5 níveis', tone: 'amber', desc: 'Semente, Broto, Jardineiro, Botânico, Doutor das Plantas. 5 conquistas que desbloqueiam por total de diagnósticos. Streak de dias cuidando.' },
] as const;

const STACK_BACKEND = [
  ['Linguagem', 'Python 3.12'],
  ['Framework', 'FastAPI 0.115'],
  ['IA', 'Gemini 2.5 Flash'],
  ['Deploy', 'Railway Hobby'],
  ['Testes', '49 passando'],
] as const;

const STACK_MOBILE = [
  ['Framework', 'React Native 0.81'],
  ['Runtime', 'Expo SDK 54'],
  ['Nav', 'React Navigation 7'],
  ['Storage', 'AsyncStorage'],
  ['Ícones', 'Lucide'],
] as const;

const STACK_LAUNCH = [
  ['Android', 'Closed test'],
  ['iOS', 'Sprint 10 (futuro)'],
  ['Versão', '1.0.0'],
  ['Pacote', 'br.com.terragentil.app'],
  ['Política', 'GitHub Pages'],
] as const;

const SPRINTS: readonly { n: string; t: string; current?: boolean }[] = [
  { n: '5', t: 'Schema v3 com 21 campos + persona Doutor Gentileza' },
  { n: '6', t: 'Prontuário do Jardim · onboarding · settings' },
  { n: '9A/B', t: 'EAS Build · APK preview · 49 testes pytest' },
  { n: 'PG F1', t: 'Design system + tabs + 10 componentes' },
  { n: 'PG F2', t: '8 telas do figma · Comunidade · Ebooks · Promoções · Game embed' },
  { n: '9', t: 'Play Store Console — closed test em andamento', current: true },
];

function toneBg(tone: string) {
  if (tone === 'green') return GREEN_SOFT;
  if (tone === 'amber') return AMBER_SOFT;
  return CORAL_SOFT;
}

function Feat({ icon, badge, title, tone, desc }: { icon: string; badge: string; title: string; tone: string; desc: string }) {
  return (
    <div style={{ background: PAPER, border: `1px solid ${DIVIDER}`, borderRadius: 22, padding: 28, transition: 'transform 220ms, box-shadow 220ms' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: toneBg(tone), display: 'grid', placeItems: 'center', fontSize: 26, marginBottom: 16 }}>{icon}</div>
      {badge && (
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono, monospace)', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: AMBER_DEEP, background: AMBER_SOFT, padding: '4px 10px', borderRadius: 999, marginBottom: 12 }}>{badge}</div>
      )}
      <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 22, marginBottom: 8, letterSpacing: '-0.01em', color: INK }}>{title}</div>
      <div style={{ fontSize: 15.5, color: INKSOFT, lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

function StackLine({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${DIVIDER}`, fontSize: 14 }}>
      <span style={{ color: INKMUTE }}>{k}</span>
      <span style={{ color: INK, fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', fontSize: 13 }}>{v}</span>
    </div>
  );
}

function StackCard({ icon, title, lines }: { icon: string; title: string; lines: readonly (readonly [string, string])[] }) {
  return (
    <div style={{ background: PAPER, border: `1px solid ${DIVIDER}`, borderRadius: 22, padding: 28 }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 26, letterSpacing: '-0.01em', marginBottom: 16, color: INK }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {lines.map(([k, v]) => <StackLine key={k} k={k} v={v} />)}
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <>
      {/* ================================================================ */}
      {/* HERO — fundo claro, foto do mascote + phone flutuante             */}
      {/* ================================================================ */}
      <section style={{ background: PAPER, color: INK, padding: '96px 28px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Blobs decorativos */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, left: -120, width: 380, height: 380, borderRadius: '50%', background: GREEN_SOFT, opacity: 0.6, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: -120, right: -80, width: 420, height: 420, borderRadius: '50%', background: AMBER_SOFT, opacity: 0.5, filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '0 0' }}>
          <div className="jg-hero-grid">
            <div>
              <div className="page-hero-eyebrow" style={{ color: GREEN_DEEP }}>Em desenvolvimento · lança em 2026</div>
              <h1 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(60px, 9vw, 132px)', lineHeight: 0.92, letterSpacing: '-0.02em', color: INK, marginBottom: 24, textTransform: 'none' }}>
                O <span className="ital">app</span><br />completo.
              </h1>
              <p style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)', fontSize: 'clamp(17px, 1.3vw, 21px)', color: INKSOFT, maxWidth: '54ch', lineHeight: 1.55, marginBottom: 32 }}>
                Aponta a câmera, o Doutor Gentileza identifica espécie, doença e monta um plano de cuidado em{' '}
                <span style={{ fontFamily: 'var(--font-serif, Instrument Serif, Georgia, serif)', fontStyle: 'italic', color: GREEN_DEEPEST }}>português gentil</span>.
                Diagnóstico por IA, plano de rega, biblioteca brasileira e uma comunidade que cuida junto. Tudo grátis, pra sempre.
              </p>
              <div className="jg-cta-row">
                <Link href="/#newsletter" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18, padding: '20px 32px', borderRadius: 999, background: GREEN_DEEPEST, color: PAPER, border: `1px solid ${GREEN_DEEPEST}`, transition: 'transform 140ms ease', whiteSpace: 'nowrap' }}>
                  Avise quando lançar →
                </Link>
                <Link href="/doutor" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18, padding: '19px 30px', borderRadius: 999, background: 'transparent', color: GREEN_DEEPEST, border: `1.5px solid ${GREEN_DEEPEST}`, transition: 'background 140ms, color 140ms', whiteSpace: 'nowrap' }}>
                  Usar o Doutor agora
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 44, flexWrap: 'wrap' }}>
                {[
                  { stat: '21', label: 'campos analisados por foto' },
                  { stat: '600+', label: 'espécies brasileiras' },
                  { stat: '19', label: 'ebooks já integrados' },
                ].map(({ stat, label }) => (
                  <div key={stat}>
                    <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 44, color: GREEN_DEEPEST, lineHeight: 1, letterSpacing: '-0.02em' }}>{stat}</div>
                    <div style={{ fontSize: 13, color: INKSOFT, fontWeight: 500, maxWidth: '22ch', marginTop: 6, lineHeight: 1.4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foto do mascote + phone flutuante */}
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: 540 }}>
              <div style={{ width: '100%', maxWidth: 480, borderRadius: 28, overflow: 'hidden', position: 'relative', aspectRatio: '1/1', background: GREEN_SOFT, border: `1px solid ${DIVIDER}`, boxShadow: '0 30px 80px rgba(27,67,50,0.18)' }}>
                <Image src="/images/mascot/pose-1.jpg" alt="Doutor Gentileza" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 18, left: 18, background: PAPER, padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-mono, monospace)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: GREEN_DEEPEST, border: `1px solid ${DIVIDER}` }}>
                  👋 Doutor Gentileza
                </div>
                <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, background: PAPER, padding: '14px 18px', borderRadius: 16, border: `1px solid ${DIVIDER}`, boxShadow: '0 12px 28px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: CORAL }}>● Doença detectada</div>
                  <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 17, marginTop: 4, letterSpacing: '-0.01em', color: INK }}>
                    Mancha bacteriana <span style={{ fontFamily: 'var(--font-serif, Instrument Serif, Georgia, serif)', fontStyle: 'italic', color: AMBER_DEEP }}>· tomateiro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="conteudo" className="jump-anchor" aria-hidden="true" />

      {/* ================================================================ */}
      {/* COMO FUNCIONA — 3 passos                                          */}
      {/* ================================================================ */}
      <section style={{ background: PAPERWARM, borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}`, padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> 3 passos · 6 segundos
            </div>
            <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
              Da foto ao plano de <span className="ital">cuidado</span>.
            </h2>
            <p style={{ color: INKSOFT, fontSize: 18, maxWidth: '56ch', margin: '0 auto' }}>
              Gemini 2.5 Flash com prompt da persona Doutor Gentileza. Resposta validada em JSON estruturado com 21 campos. Se truncar, o backend tenta de novo.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { n: '01', tone: GREEN_DEEPEST, title: 'Aponta e clica.', desc: 'Pode ser foto nova ou da galeria. JPEG, PNG ou WebP até 10 MB. O app comprime, valida e envia.' },
              { n: '02', tone: AMBER_DEEP, title: 'Gemini analisa.', desc: 'Backend FastAPI no Railway. PIL valida a imagem, manda pro Gemini 2.5 Flash com schema JSON. Retry automático se a resposta vier truncada.' },
              { n: '03', tone: CORAL, title: 'Você recebe um diagnóstico inteiro.', desc: 'Espécie, saúde, toxicidade, luz, rega, temperatura, problemas detectados, plano de tratamento e timeline.' },
            ].map(step => (
              <div key={step.n} style={{ background: PAPER, border: `1px solid ${DIVIDER}`, borderRadius: 22, padding: 28 }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, fontWeight: 600, color: step.tone, letterSpacing: '0.1em', marginBottom: 16 }}>{step.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 10, color: INK, textTransform: 'none' }}>{step.title}</h3>
                <p style={{ color: INKSOFT, fontSize: 15.5, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* DIAGNÓSTICO REAL — Dieffenbachia exemplo                          */}
      {/* ================================================================ */}
      <section style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,0.9fr) minmax(0,1.1fr)', gap: 64, alignItems: 'center' }}>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '9/19', background: '#0a0a0a', borderRadius: 44, padding: 11, boxShadow: '0 30px 60px rgba(27,67,50,0.25), 0 0 0 2px rgba(0,0,0,0.4) inset' }}>
                <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#0a0a0a', borderRadius: 14, zIndex: 3 }} />
                <div style={{ width: '100%', height: '100%', background: '#f6f1e7', borderRadius: 32, overflow: 'hidden' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/11', overflow: 'hidden' }}>
                    <Image src="/images/mascot/pose-3.jpg" alt="Diagnóstico" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 999, background: '#dcfce7', color: '#14532d', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>● SAUDÁVEL</span>
                      <span style={{ padding: '4px 10px', borderRadius: 999, background: '#fee2e2', color: '#b91c1c', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>⚠ TÓXICA</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#a8a29e', fontWeight: 700, marginBottom: 2 }}>Dieffenbachia seguine</div>
                    <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#1c1917' }}>Comigo-ninguém-pode</div>
                    <div style={{ fontSize: 11, color: '#57534e', marginTop: 2 }}>95% confiança</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 10 }}>
                      {[
                        { icon: '💧', v: '7d', l: 'rega', bg: '#e0f2fe', border: '#38bdf8' },
                        { icon: '☀', v: '90%', l: 'luz', bg: '#fef3c7', border: '#f59e0b' },
                        { icon: '🌡', v: '18-29°', l: 'temp', bg: '#ffe1ec', border: '#fb6f92' },
                      ].map(s => (
                        <div key={s.l} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 10, padding: '7px 4px', textAlign: 'center' }}>
                          <div style={{ fontSize: 12 }}>{s.icon}</div>
                          <div style={{ fontSize: 12, fontWeight: 900, color: '#1c1917' }}>{s.v}</div>
                          <div style={{ fontSize: 8, color: '#57534e', fontWeight: 700, textTransform: 'uppercase' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP }}>
                <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Um diagnóstico real
              </div>
              <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginTop: 16, marginBottom: 16, color: INK, textTransform: 'none' }}>
                21 campos, escritos em<br /><span className="ital">português gentil</span>.
              </h2>
              <p style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)', fontSize: 'clamp(18px, 1.4vw, 22px)', color: INKSOFT, maxWidth: '56ch', lineHeight: 1.55, marginBottom: 24 }}>
                Nada de "Pythium spp. afeta tecido radicular". A IA é instruída a falar como um botânico acolhedor, pro público de 40 a 70 anos.
              </p>

              <div style={{ background: PAPERWARM, border: `1px solid ${DIVIDER}`, borderRadius: 22, padding: 24 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  {[
                    { bg: GREEN_SOFT, color: GREEN_DEEPEST, label: '✓ saudável' },
                    { bg: '#fee2e2', color: '#b91c1c', label: '⚠ tóxica para pets' },
                    { bg: AMBER_SOFT, color: AMBER_DEEP, label: '💧 a cada 7 dias' },
                    { bg: AMBER_SOFT, color: AMBER_DEEP, label: '☀ luz indireta brilhante' },
                  ].map(tag => (
                    <span key={tag.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', background: tag.bg, color: tag.color }}>{tag.label}</span>
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: INKMUTE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dieffenbachia seguine · 95% confiança</div>
                <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: 8, color: INK, textTransform: 'none' }}>
                  Sua <span className="ital">Comigo-ninguém-pode</span> está saudável e vibrante.
                </div>
                <div style={{ marginTop: 16, fontFamily: 'var(--font-serif, Instrument Serif, Georgia, serif)', fontSize: 19, fontStyle: 'italic', color: GREEN_DEEPEST, borderLeft: `3px solid ${AMBER}`, paddingLeft: 16, lineHeight: 1.45 }}>
                  "Que alegria ver sua plantinha tão cheia de vida! Suas folhas estão com uma coloração bonita e uniforme. Continue com os cuidados carinhosos."
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  ['eh_planta', 'bool'], ['especie_identificada', 'str'],
                  ['confianca', '0.0–1.0'], ['estado_saude', '5 níveis'],
                  ['toxica_para_pets', 'bool'], ['nivel_luz', '5 níveis'],
                  ['rega_dias', '0–60'], ['temperatura_ideal', 'str'],
                  ['problemas_detectados', 'lista'], ['plano_timeline', 'lista'],
                ].map(([k, t]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: PAPER, border: `1px solid ${DIVIDER}`, borderRadius: 10, fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>
                    <span style={{ color: INK }}>{k}</span>
                    <span style={{ color: AMBER_DEEP, fontWeight: 600 }}>{t}</span>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: INKMUTE, fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4 }}>+ 11 campos a mais</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* O QUE VEM DENTRO — 9 features                                    */}
      {/* ================================================================ */}
      <section style={{ background: PAPERWARM, borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}`, padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Tudo que já tá dentro
            </div>
            <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
              Não é só <span className="ital">diagnóstico</span>.
            </h2>
            <p style={{ color: INKSOFT, fontSize: 18 }}>O app inteiro foi construído tela por tela seguindo o design "Pixel Garden". Tudo funciona offline, salva local. Sincronia em nuvem chega na Sprint 7.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map(f => <Feat key={f.title} {...f} />)}
          </div>

          <div style={{ marginTop: 32, padding: '20px 28px', background: GREEN_DEEPEST, color: PAPER, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 24, letterSpacing: '-0.01em', textTransform: 'none' }}>
                100% <span className="ital" style={{ color: AMBER }}>grátis</span>, pra sempre.
              </div>
              <div style={{ opacity: 0.8, fontSize: 14.5, marginTop: 4 }}>Sem cartão, sem trial, sem anúncio, sem plano premium.</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.14em' }}>É um projeto pessoal do André.</div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TELAS PREVIEW — interactive phone (Client Component)             */}
      {/* ================================================================ */}
      <section style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Cada tela, desenhada no figma
            </div>
            <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
              Veja o app por <span className="ital">dentro</span>.
            </h2>
            <p style={{ color: INKSOFT, fontSize: 18 }}>Toque numa aba pra trocar a tela do celular. As 4 principais estão aqui — mesmas cores, sombras, fontes e proporções da versão em React Native.</p>
          </div>
          <AppPhoneClient />
        </div>
      </section>

      {/* ================================================================ */}
      {/* PIXEL GARDEN — design system                                      */}
      {/* ================================================================ */}
      <section style={{ background: PAPERWARM, borderTop: `1px solid ${DIVIDER}`, borderBottom: `1px solid ${DIVIDER}`, padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
                <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Design system
              </div>
              <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
                <span className="ital">Pixel</span> Garden.
              </h2>
              <p style={{ color: INKSOFT, fontSize: 17, lineHeight: 1.6 }}>
                Joyful, bold, mascote-first. 21 tokens de cor centralizados em{' '}
                <code style={{ background: PAPERWARM, padding: '2px 8px', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font-mono, monospace)' }}>theme.ts</code>.
                Sombras chunky 3D — offset y=6, opacity 1, radius 0 — estilo Duolingo. Tudo legível pra quem tem 40-70 anos.
              </p>
              <p style={{ marginTop: 14, color: INKSOFT, fontSize: 15 }}>
                <strong style={{ color: INK }}>Nunito</strong> 700/800/900 nos títulos. <strong style={{ color: INK }}>Plus Jakarta Sans</strong> 400-800 no corpo.
              </p>
              <div style={{ marginTop: 24, padding: 18, background: PAPER, border: `1px solid ${DIVIDER}`, borderRadius: 16 }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: GREEN_DEEP, marginBottom: 10 }}>Por que dois design systems?</div>
                <p style={{ fontSize: 14, color: INKSOFT }}>O <em>site</em> usa Archivo Black + Instrument Serif (institucional, desktop). O <em>app</em> usa Nunito + chunky 3D (mascote-first, mobile). Os dois falam Terra Gentil — só com sotaque diferente.</p>
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: GREEN_DEEP, marginBottom: 14 }}>Paleta principal (21 tokens)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { name: 'green', hex: '#16a34a' },
                  { name: 'coral', hex: '#fb6f92' },
                  { name: 'amber', hex: '#f59e0b' },
                  { name: 'sky', hex: '#38bdf8' },
                  { name: 'lavender', hex: '#a78bfa' },
                  { name: 'bg', hex: '#f6f1e7' },
                  { name: 'ink', hex: '#1c1917' },
                  { name: 'card', hex: '#ffffff' },
                ].map(sw => (
                  <div key={sw.name} style={{ borderRadius: 14, border: `1px solid ${DIVIDER}`, overflow: 'hidden', background: PAPER }}>
                    <div style={{ height: 64, background: sw.hex }} />
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{sw.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10.5, color: INKMUTE, marginTop: 2 }}>{sw.hex}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: GREEN_DEEP, marginTop: 32, marginBottom: 14 }}>Botões chunky (in-app)</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 20, background: '#f6f1e7', borderRadius: 14, border: `1px solid ${DIVIDER}` }}>
                {[
                  { bg: '#16a34a', color: 'white', border: '#15803d', shadow: '#14532d', label: '📷 Tirar foto' },
                  { bg: '#fb6f92', color: 'white', border: '#e63b6e', shadow: '#e63b6e', label: '💚 Curtir' },
                  { bg: '#ffffff', color: '#1c1917', border: '#1c1917', shadow: '#1c1917', label: 'Salvar' },
                  { bg: '#f59e0b', color: 'white', border: '#b45309', shadow: '#b45309', label: '📖 Ebooks' },
                ].map(btn => (
                  <span key={btn.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px', background: btn.bg, color: btn.color, border: `2px solid ${btn.border}`, boxShadow: `0 4px 0 ${btn.shadow}`, borderRadius: 12, fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 900, fontSize: 14 }}>{btn.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STACK & STATUS                                                    */}
      {/* ================================================================ */}
      <section style={{ padding: '96px 28px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: GREEN_DEEP, marginBottom: 18 }}>
              <span style={{ width: 24, height: 1, background: 'currentColor', display: 'inline-block' }} /> Stack & Status
            </div>
            <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16, color: INK, textTransform: 'none' }}>
              Construído em <span className="ital">público</span>.
            </h2>
            <p style={{ color: INKSOFT, fontSize: 18 }}>Sprint 9 em andamento — fechando Play Store Console. Build preview APK em testes fechados com 12 testadores por 14 dias antes de produção.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <StackCard icon="⚙" title="Backend" lines={STACK_BACKEND} />
            <StackCard icon="📱" title="Mobile" lines={STACK_MOBILE} />
            <StackCard icon="🚀" title="Lançamento" lines={STACK_LAUNCH} />
          </div>

          <div style={{ marginTop: 56, background: PAPERWARM, border: `1px solid ${DIVIDER}`, borderRadius: 24, padding: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, fontSize: 28, marginBottom: 20, letterSpacing: '-0.02em', color: INK, textTransform: 'none' }}>
              Sprints <span className="ital">concluídas</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SPRINTS.map(sprint => (
                <div key={sprint.n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: sprint.current ? AMBER_SOFT : PAPER, border: `1px solid ${sprint.current ? AMBER : DIVIDER}`, borderRadius: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: sprint.current ? AMBER : GREEN_DEEPEST, color: sprint.current ? GREEN_DEEPEST : PAPER, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {sprint.current ? '●' : '✓'}
                  </div>
                  <div style={{ flex: 1, fontSize: 14.5, color: INK }}>
                    <strong style={{ marginRight: 10, fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontWeight: 400, letterSpacing: '-0.01em', textTransform: 'none' }}>Sprint {sprint.n}</strong>
                    <span style={{ color: INKSOFT }}>{sprint.t}</span>
                  </div>
                  {sprint.current && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', background: AMBER_SOFT, color: AMBER_DEEP }}>em andamento</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* NEWSLETTER CTA                                                    */}
      {/* ================================================================ */}
      <section id="newsletter" style={{ padding: '80px 28px', background: PAPERWARM }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ background: GREEN_DEEPEST, color: PAPER, borderRadius: 28, padding: '64px 56px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', alignItems: 'center', gap: 40, position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(232,163,61,0.12)', filter: 'blur(60px)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.18em', color: AMBER, marginBottom: 18 }}>● Beta · 2026</div>
              <h2 style={{ fontFamily: 'var(--font-display, Archivo Black, sans-serif)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 18, textTransform: 'none' }}>
                Quer ser <span className="ital" style={{ color: AMBER }}>avisado</span><br />quando lançar?
              </h2>
              <p style={{ color: 'rgba(250,247,241,0.78)', fontSize: 17, marginBottom: 28, maxWidth: '44ch' }}>
                Entra na newsletter da home — a primeira leva de testes fechados começa daqui a poucas semanas.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/#newsletter" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18, padding: '20px 32px', borderRadius: 999, background: AMBER, color: GREEN_DEEPEST, border: `1px solid ${AMBER_DEEP}`, transition: 'transform 140ms', whiteSpace: 'nowrap' }}>
                  Avise quando lançar →
                </Link>
                <Link href="/doutor" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans, Inter, sans-serif)', fontWeight: 700, fontSize: 18, padding: '19px 30px', borderRadius: 999, background: 'transparent', color: PAPER, border: `1.5px solid ${PAPER}`, transition: 'background 140ms', whiteSpace: 'nowrap' }}>
                  Usar o Doutor web
                </Link>
              </div>
            </div>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Image src="/images/mascot/gift.jpg" alt="Mascote Gentileza com presente" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
