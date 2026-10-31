// Linha de comando do motor: extrai o roteiro de um canvas, monta o HTML e imprime o PDF.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { extrairRoteiro, montarLivro } from './montar.mjs';

const CANVAS = fileURLToPath(new URL('../canvas', import.meta.url));
const PROJETO = fileURLToPath(new URL('../..', import.meta.url));
const lerMolde = (arq) => readFileSync(join(CANVAS, arq), 'utf8');

async function imprimir(html, pdf) {
  const { chromium } = createRequire(join(PROJETO, 'package.json'))('playwright-core');
  const nav = await chromium.launch({ channel: 'chrome' });
  const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
  await pag.goto(pathToFileURL(resolve(html)).href, { waitUntil: 'networkidle' });
  await pag.evaluate(() => document.fonts.ready);
  await pag.pdf({ path: pdf, width: '1080px', height: '1920px', printBackground: true });
  await nav.close();
}

const [cmd, a, b, c] = process.argv.slice(2);
if (cmd === 'extrair') {
  const canvas = JSON.parse(readFileSync(join(CANVAS, 'canvas.json'), 'utf8'));
  writeFileSync(a, JSON.stringify(extrairRoteiro(canvas, lerMolde), null, 2) + '\n');
  console.log('roteiro em', a);
} else if (cmd === 'montar') {
  // montar <roteiro.json> <pasta das fotos> <saida.pdf>: o HTML fica na pasta das fotos
  const roteiro = JSON.parse(readFileSync(a, 'utf8'));
  const html = join(b, 'livro.html');
  writeFileSync(html, montarLivro(roteiro, lerMolde));
  await imprimir(html, c);
  console.log(roteiro.paginas.length, 'paginas em', c);
} else {
  console.log('uso: livro-cli.mjs extrair <saida.json> | montar <roteiro.json> <fotos> <pdf>');
  process.exitCode = 1;
}
