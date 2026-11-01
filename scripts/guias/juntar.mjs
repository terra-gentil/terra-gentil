// Junta o material de um livro da fabrica para escrever a pagina do site.
// Uso: node scripts/guias/juntar.mjs tg010
// Le: fabrica/curtos/<tg>.mjs, fabrica/f-*.txt. Imprime o material em texto.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const FABRICA = process.env.FABRICA_DIR || 'C:/Users/engan/Documents/Terra Gentil/ebooks/fabrica';
const EBOOKS = join(FABRICA, '..');

const codigo = (process.argv[2] || '').toLowerCase();
if (!/^tg\d{3}$/.test(codigo)) {
  console.error('Uso: node scripts/guias/juntar.mjs tgNNN');
  process.exit(1);
}

// id -> texto, de todos os f-*.txt
const fatos = new Map();
for (const arq of readdirSync(FABRICA).filter((a) => /^f-.*\.txt$/.test(a))) {
  for (const linha of readFileSync(join(FABRICA, arq), 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^([a-z0-9]+-\d+) \| (.+)$/);
    if (m && !fatos.has(m[1])) fatos.set(m[1], m[2].trim());
  }
}

const caminho = join(FABRICA, 'curtos', `${codigo}.mjs`);
if (!existsSync(caminho)) {
  console.error(`Sem roteiro em ${caminho}`);
  process.exit(1);
}
const livro = (await import(pathToFileURL(caminho).href)).default;
const pasta = join(EBOOKS, codigo.toUpperCase());

console.log(`# ${livro.livro} ${livro.titulo}`);
console.log(`Pasta das fotos: ${pasta}`);
console.log(`Paginas: ${livro.paginas.length}\n`);

const usados = new Set();
livro.paginas.forEach((p, i) => {
  console.log(`## Pagina ${i + 1}${p.n ? ` (${p.n})` : ''}`);
  if (p.t) console.log(`TEXTO NA PAGINA: ${p.t.join(' / ')}`);
  for (const id of p.f || []) {
    usados.add(id);
    console.log(`FATO ${id}: ${fatos.get(id) ?? '(nao achado)'}`);
  }
  for (const [foto, alt] of p.p || []) console.log(`FOTO ${foto}: ${alt}`);
  console.log('');
});
console.log(`Fatos usados: ${usados.size}`);
