import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import NewsTracker from './NewsTracker';

const props = { slug: 'jiboia', serie: '3 erros', livro: 'O Código' };

function pagina() {
  return render(
    <>
      <NewsTracker {...props} />
      <article>
        <a href="/ebooks/a.pdf" data-cta="ebook">
          ebook
        </a>
        <a href="https://instagram.com/x" data-cta="instagram">
          insta
        </a>
        <a href="/outra">outra</a>
      </article>
    </>,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  delete window.gtag;
});

describe('NewsTracker', () => {
  it('manda news_view com slug, série, livro e grupo assim que o gtag existe', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    pagina();
    expect(gtag).toHaveBeenCalledWith('set', { content_group: 'noticias' });
    expect(gtag).toHaveBeenCalledWith('event', 'news_view', {
      news_slug: 'jiboia',
      serie: '3 erros',
      livro: 'O Código',
      content_group: 'noticias',
    });
  });

  it('espera o gtag carregar (lazyOnload) e só então envia, sem perder o evento', () => {
    pagina();
    const gtag = vi.fn();
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(gtag).not.toHaveBeenCalled();
    window.gtag = gtag;
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(gtag).toHaveBeenCalledWith('event', 'news_view', expect.objectContaining({ news_slug: 'jiboia' }));
  });

  it('clique no ebook e no Instagram vira evento; link comum não', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    const { getByText } = pagina();
    gtag.mockClear();
    act(() => {
      getByText('ebook').click();
      getByText('insta').click();
      getByText('outra').click();
    });
    const nomes = gtag.mock.calls.filter((c) => c[0] === 'event').map((c) => c[1]);
    expect(nomes).toEqual(['cta_ebook_click', 'cta_instagram_click']);
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'cta_ebook_click',
      expect.objectContaining({ link_url: '/ebooks/a.pdf', transport_type: 'beacon' }),
    );
  });

  it('news_read_75 sai uma vez só, ao passar de 75% do texto', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    const article = pagina().container.ownerDocument.querySelector('article') as HTMLElement;
    vi.spyOn(article, 'scrollHeight', 'get').mockReturnValue(4000);
    // No navegador o top do texto diminui conforme a página rola.
    vi.spyOn(article, 'getBoundingClientRect').mockImplementation(
      () => ({ top: -window.scrollY }) as DOMRect,
    );
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    gtag.mockClear();

    const rolar = (y: number) =>
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
        window.dispatchEvent(new Event('scroll'));
      });
    rolar(1000); // vê até 1800 de 4000: ainda não
    expect(gtag).not.toHaveBeenCalled();
    rolar(2300); // vê até 3100, passou de 3000
    rolar(3200);
    const lidos = gtag.mock.calls.filter((c) => c[1] === 'news_read_75');
    expect(lidos).toHaveLength(1);
  });
});
