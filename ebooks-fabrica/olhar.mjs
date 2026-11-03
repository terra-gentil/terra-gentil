// Tira um print reduzido de paginas do livro.html lado a lado. uso: node olhar.mjs <livro.html> <saida.png> 5 7 9
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const { chromium } = createRequire('C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/package.json')('playwright-core');
const [html, png, ...nums] = process.argv.slice(2);
const nav = await chromium.launch({ channel: 'chrome' });
const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
await pag.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
await pag.evaluate(() => document.fonts.ready);
const bufs = [];
for (const n of nums) bufs.push((await (await pag.$$('.pg'))[n - 1].screenshot()).toString('base64'));
const p2 = await nav.newPage({ viewport: { width: 360 * bufs.length, height: 640 } });
await p2.setContent(`<body style="margin:0;display:flex">${bufs.map((b) => `<img style="width:360px" src="data:image/png;base64,${b}">`).join('')}</body>`);
await p2.screenshot({ path: png });
await nav.close();
