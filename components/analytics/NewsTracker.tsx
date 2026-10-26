'use client';

import { useEffect } from 'react';

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
  }
}

interface Props {
  slug: string;
  serie: string;
  livro: string;
}

type Evento = [string, Record<string, unknown>];

/** Clique em [data-cta="..."] vira este evento do GA4. cta_ebook_click é o evento-chave. */
export const EVENTO_CTA: Record<string, string> = {
  ebook: 'cta_ebook_click',
  instagram: 'cta_instagram_click',
};

/** Parte do texto da notícia que a pessoa precisa ter rolado para contar como "leu". */
export const LIMITE_LEITURA = 0.75;

const PASSO_MS = 500;
const ESPERA_MAX_MS = 30000;

/**
 * Eventos de uma notícia no GA4: news_view, news_read_75, cta_ebook_click e cta_instagram_click.
 * O GA carrega com atraso (lazyOnload) para não pesar a velocidade, então os eventos esperam o
 * gtag existir em vez de forçar o carregamento antes da hora.
 */
export default function NewsTracker({ slug, serie, livro }: Props) {
  useEffect(() => {
    const base = { news_slug: slug, serie, livro, content_group: 'noticias' };
    const fila: Evento[] = [];
    let temporizador: ReturnType<typeof setInterval> | undefined;
    let grupoMarcado = false;

    const esvaziar = (): boolean => {
      const gtag = window.gtag;
      if (!gtag) return false;
      if (!grupoMarcado) {
        gtag('set', { content_group: 'noticias' });
        grupoMarcado = true;
      }
      for (let evento = fila.shift(); evento; evento = fila.shift()) {
        gtag('event', evento[0], evento[1]);
      }
      return true;
    };

    const enviar = (nome: string, extra: Record<string, unknown> = {}) => {
      fila.push([nome, { ...base, ...extra }]);
      if (esvaziar() || temporizador) return;
      let esperado = 0;
      temporizador = setInterval(() => {
        esperado += PASSO_MS;
        if (esvaziar() || esperado >= ESPERA_MAX_MS) {
          clearInterval(temporizador);
          temporizador = undefined;
        }
      }, PASSO_MS);
    };

    enviar('news_view');

    // Mede a rolagem só no texto da notícia (o rodapé do site não conta).
    let leu = false;
    const aoRolar = () => {
      if (leu) return;
      const texto = document.querySelector('article') ?? document.documentElement;
      const topo = texto.getBoundingClientRect().top + window.scrollY;
      const meta = topo + texto.scrollHeight * LIMITE_LEITURA;
      if (window.scrollY + window.innerHeight >= meta) {
        leu = true;
        enviar('news_read_75');
      }
    };

    // beacon: o PDF do ebook abre na mesma aba e o evento não pode se perder na troca de página.
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as Element | null)?.closest?.('[data-cta]');
      const nome = EVENTO_CTA[alvo?.getAttribute('data-cta') ?? ''];
      if (!alvo || !nome) return;
      enviar(nome, { link_url: alvo.getAttribute('href'), transport_type: 'beacon' });
    };

    window.addEventListener('scroll', aoRolar, { passive: true });
    document.addEventListener('click', aoClicar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      document.removeEventListener('click', aoClicar);
      if (temporizador) clearInterval(temporizador);
    };
  }, [slug, serie, livro]);

  return null;
}
