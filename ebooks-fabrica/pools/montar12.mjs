// Leva 12 (TG 143 em diante): separa os fatos AINDA livres depois da Leva 11.
// Usados = roteiros json + curtos/*.mjs (inclui tg129 a tg142) + ids reservados nos pools de leva anterior (so pool11, cujos sobrados ficaram reservados aos livros 129 a 142).
// Uso: node pools/montar12.mjs            (resumo dos livres por tema)
//      node pools/montar12.mjs gerar      (escreve pool12-NNN.txt conforme LIVROS12 abaixo)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const R = `${REPO}/gama-ebooks/roteiros`;
const D = import.meta.dirname;
const CURTOS = `${D}/../curtos`;
const usados = new Set();
for (const a of readdirSync(R).filter((x) => x.endsWith('.json')))
  for (const p of JSON.parse(readFileSync(`${R}/${a}`, 'utf8')).paginas) for (const f of p.fatos ?? []) usados.add(f);
const curtos = readdirSync(CURTOS).filter((x) => x.endsWith('.mjs'));
for (const a of curtos)
  for (const m of readFileSync(`${CURTOS}/${a}`, 'utf8').matchAll(/f:\s*\[([^\]]*)\]/g))
    for (const id of m[1].matchAll(/'([^']+)'/g)) usados.add(id[1]);
for (const a of readdirSync(D).filter((x) => /^pool11-\d+\.txt$/.test(x)))
  for (const l of readFileSync(`${D}/${a}`, 'utf8').split('\n')) { const m = l.match(/^([a-z]\d+-\d+) /); if (m) usados.add(m[1]); }
const temTg = (n) => curtos.includes(`tg${n}.mjs`);
const fatos = JSON.parse(readFileSync(`${REPO}/dados/biblia.json`, 'utf8')).fatos;
const livres = Object.entries(fatos).filter(([id]) => !usados.has(id));
console.log('curtos tg129 a tg142 presentes:', [...Array(14).keys()].every((i) => temTg(129 + i)), '| usados', usados.size, '| livres', livres.length);

// Cada livro: [numero, titulo, filtro(id, f)]. Preencher apos analise.
let LIVROS12 = [];
try { LIVROS12 = (await import('./livros12.mjs')).default; } catch {}
if (process.argv[2] !== 'gerar') {
  const c = {};
  for (const [, f] of livres) c[f.esp] = (c[f.esp] || 0) + 1;
  console.log(Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => `${k}:${v}`).join(' '));
} else {
  const tomados = new Set(); const cont = {};
  for (const [n, titulo, fn] of LIVROS12) {
    const ids = livres.filter(([id, f]) => !tomados.has(id) && fn(id, f)).map(([id]) => id);
    ids.forEach((i) => tomados.add(i));
    const linhas = ids.map((id) => `${id} [${fatos[id].esp}|${fatos[id].serie}] ${fatos[id].texto}`);
    writeFileSync(`${D}/pool12-${n}.txt`, `# TG ${n} ${titulo}: ${linhas.length} fatos (so estes)\n${linhas.join('\n')}\n`);
    cont[`${n} ${titulo}`] = linhas.length;
  }
  console.log(cont, 'sobram', livres.length - tomados.size);
}
