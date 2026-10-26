// Mede, na página já renderizada, quais textos passam da borda do slide (cortados no PNG).
import { ALTURA, LARGURA } from './render.mjs';

const FOLGA = 2;

// Roda dentro do Chrome: só elementos com texto próprio, comparando a caixa real com o slide.
function textosFora({ largura, altura, folga }) {
  const fora = [];
  for (const el of document.body.querySelectorAll('*')) {
    const temTexto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!temTexto) continue;
    const caixa = el.getBoundingClientRect();
    if (caixa.width === 0 && caixa.height === 0) continue;
    const passou =
      caixa.bottom > altura + folga ||
      caixa.right > largura + folga ||
      caixa.left < -folga ||
      caixa.top < -folga;
    if (passou) fora.push(el.textContent.trim().slice(0, 40));
  }
  return fora;
}

export function medirEstouro(pagina) {
  return pagina.evaluate(textosFora, { largura: LARGURA, altura: ALTURA, folga: FOLGA });
}
