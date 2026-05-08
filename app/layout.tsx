import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} - Jardinagem com Gentileza`,
  description:
    'Cuidamos de jardins esquecidos com dedicação e gentileza, valorizando cada espaço. Transformamos quintais esquecidos em espaços vivos.',
  keywords: ['jardinagem', 'transformação de jardins', 'paisagismo', SITE_NAME],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: `${SITE_NAME} - Jardinagem com Gentileza`,
    description: 'Transformando quintais esquecidos em espaços vivos.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Jardinagem com Gentileza`,
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
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="preconnect" href="https://terragentil.com.br" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-terra-700 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-terra-300"
        >
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
