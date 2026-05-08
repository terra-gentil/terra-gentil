import Image from 'next/image';
import Link from 'next/link';
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_NAME,
  TIKTOK_URL,
  WHATSAPP_NUMBER,
  YOUTUBE_URL,
  whatsappLink,
} from '@/lib/constants';

const navColumns = [
  {
    heading: 'Navegar',
    links: [
      { href: '/manifesto', label: 'Manifesto' },
      { href: '/videos', label: 'Vídeos' },
      { href: '/doutor', label: 'Doutor' },
      { href: '/transformacoes', label: 'Transformações' },
      { href: '/guias', label: 'Guias' },
    ],
  },
];

const socials = [
  {
    href: YOUTUBE_URL,
    label: 'YouTube',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.11-2.117C19.804 3.5 12 3.5 12 3.5s-7.804 0-9.388.569A2.994 2.994 0 0 0 .502 6.186C0 7.772 0 12 0 12s0 4.228.502 5.814a2.994 2.994 0 0 0 2.11 2.117c1.584.569 9.388.569 9.388.569s7.804 0 9.388-.569a2.994 2.994 0 0 0 2.11-2.117C24 16.228 24 12 24 12s0-4.228-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z" />
      </svg>
    ),
    text: 'YouTube',
  },
  {
    href: INSTAGRAM_URL,
    label: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.18 15.58 2.16 15.2 2.16 12c0-3.2.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 5.84a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.59a2.59 2.59 0 1 1 0-5.18 2.59 2.59 0 0 1 0 5.18zm5.41-6.75a.93.93 0 1 1 0-1.86.93.93 0 0 1 0 1.86z" />
      </svg>
    ),
    text: '@canalterragentil',
  },
  {
    href: TIKTOK_URL,
    label: 'TikTok',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
      </svg>
    ),
    text: '@terragentil',
  },
  {
    href: whatsappLink('Olá! Vi o site Terra Gentil e queria saber mais.'),
    label: 'WhatsApp',
    icon: <span aria-hidden="true">💬</span>,
    text: `WhatsApp · ${WHATSAPP_NUMBER.slice(2, 4)} ${WHATSAPP_NUMBER.slice(4, 9)}-${WHATSAPP_NUMBER.slice(9)}`,
  },
];

const qrs = [
  { src: '/images/qr/youtube.png', cap: 'YouTube' },
  { src: '/images/qr/instagram.png', cap: 'Instagram' },
  { src: '/images/qr/site.png', cap: 'Site' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              Terra <span className="ital">gentil</span>
            </div>
            <div className="footer-brand-sub">
              Jardinagem com gentileza desde 2022. Canal no YouTube, blog, ebooks e o Doutor das Plantas, tudo grátis.
            </div>
          </div>
          {navColumns.map((col) => (
            <div key={col.heading} className="footer-col">
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-col">
            <h4>Redes</h4>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.icon}
                    {s.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Escaneie</h4>
            <div className="footer-qrs">
              {qrs.map((q) => (
                <div key={q.cap} className="footer-qr-wrap">
                  <div className="footer-qr">
                    <Image src={q.src} alt={`QR ${q.cap}`} width={64} height={64} />
                  </div>
                  <div className="footer-qr-cap">{q.cap}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} {SITE_NAME}. Seja gentil com a terra. 🌿</div>
          <div>{CONTACT_EMAIL}</div>
        </div>
      </div>
    </footer>
  );
}
