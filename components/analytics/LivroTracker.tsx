'use client';

import { useEffect } from 'react';

interface Props {
  codigo: string;
  slug: string;
}

type Evento = [string, Record<string, unknown>];

/** Parte do livro que a pessoa precisa ter rolado para contar como "leu". */
const LIMITE_LEITURA = 0.75;
const PASSO_MS = 500;
const ESPERA_MAX_MS = 30000;

/**
 * Eventos de uma pagina de livro (/guias/[slug]) no GA4: livro_view, livro_read_75 e
 * livro_download (evento-chave, clique em [data-livro-baixar]). Todos com livro_codigo e
 * content_group "livros". Como o GA carrega com atraso (lazyOnload), os eventos esperam o gtag.
 */
export default function LivroTracker({ codigo, slug }: Props) {
  useEffect(() => {
    const base = { livro_codigo: codigo, livro_slug: slug, content_group: 'livros' };
    const fila: Evento[] = [];
    let temporizador: ReturnType<typeof setInterval> | undefined;
    let grupoMarcado = false;

    const esvaziar = (): boolean => {
      const gtag = window.gtag;
      if (!gtag) return false;
      if (!grupoMarcado) {
        gtag('set', { content_group: 'livros' });
        grupoMarcado = true;
      }
      for (let evento = fila.shift(); evento; evento = fila.shift()) gtag('event', evento[0], evento[1]);
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

    enviar('livro_view');

    let leu = false;
    const aoRolar = () => {
      if (leu) return;
      const texto = document.querySelector('article') ?? document.documentElement;
      const topo = texto.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY + window.innerHeight >= topo + texto.scrollHeight * LIMITE_LEITURA) {
        leu = true;
        enviar('livro_read_75');
      }
    };

    // beacon: o download pode trocar de pagina e o evento nao pode se perder.
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as Element | null)?.closest?.('[data-livro-baixar]');
      if (!alvo) return;
      enviar('livro_download', {
        posicao: alvo.getAttribute('data-livro-baixar'),
        link_url: alvo.getAttribute('href'),
        transport_type: 'beacon',
      });
    };

    window.addEventListener('scroll', aoRolar, { passive: true });
    document.addEventListener('click', aoClicar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      document.removeEventListener('click', aoClicar);
      if (temporizador) clearInterval(temporizador);
    };
  }, [codigo, slug]);

  return null;
}
