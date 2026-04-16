import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import './globals.css';

export const metadata: Metadata = {
  title: 'Terra Gentil — Jardinagem com Gentileza',
  description: 'Cuidamos de jardins esquecidos com dedicação e gentileza, valorizando cada espaço. Transformamos quintais esquecidos em espaços vivos.',
  keywords: ['jardinagem', 'transformação de jardins', 'paisagismo', 'Terra Gentil'],
  authors: [{ name: 'Terra Gentil' }],
  openGraph: {
    title: 'Terra Gentil — Jardinagem com Gentileza',
    description: 'Transformando quintais esquecidos em espaços vivos.',
    url: 'https://terragentil.com.br',
    siteName: 'Terra Gentil',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
