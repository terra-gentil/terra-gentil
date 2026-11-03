// Do roteiro curto ao PDF: gera o JSON no repo, copia fotos provisorias do banco, monta e checa estouro.
// uso: node fazer.mjs curtos/tg004.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const AQUI = import.meta.dirname;
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const BANCO = join(REPO, 'capas/banco');
const EBOOKS = join(process.env.USERPROFILE, 'Documents/Terra Gentil/ebooks');
const spec = join(AQUI, process.argv[2]);
const id = basename(spec, '.mjs');
const json = join(REPO, 'gama-ebooks/roteiros', `${id}.json`);
execFileSync('node', [join(AQUI, 'gerar.mjs'), spec, json], { stdio: 'inherit' });
const { default: s } = await import(pathToFileURL(spec).href);
const pasta = join(EBOOKS, `TG${s.livro.slice(3)}`);
mkdirSync(pasta, { recursive: true });
const noBanco = (arq) => {
  const esp = arq.replace(/-[A-H]-\d\.jpg$/, '');
  const p = join(BANCO, esp, arq);
  return existsSync(p) ? p : null;
};
const roteiro = JSON.parse(readFileSync(json, 'utf8'));
for (const pg of roteiro.paginas) for (const f of pg.fotos ?? []) {
  const dest = join(pasta, f.src);
  if (existsSync(dest) && !noBanco(f.src)) continue; // foto do Flow ja colocada: nao sobrescreve
  const origem = noBanco(f.src) ?? noBanco(s.provisorias?.[f.src] ?? '');
  if (!origem) throw new Error(`sem foto para ${f.src}`);
  copyFileSync(origem, dest);
}
const pdf = join(EBOOKS, `TG${s.livro.slice(3)}-previa.pdf`);
execFileSync('node', [join(REPO, 'gama-ebooks/motor/livro-cli.mjs'), 'montar', json, pasta, pdf],
  { stdio: 'inherit', cwd: REPO });
execFileSync('node', [join(AQUI, 'estouro.mjs'), join(pasta, 'livro.html')], { stdio: 'inherit' });
console.log('fotos:', readdirSync(pasta).filter((f) => f.endsWith('.jpg')).length);
