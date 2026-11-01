// Checagem automatica das paginas de livro (SEO e qualidade) antes de publicar.
// Uso: node scripts/guias/checar.mjs   (sai com codigo 1 se algo reprovar)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PASTA = join(process.cwd(), 'data', 'guias');
const MARCA = ' · Terra Gentil';
const MIN_PALAVRAS = 300;
const MAX_KB_FOTO = 300;
const SIMILARIDADE_MAX = 0.6;

const arquivos = existsSync(PASTA) ? readdirSync(PASTA).filter((a) => a.endsWith('.json')) : [];
const guias = arquivos.map((a) => JSON.parse(readFileSync(join(PASTA, a), 'utf8')));
const falhas = [];
const avisos = [];

const palavras = (g) =>
  g.paginas
    .flatMap((p) => p.linhas)
    .join(' ')
    .replace(/\t/g, ' ')
    .toLowerCase()
    .split(/[^a-zà-ú0-9]+/)
    .filter(Boolean);

const trigramas = (ws) => {
  const s = new Set();
  for (let i = 0; i < ws.length - 2; i++) s.add(ws.slice(i, i + 3).join(' '));
  return s;
};

for (const g of guias) {
  const id = `${g.codigo} (${g.slug})`;
  const erro = (m) => falhas.push(`${id}: ${m}`);

  const comMarca = `${g.meta.titulo}${MARCA}`;
  const tituloFinal = comMarca.length > 60 ? g.meta.titulo : comMarca;
  if (tituloFinal.length > 60) erro(`titulo com ${tituloFinal.length} caracteres (max 60)`);
  if (g.meta.titulo.length < 20) erro('titulo curto demais (min 20)');

  const d = g.meta.descricao.length;
  if (d < 140 || d > 160) erro(`descricao com ${d} caracteres (ideal 140 a 160)`);

  if (!/^[a-z0-9-]+$/.test(g.slug)) erro('slug invalido');
  if (!g.meta.pdf) erro('sem nome do PDF');
  if (!g.capa) erro('sem capa do livro (miniatura do botao)');

  const total = palavras(g).length;
  if (total < MIN_PALAVRAS) erro(`so ${total} palavras (min ${MIN_PALAVRAS})`);

  const fotos = [...g.paginas.flatMap((p) => p.fotos), ...(g.capa ? [g.capa] : [])];
  for (const f of fotos) {
    if (!f.alt || f.alt.trim().length < 5) erro(`foto sem texto alternativo: ${f.src}`);
    const arq = join(process.cwd(), 'public', f.src);
    if (!existsSync(arq)) erro(`foto nao existe: ${f.src}`);
    else if (statSync(arq).size > MAX_KB_FOTO * 1024) erro(`foto acima de ${MAX_KB_FOTO} KB: ${f.src}`);
  }

  const texto = JSON.stringify([g.meta, g.paginas.map((p) => p.linhas)]);
  if (/[—–]/.test(texto)) erro('travessao no texto');
}

// Conteudo parecido demais entre dois livros e o que o Google chama de conteudo em escala.
for (let i = 0; i < guias.length; i++) {
  for (let j = i + 1; j < guias.length; j++) {
    const a = trigramas(palavras(guias[i]));
    const b = trigramas(palavras(guias[j]));
    let comum = 0;
    for (const t of a) if (b.has(t)) comum++;
    const sim = comum / Math.min(a.size, b.size || 1);
    if (sim > SIMILARIDADE_MAX) falhas.push(`${guias[i].codigo} e ${guias[j].codigo}: ${Math.round(sim * 100)}% de texto igual`);
    else if (sim > 0.35) avisos.push(`${guias[i].codigo} e ${guias[j].codigo}: ${Math.round(sim * 100)}% de texto parecido`);
  }
}

console.log(`${guias.length} pagina(s) de livro verificada(s).`);
for (const a of avisos) console.warn(`AVISO ${a}`);
if (falhas.length) {
  for (const f of falhas) console.error(`FALHA ${f}`);
  process.exit(1);
}
console.log('Tudo certo.');
