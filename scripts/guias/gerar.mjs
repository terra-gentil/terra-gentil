// Gera data/guias/<slug>.json e public/guias/<slug>/*.webp a partir de um livro da fabrica.
// Uso: node scripts/guias/gerar.mjs TG010 suculentas-sem-afogar
// Nao reescreve o livro: copia o texto e as fotos. O bloco "meta" (SEO) pode ser ajustado a mao.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { extrairLivro } from './extrair.mjs';

const EBOOKS = process.env.EBOOKS_DIR || 'C:/Users/engan/Documents/Terra Gentil/ebooks';
const [codigoArg, slug] = process.argv.slice(2);
const codigo = (codigoArg || '').toUpperCase();
if (!/^TG\d{3}$/.test(codigo) || !/^[a-z0-9-]+$/.test(slug || '')) {
  console.error('Uso: node scripts/guias/gerar.mjs TGNNN slug-do-livro');
  process.exit(1);
}

// Chrome do playwright que a fabrica ja usa (insta-terra-gentil).
const { chromium } = createRequire(join(process.cwd(), 'insta-terra-gentil', 'package.json'))('playwright-core');
const livro = extrairLivro(codigo);
const pasta = join(EBOOKS, codigo);
const saidaFotos = join('public', 'guias', slug);
mkdirSync(saidaFotos, { recursive: true });
mkdirSync(join('data', 'guias'), { recursive: true });

// Foto -> webp 1000px (qualidade 68). Nome do arquivo vem do original.
const feitas = new Map();
async function otimizar(src) {
  if (feitas.has(src)) return feitas.get(src);
  const nome = `${basename(src, extname(src))}.webp`;
  const origem = join(pasta, src);
  if (!existsSync(origem)) throw new Error(`Foto ausente: ${origem}`);
  const info = await sharp(origem)
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 68, effort: 6 })
    .toFile(join(saidaFotos, nome));
  const ref = { src: `/guias/${slug}/${nome}`, largura: info.width, altura: info.height, kb: Math.round(info.size / 1024) };
  feitas.set(src, ref);
  return ref;
}

// Capa do livro = pagina 1 renderizada do livro.html (miniatura do botao de download).
async function renderizarCapa() {
  const nav = await chromium.launch({ channel: 'chrome' });
  const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
  await pag.goto(pathToFileURL(join(pasta, 'livro.html')).href, { waitUntil: 'networkidle' });
  await pag.evaluate(() => document.fonts.ready);
  const png = await (await pag.$$('.pg'))[0].screenshot();
  await nav.close();
  const info = await sharp(png).resize({ width: 520 }).webp({ quality: 80, effort: 6 }).toFile(join(saidaFotos, 'capa.webp'));
  return { src: `/guias/${slug}/capa.webp`, largura: info.width, altura: info.height, alt: `Capa do livro ${livro.titulo}` };
}
const capa = await renderizarCapa();

const paginas = [];
for (const [i, p] of livro.paginas.entries()) {
  const fotos = [];
  for (const f of p.fotos) fotos.push({ ...(await otimizar(f.src)), alt: f.alt });
  paginas.push({ n: i + 1, linhas: p.linhas, fotos });
}

const arquivo = join('data', 'guias', `${slug}.json`);
// Preserva o bloco "meta" se ja foi ajustado a mao.
const meta = existsSync(arquivo)
  ? JSON.parse(readFileSync(arquivo, 'utf8')).meta
  : { titulo: livro.titulo, descricao: '', pdf: `${codigo}.pdf`, atualizado: new Date().toISOString().slice(0, 10) };

writeFileSync(arquivo, JSON.stringify({ codigo, slug, titulo: livro.titulo, capa, meta, paginas }, null, 1) + '\n');
const grandes = [...feitas.values()].filter((f) => f.kb > 300);
console.log(`${codigo} -> ${arquivo}: ${paginas.length} paginas, ${feitas.size} fotos.`);
if (grandes.length) console.warn(`ATENCAO: ${grandes.length} foto(s) acima de 300 KB:`, grandes.map((g) => `${g.src} ${g.kb}KB`).join(', '));
