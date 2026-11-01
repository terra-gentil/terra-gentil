// Extrai o conteudo de um livro (livro.html da fabrica) sem alterar o texto.
// Uso: node scripts/guias/extrair.mjs TG010
// Saida: JSON no stdout { codigo, titulo, paginas: [{ linhas: string[], fotos: {src, alt}[] }] }
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const EBOOKS = process.env.EBOOKS_DIR || 'C:/Users/engan/Documents/Terra Gentil/ebooks';
const BLOCOS = new Set(['div', 'p', 'h1', 'h2', 'h3', 'h4', 'li', 'section', 'br', 'tr', 'td']);

const SEP = '\u0001';
const RODAPE = [/^Na próxima:/i, /^TG ?\d{3} .+ \d+ DE \d+$/i];

const decodificar = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const attr = (tag, nome) => {
  const m = tag.match(new RegExp(`${nome}="([^"]*)"`));
  return m ? decodificar(m[1]) : '';
};

/** Quebra o HTML de uma pagina em linhas de texto (por bloco) e fotos. */
function lerPagina(html) {
  const linhas = [];
  const fotos = [];
  let buf = '';
  const flush = () => {
    // Celulas de tabela: spans seguidos que comecam em maiuscula/numero viram "a	b	c".
    const partes = decodificar(buf)
      .split(SEP)
      .map((x) => x.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const celulas = partes.length >= 2 && partes.every((x) => /^[A-ZÀ-Ú0-9]/.test(x));
    const t = celulas
      ? partes.join('	')
      : decodificar(buf)
      // fronteira entre spans vira espaco, exceto antes de pontuacao (", sempre")
      .replace(new RegExp(`${SEP}(?=[,.;:?!)])`, 'g'), '')
      .replace(new RegExp(SEP, 'g'), ' ')
      .replace(/\s+/g, ' ')
      .trim();
    // rodape de navegacao do PDF, nao e conteudo do livro
    if (t && !RODAPE.some((r) => r.test(t.replace(/	/g, ' ')))) linhas.push(t);
    buf = '';
  };
  for (const parte of html.split(/(<[^>]+>)/)) {
    if (!parte) continue;
    if (parte.startsWith('<')) {
      const nome = (parte.match(/^<\/?\s*([a-z0-9]+)/i) || [])[1]?.toLowerCase();
      if (nome === 'img') {
        flush();
        fotos.push({ src: attr(parte, 'src'), alt: attr(parte, 'alt') });
      } else if (nome && BLOCOS.has(nome)) flush();
      else if (nome) buf += SEP;
    } else buf += parte;
  }
  flush();
  return { linhas, fotos };
}

export function extrairLivro(codigo) {
  const arquivo = join(EBOOKS, codigo, 'livro.html');
  if (!existsSync(arquivo)) throw new Error(`Sem ${arquivo}`);
  const html = readFileSync(arquivo, 'utf8');
  const corpo = html.split('<body>')[1] ?? html;
  const paginas = corpo
    .split(/<section class="pg">/)
    .slice(1)
    .map((p) => lerPagina(p.replace(/<\/section>[\s\S]*$/, '')));
  const titulo = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] ?? '';
  return { codigo, titulo: decodificar(titulo), paginas };
}

if (process.argv[1] && process.argv[1].endsWith('extrair.mjs')) {
  const codigo = (process.argv[2] || '').toUpperCase();
  if (!/^TG\d{3}$/.test(codigo)) {
    console.error('Uso: node scripts/guias/extrair.mjs TGNNN');
    process.exit(1);
  }
  console.log(JSON.stringify(extrairLivro(codigo), null, 1));
}
