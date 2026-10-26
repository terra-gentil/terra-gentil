// Render: abre a página HTML do molde num Chrome sem janela e salva cada slide em PNG 1080x1350.
import fs from 'node:fs';
import path from 'node:path';
import { tratarFoto } from './tratamento-foto.mjs';
import { ajustarTitulos, sombrearCartoes } from './tratamento-texto.mjs';

export const LARGURA = 1080;
export const ALTURA = 1350;

// Recebe vários slides de uma vez e abre o navegador uma só vez (a parte mais lenta).
// Local: TG_CHROME_CANAL=chrome usa o Chrome instalado. No CI: o Chromium do Playwright.
// aoAbrir(pagina, saida) roda com a página pronta, antes do PNG (usado para medir estouro).
// jpeg: true grava também um .jpg (qualidade 92) ao lado de cada PNG.
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
      if (opcoes.tratar !== false) {
        await pagina.evaluate(tratarFoto, { largura: LARGURA, altura: ALTURA });
        await pagina.evaluate(sombrearCartoes);
        await pagina.evaluate(ajustarTitulos, { largura: LARGURA, margem: 56, tamanhoMinimo: 64 });
      }
      if (aoAbrir) await aoAbrir(pagina, saida);
      fs.mkdirSync(path.dirname(saida), { recursive: true });
      const recorte = { x: 0, y: 0, width: LARGURA, height: ALTURA };
      await pagina.screenshot({ path: saida, clip: recorte });
      if (opcoes.jpeg) {
        // O Instagram só aceita JPEG: mesmo slide, ao lado do PNG da prévia.
        const jpg = saida.replace(/\.png$/, '.jpg');
        await pagina.screenshot({ path: jpg, clip: recorte, type: 'jpeg', quality: 92 });
      }
      saidas.push(saida);
    }
    return saidas;
  } finally {
    await navegador.close();
  }
}
