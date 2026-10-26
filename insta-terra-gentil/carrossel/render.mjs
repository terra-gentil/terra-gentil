// Render: abre a página HTML do molde num Chrome sem janela e salva cada slide em PNG 1080x1350.
import fs from 'node:fs';
import path from 'node:path';

export const LARGURA = 1080;
export const ALTURA = 1350;

// Desfoque de legibilidade: borra e escurece a foto por trás do texto, mais forte embaixo, onde
// ficam as faixas. Entra logo depois das camadas da foto e do véu, antes do texto. Roda na página.
export function aplicarDesfoque() {
  const foto = document.querySelector('img[style*="object-fit"]');
  const base = foto?.parentElement?.matches('[style*="inset: 0"]') ? foto.parentElement : foto;
  if (!base) return false;
  let ultima = base;
  while (ultima.nextElementSibling?.getAttribute('style')?.includes('inset: 0')) {
    ultima = ultima.nextElementSibling;
  }
  const camada = document.createElement('div');
  camada.setAttribute('data-desfoque', '');
  const mascara = 'linear-gradient(to bottom, transparent 12%, #000 45%)';
  camada.style.cssText = `position:absolute;inset:0;backdrop-filter:blur(10px);` +
    `background:rgba(11,20,16,0.3);-webkit-mask-image:${mascara};mask-image:${mascara}`;
  ultima.after(camada);
  return true;
}

// Recebe vários slides de uma vez e abre o navegador uma só vez (a parte mais lenta).
// Local: TG_CHROME_CANAL=chrome usa o Chrome instalado. No CI: o Chromium do Playwright.
// aoAbrir(pagina, saida) roda com a página pronta, antes do PNG (usado para medir estouro).
export async function renderizar(paginas, opcoes = {}) {
  const { canal = process.env.TG_CHROME_CANAL, aoAbrir } = opcoes;
  const { chromium } = await import('playwright-core');
  const navegador = await chromium.launch({ channel: canal || undefined });
  try {
    const pagina = await navegador.newPage({ viewport: { width: LARGURA, height: ALTURA } });
    const saidas = [];
    for (const { html, saida } of paginas) {
      await pagina.setContent(html, { waitUntil: 'networkidle' });
      await pagina.evaluate(() => document.fonts.ready);
      if (opcoes.desfoque !== false) await pagina.evaluate(aplicarDesfoque);
      if (aoAbrir) await aoAbrir(pagina, saida);
      fs.mkdirSync(path.dirname(saida), { recursive: true });
      const recorte = { x: 0, y: 0, width: LARGURA, height: ALTURA };
      await pagina.screenshot({ path: saida, clip: recorte });
      saidas.push(saida);
    }
    return saidas;
  } finally {
    await navegador.close();
  }
}
