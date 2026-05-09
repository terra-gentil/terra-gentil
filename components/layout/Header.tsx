'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BrandMark from './BrandMark';
import { GAME_ENABLED, YOUTUBE_URL } from '@/lib/constants';

const allLinks = [
  { href: '/videos', label: 'Vídeos' },
  { href: '/doutor', label: 'Doutor' },
  { href: '/app', label: 'App' },
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/transformacoes', label: 'Transformações' },
  { href: '/jogo', label: 'Jogo', requiresGame: true },
  { href: '/guias', label: 'Guias' },
  { href: '/instagram', label: 'Instagram' },
];

// Filtra rotas gated antes de renderizar (sem /jogo no nav se NEXT_PUBLIC_GAME_ENABLED nao setado)
const navLinks = allLinks.filter((l) => !l.requiresGame || GAME_ENABLED);

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);

  // Fecha o menu mobile com Esc ou quando muda de rota.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Fecha quando navega. setState direto no efeito e o padrao pra reset por
  // mudanca de prop/contexto (proximo de derived state); o disable e intencional.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="nav" aria-label="Principal">
        <Link href="/" className="nav-brand">
          <BrandMark color="#E8A33D" size={26} />
          <span>
            TERRA <span style={{ color: '#E8A33D' }}>GENTIL</span>
          </span>
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cta"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a2.994 2.994 0 0 0-2.11-2.117C19.804 3.5 12 3.5 12 3.5s-7.804 0-9.388.569A2.994 2.994 0 0 0 .502 6.186C0 7.772 0 12 0 12s0 4.228.502 5.814a2.994 2.994 0 0 0 2.11 2.117c1.584.569 9.388.569 9.388.569s7.804 0 9.388-.569a2.994 2.994 0 0 0 2.11-2.117C24 16.228 24 12 24 12s0-4.228-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z" />
          </svg>
          <span>Inscrever</span>
        </a>
        <button
          type="button"
          className="nav-mobile-toggle"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="nav-mobile-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>
      {open && (
        <>
          <div
            className="nav-mobile-overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="nav-mobile-panel"
            className="nav-mobile-panel"
            aria-label="Mobile"
          >
            <Link href="/" aria-current={isHome ? 'page' : undefined}>
              Início
            </Link>
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </>
  );
}
