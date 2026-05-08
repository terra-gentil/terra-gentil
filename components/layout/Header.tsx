'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import BrandMark from './BrandMark';
import { YOUTUBE_URL } from '@/lib/constants';

const navLinks = [
  { href: '/videos', label: 'Vídeos' },
  { href: '/doutor', label: 'Doutor' },
  { href: '/app', label: 'App' },
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/transformacoes', label: 'Transformações' },
  { href: '/jogo', label: 'Jogo' },
  { href: '/guias', label: 'Guias' },
  { href: '/instagram', label: 'Instagram' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);

  const linkHref = (href: string) => (isHome ? `#${href.replace('/', '')}` : href);

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
            const target = isHome ? linkHref(link.href) : link.href;
            const active = !isHome && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={target}
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
          rel="noreferrer"
          className="nav-cta"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a2.994 2.994 0 0 0-2.11-2.117C19.804 3.5 12 3.5 12 3.5s-7.804 0-9.388.569A2.994 2.994 0 0 0 .502 6.186C0 7.772 0 12 0 12s0 4.228.502 5.814a2.994 2.994 0 0 0 2.11 2.117c1.584.569 9.388.569 9.388.569s7.804 0 9.388-.569a2.994 2.994 0 0 0 2.11-2.117C24 16.228 24 12 24 12s0-4.228-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z" />
          </svg>
          Inscrever
        </a>
        <button
          type="button"
          className="nav-mobile-toggle"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
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
        <div className="nav-mobile-panel" role="menu">
          <Link href="/" onClick={() => setOpen(false)} aria-current={isHome ? 'page' : undefined}>
            Home
          </Link>
          {navLinks.map((link) => {
            const target = isHome ? linkHref(link.href) : link.href;
            const active = !isHome && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={target}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
