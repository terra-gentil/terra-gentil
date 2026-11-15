import { readFileSync, readdirSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const R = `${REPO}/gama-ebooks/roteiros`;
const CURTOS = `${import.meta.dirname}/../curtos`;
const usados = new Set();
for (const a of readdirSync(R).filter((x) => x.endsWith('.json')))
  for (const p of JSON.parse(readFileSync(`${R}/${a}`, 'utf8')).paginas) for (const f of p.fatos ?? []) usados.add(f);
for (const a of readdirSync(CURTOS).filter((x) => x.endsWith('.mjs')))
  for (const m of readFileSync(`${CURTOS}/${a}`, 'utf8').matchAll(/f:\s*\[([^\]]*)\]/g))
    for (const id of m[1].matchAll(/'([^']+)'/g)) usados.add(id[1]);
const fatos = JSON.parse(readFileSync(`${REPO}/dados/biblia.json`, 'utf8')).fatos;
const livres = Object.entries(fatos).filter(([id]) => !usados.has(id));
console.log('usados', usados.size, 'livres', livres.length, 'curtos', readdirSync(CURTOS).length);
const c = {}; const s = {};
for (const [id, f] of livres) { c[f.esp] = (c[f.esp] || 0) + 1; const k = id.split('-')[0]; s[k] = (s[k] || 0) + 1; }
console.log(Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ':' + v).join(' '));
console.log(Object.entries(s).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ':' + v).join(' '));
console.log(JSON.stringify(livres[0]), JSON.stringify(livres[900]));
