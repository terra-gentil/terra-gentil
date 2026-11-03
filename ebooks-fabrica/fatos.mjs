// lista fatos nao usados: node fatos.mjs <regex de esp> [regex de id] [regex de texto]
import { readFileSync, readdirSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const R = `${REPO}/gama-ebooks/roteiros`;
const usados = new Set();
for (const a of readdirSync(R).filter((x) => x.endsWith('.json')))
  for (const p of JSON.parse(readFileSync(`${R}/${a}`, 'utf8')).paginas) for (const f of p.fatos ?? []) usados.add(f);
const fatos = JSON.parse(readFileSync(`${REPO}/dados/biblia.json`, 'utf8')).fatos;
const [e, i, t] = process.argv.slice(2).map((x) => (x ? new RegExp(x, 'i') : null));
for (const [id, f] of Object.entries(fatos)) {
  if (usados.has(id)) continue;
  if (e && !e.test(f.esp)) continue;
  if (i && !i.test(id)) continue;
  if (t && !t.test(f.texto)) continue;
  console.log(`${id} [${f.esp}|${f.serie}] ${f.texto}`);
}
