import type { Metadata } from 'next';
import { Archivo_Black, Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import './globals.css';

const display = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const serif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

const sans = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} · Jardinagem com gentileza`,
  description:
    'Cada quintal esquecido vira um espaço vivo. Cada planta sofrida ganha um diagnóstico. Vídeos, ebooks e o Doutor das Plantas, tudo grátis.',
  keywords: ['jardinagem', 'transformação de jardins', 'paisagismo', SITE_NAME, 'doutor das plantas'],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: `${SITE_NAME} · Jardinagem com gentileza`,
    description: 'Transformando quintais esquecidos em espaços vivos.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} · Jardinagem com gentileza`,
    description: 'Transformando quintais esquecidos em espaços vivos.',
  },
  verification: GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="preconnect" href="https://terragentil.com.br" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
