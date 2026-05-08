import type { Metadata } from 'next';
import Link from 'next/link';
import { Gamepad2, ArrowLeft, ExternalLink } from 'lucide-react';
import { GAME_ENABLED, GAME_URL, SITE_NAME } from '@/lib/constants';
import { buildGameUrl } from '@/lib/game';

export const metadata: Metadata = {
  title: `Jogo Gentileza — ${SITE_NAME}`,
  description:
    'Jogue Gentileza: Resgate dos Jardins. Pixel art, mobile-first, ranking mundial. Ajude o mascote da Terra Gentil a salvar quintais esquecidos.',
  // Enquanto G10 nao fecha, evitamos indexar a pagina pra nao confundir Google.
  robots: GAME_ENABLED ? undefined : { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ nickname?: string }>;
}

export default async function JogoPage({ searchParams }: PageProps) {
  const { nickname } = await searchParams;

  if (!GAME_ENABLED) {
    return <ComingSoon />;
  }

  const src = buildGameUrl(nickname);

  return (
    <section className="bg-terra-900 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-terra-800 text-terra-100">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:text-terra-300 transition"
        >
          <ArrowLeft size={16} />
          Voltar ao site
        </Link>
        <a
          href={GAME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm hover:text-terra-300 transition"
        >
          Abrir em tela cheia
          <ExternalLink size={14} />
        </a>
      </div>

      {/*
        ADR: iframe SEM atributo `sandbox`. Decisao consciente.
        - O jogo precisa de localStorage (settings + cache de nickname) e
          Web Audio API (SFX). sandbox basico bloqueia ambos.
        - Origem do iframe e https://terra-gentil.github.io, repo nosso.
        - Mitigacao adicional: CSP frame-src no next.config.ts limita pra essa origem.
        Se um dia hospedarmos em terceiro nao confiavel, reavaliar com sandbox
        + allow-scripts allow-same-origin allow-forms.
      */}
      <div className="flex-1 relative bg-black">
        <iframe
          src={src}
          title="Gentileza: Resgate dos Jardins"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen; autoplay; accelerometer; gyroscope"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
        />
      </div>
    </section>
  );
}

function ComingSoon() {
  return (
    <section className="bg-gradient-to-br from-terra-50 to-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-terra-100 text-terra-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <Gamepad2 size={14} />
          <span>Em breve</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mb-4">
          Gentileza: Resgate dos Jardins
        </h1>
        <p className="text-lg text-terra-700 mb-8 leading-relaxed">
          Um jogo pixel-art onde voce ajuda o mascote Gentileza a transformar quintais esquecidos em
          espacos vivos. Mobile-first, com ranking mundial. Estamos polindo os ultimos detalhes pra
          estreia.
        </p>

        <div className="bg-white rounded-2xl border border-terra-100 p-6 md:p-8 text-left max-w-2xl mx-auto mb-8">
          <h2 className="font-bold text-terra-900 text-lg mb-3">O que vem por ai</h2>
          <ul className="space-y-2 text-terra-700 text-sm leading-relaxed">
            <li>10 fases inspiradas no classico Lawn Mower NES (Shiru, 2011, dominio publico)</li>
            <li>D-pad virtual otimizado pra celular em paisagem</li>
            <li>Ranking mundial com seu apelido</li>
            <li>Modo &quot;olhos cansados&quot; pra contraste alto</li>
            <li>Audio sintetizado, ate o FamiStudio entrar em cena</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-terra-700 hover:bg-terra-800 text-white px-6 py-3 rounded-full font-medium transition"
          >
            <ArrowLeft size={18} />
            Voltar ao inicio
          </Link>
          <a
            href={GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-terra-50 text-terra-800 px-6 py-3 rounded-full font-medium border-2 border-terra-200 transition"
          >
            Espiar a versao em testes
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
