// Gera em lote as paginas de livro listadas em scripts/guias/lote.json e aplica o meta (SEO).
// Linha do lote: [codigo, slug, titulo, inicio da descricao]. O fim da descricao e escolhido
// para caber em 140 a 160 caracteres. Uso: node scripts/guias/lote.mjs [TG004 TG005 ...]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FINS = [
  ' Livro grátis do André, com passo a passo e PDF para baixar.',
  ' Livro grátis do André, com PDF para baixar.',
  ' Livro grátis com PDF para baixar.',
  ' Livro grátis em PDF.',
];
const lote = JSON.parse(readFileSync(join('scripts', 'guias', 'lote.json'), 'utf8'));
const so = process.argv.slice(2).map((c) => c.toUpperCase());
const falhas = [];

for (const [codigo, slug, titulo, inicio] of lote) {
  if (so.length && !so.includes(codigo)) continue;
  const descricao = FINS.map((f) => inicio + f).find((d) => d.length >= 140 && d.length <= 160)
    ?? FINS.map((f) => inicio + f).find((d) => d.length <= 160);
  if (!descricao || descricao.length < 140) falhas.push(`${codigo}: descricao fora de 140 a 160 (${(descricao ?? inicio).length})`);
  try {
    execFileSync('node', [join('scripts', 'guias', 'gerar.mjs'), codigo, slug], { stdio: 'inherit' });
  } catch {
    falhas.push(`${codigo}: gerar.mjs falhou`);
    continue;
  }
  const arq = join('data', 'guias', `${slug}.json`);
  const g = JSON.parse(readFileSync(arq, 'utf8'));
  g.meta = { ...g.meta, titulo, descricao: descricao ?? '' };
  writeFileSync(arq, JSON.stringify(g, null, 1) + '\n');
}
if (falhas.length) {
  for (const f of falhas) console.error(`FALHA ${f}`);
  process.exit(1);
}
console.log('Lote gerado.');
