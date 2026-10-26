// Render: abre a página HTML do molde num Chrome sem janela e salva cada slide em PNG 1080x1350.
import fs from 'node:fs';
import path from 'node:path';

export const LARGURA = 1080;
export const ALTURA = 1350;

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
