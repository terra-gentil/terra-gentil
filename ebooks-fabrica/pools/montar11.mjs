// Leva 11 (TG 129 a 142): separa fatos livres por livro. Uso: node pools/montar11.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
const esp = (re) => (id, f) => re.test(f.esp);
const LIVROS = [
  ['129', 'Mato que Conta', (id) => /^e22-/.test(id)],
  ['130', 'Sarracenia', (id, f) => /^d38-/.test(id) && /^sarracenia$/.test(f.esp)],
  ['131', 'Drosera', (id, f) => /^d38-/.test(id) && /^drosera$/.test(f.esp)],
  ['132', 'Pinguicula', (id, f) => /^d38-/.test(id) && /^pinguicula$/.test(f.esp)],
  ['133', 'Nepenthes', (id, f) => /^d38-/.test(id) && /^nepenthes$/.test(f.esp)],
  ['134', 'Utricularia e Byblis', (id, f) => /^d38-/.test(id) && /^(utricularia|byblis)$/.test(f.esp)],
  ['135', 'Dioneia e Aldrovanda', (id, f) => /^d38-/.test(id) && /^(venus|aldrovanda)$/.test(f.esp)],
  ['136', 'Cephalotus e Drosophyllum', (id, f) => /^d38-/.test(id) && /^(cephalotus|drosophyllum)$/.test(f.esp)],
  ['137', 'Carnivoras no Vaso', (id, f) => (/^d38-/.test(id) && /^carnivora$/.test(f.esp)) || (/^q3-/.test(id) && /carn/.test(f.esp))],
  ['138', 'Bonsai Primeiros Passos', null],
  ['139', 'Bonsai Poda e Estilo', null],
  ['140', 'Hortensias', (id) => /^h41-/.test(id)],
  ['141', 'Terrario', (id, f) => /^t40-/.test(id) && f.esp !== 'bonsai' && !/sarrac/.test(f.esp)],
  ['142', 'Plantas Jarro Raras', (id, f) => (/^d38-/.test(id) && /^(heliamphora|cobra-plant)$/.test(f.esp)) || (/^t40-/.test(id) && /sarrac/.test(f.esp))],
];
const bons = livres.filter(([id, f]) => /^(b39|t40)-/.test(id) && f.esp === 'bonsai').map(([id]) => id);
const meta = Math.ceil(bons.length / 2);
const cont = {};
for (const [n, titulo, fn] of LIVROS) {
  let ids;
  if (n === '138') ids = bons.slice(0, meta);
  else if (n === '139') ids = bons.slice(meta);
  else ids = livres.filter(([id, f]) => fn(id, f)).map(([id]) => id);
  const linhas = ids.map((id) => `${id} [${fatos[id].esp}|${fatos[id].serie}] ${fatos[id].texto}`);
  writeFileSync(`${import.meta.dirname}/pool11-${n}.txt`, `# TG ${n} ${titulo}: ${linhas.length} fatos (so estes)\n${linhas.join('\n')}\n`);
  cont[`${n} ${titulo}`] = linhas.length;
}
console.log(cont);
