// Aponta paginas do livro.html cujo conteudo passa da altura de 1920 px ou da largura, com quanto passa.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const { chromium } = createRequire('C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/package.json')('playwright-core');
const nav = await chromium.launch({ channel: 'chrome' });
const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
await pag.goto(pathToFileURL(process.argv[2]).href, { waitUntil: 'networkidle' });
await pag.evaluate(() => document.fonts.ready);
const r = await pag.$$eval('.pg', (pgs) => pgs.map((pg, i) => {
  const caixa = pg.getBoundingClientRect();
  const els = [...pg.querySelectorAll('*')];
  const max = Math.max(...els.map((e) => e.getBoundingClientRect().bottom - caixa.top));
  // texto mais largo que a propria caixa (palavra grande cortada na lateral)
  const largo = els.filter((e) => e.children.length === 0 && e.scrollWidth > e.clientWidth + 2)
    .map((e) => `"${e.textContent.trim().slice(0, 20)}" +${e.scrollWidth - e.clientWidth} px`);
  const fora = Math.max(...els.map((e) => e.getBoundingClientRect().right - caixa.right));
  const msgs = [];
  if (max > 1922) msgs.push(`altura +${Math.round(max - 1920)} px`);
  if (largo.length) msgs.push(`largura ${largo.join(', ')}`);
  else if (fora > 2) msgs.push(`largura +${Math.round(fora)} px`);
  return msgs.length ? `p${i + 1}: ${msgs.join('; ')}` : null;
}).filter(Boolean));
console.log(r.length ? r.join('\n') : 'nenhuma pagina estourada');
await nav.close();
