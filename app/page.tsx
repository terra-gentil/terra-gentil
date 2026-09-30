import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Videos from '@/components/sections/Videos';
import Doutor from '@/components/sections/Doutor';
import AppPromo from '@/components/sections/AppPromo';
import Manifesto from '@/components/sections/Manifesto';
import Transformations from '@/components/sections/Transformations';
import Game from '@/components/sections/Game';
import About from '@/components/sections/About';
import Ebooks from '@/components/sections/Ebooks';
import Instagram from '@/components/sections/Instagram';
import Newsletter from '@/components/sections/Newsletter';
import type { Metadata } from 'next';
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  TIKTOK_URL,
  YOUTUBE_URL,
} from '@/lib/constants';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// JSON-LD da home: Organization (quem e o Terra Gentil, perfis oficiais) e WebSite.
// sameAs usa as constantes, entao trocar o canal do YouTube atualiza aqui tambem.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      email: CONTACT_EMAIL,
      sameAs: [YOUTUBE_URL, INSTAGRAM_URL, TIKTOK_URL],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // escapa "<" pra nenhum texto fechar a tag script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <Marquee />
      <Videos />
      <Doutor />
      <AppPromo />
      <Manifesto />
      <Transformations />
      <Game />
      <About />
      <Ebooks />
      <Instagram />
      <Newsletter />
    </>
  );
}
