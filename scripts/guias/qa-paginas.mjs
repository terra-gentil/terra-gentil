// Roda o QA de contraste (qa-contraste.js) nas paginas de livro publicadas, sem precisar da extensao do Chrome.
// Uso: node scripts/guias/qa-paginas.mjs slug1 slug2 ... [--base=https://terragentil.com.br]
// Sem slug: todas as paginas de data/guias. Sai com codigo 1 se alguma pagina nao passar.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith('--base=')) ?? '--base=https://terragentil.com.br').slice(7).replace(/\/$/, '');
let slugs = args.filter((a) => !a.startsWith('--'));
if (!slugs.length) slugs = readdirSync(join('data', 'guias')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));

const { chromium } = createRequire(join(process.cwd(), 'insta-terra-gentil', 'package.json'))('playwright-core');
const script = readFileSync(join('scripts', 'guias', 'qa-contraste.js'), 'utf8');

const nav = await chromium.launch({ channel: 'chrome' });
const pag = await nav.newPage({ viewport: { width: 390, height: 844 } });
const falhas = [];
for (const slug of slugs) {
  const res = await pag.goto(`${base}/guias/${slug}`, { waitUntil: 'networkidle' });
  if (!res || !res.ok()) {
    falhas.push(`${slug}: pagina respondeu ${res?.status()}`);
    console.log(`FALHA ${slug}: ${res?.status()}`);
    continue;
  }
  await pag.evaluate(() => document.fonts.ready);
  const r = await pag.evaluate(script);
  const ok = r === 'ok' || (typeof r === 'string' && r.startsWith('ok'));
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${slug}${ok ? '' : ' -> ' + JSON.stringify(r).slice(0, 400)}`);
  if (!ok) falhas.push(slug);
}
await nav.close();
console.log(`${slugs.length - falhas.length} de ${slugs.length} ok`);
process.exit(falhas.length ? 1 : 0);
