import fs from 'node:fs';
import path from 'node:path';

// Notícias do site = posts do Instagram que têm `materia` (insta-terra-gentil/dados/posts/*.json).
// Lidas no build, no servidor. Um post, duas saídas: carrossel no Instagram e página aqui.

export interface SecaoMateria {
  titulo: string;
  paragrafos: string[];
  fatosUsados: number[];
}

export interface Materia {
  slug: string;
  titulo: string;
  descricao: string;
  introducao: string;
  secoes: SecaoMateria[];
  faq: { pergunta: string; resposta: string }[];
  conclusao: string;
}

export interface Noticia {
  slug: string;
  dia: string;
  palavra: string;
  nome: string;
  serie: string;
  gancho: string;
  fontes: string[];
  materia: Materia;
  ebook: { titulo: string; url: string } | null;
  capa: { src: string; credito: string | null } | null;
}

export interface Pastas {
  posts: string;
  palavras: string;
  publico: string;
}

const RAIZ = process.cwd();
const PASTAS: Pastas = {
  posts: path.join(RAIZ, 'insta-terra-gentil', 'dados', 'posts'),
  palavras: path.join(RAIZ, 'insta-terra-gentil', 'dados', 'palavras.json'),
  publico: path.join(RAIZ, 'public', 'noticias'),
};

const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();

function lerJson(arquivo: string): unknown {
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function ebookDaPalavra(palavra: string, arquivoPalavras: string): Noticia['ebook'] {
  if (!fs.existsSync(arquivoPalavras)) return null;
  const { palavras } = lerJson(arquivoPalavras) as {
    palavras?: { palavra: string; titulo: string; pdf: string }[];
  };
  const achado = palavras?.find((p) => normalizar(p.palavra) === normalizar(palavra));
  return achado ? { titulo: achado.titulo, url: `/ebooks/${encodeURIComponent(achado.pdf)}` } : null;
}

// A capa (e o crédito da foto, exigido pela licença CC BY) é gravada pelo workflow ao lado do post.
function capaDaNoticia(slug: string, pastaPublico: string): Noticia['capa'] {
  const pasta = path.join(pastaPublico, slug);
  if (!fs.existsSync(path.join(pasta, 'capa.jpg'))) return null;
  const arquivoCredito = path.join(pasta, 'capa.json');
  const credito = fs.existsSync(arquivoCredito)
    ? ((lerJson(arquivoCredito) as { credito?: string }).credito ?? null)
    : null;
  return { src: `/noticias/${slug}/capa.jpg`, credito };
}

function materiaValida(m: unknown): m is Materia {
  const x = m as Partial<Materia> | undefined;
  return Boolean(x && typeof x.slug === 'string' && typeof x.titulo === 'string' && Array.isArray(x.secoes));
}

// Mais recentes primeiro. Post sem `materia` (os antigos) não vira notícia. Slug repetido: vale o mais novo.
export function lerNoticias(pastas: Pastas = PASTAS): Noticia[] {
  if (!fs.existsSync(pastas.posts)) return [];
  const arquivos = fs.readdirSync(pastas.posts).filter((nome) => nome.endsWith('.json'));
  const vistos = new Set<string>();
  const noticias: Noticia[] = [];
  for (const nome of arquivos.sort().reverse()) {
    const post = lerJson(path.join(pastas.posts, nome)) as Record<string, unknown>;
    if (!materiaValida(post.materia)) continue;
    const materia = post.materia;
    if (vistos.has(materia.slug)) continue;
    vistos.add(materia.slug);
    const palavra = String(post.palavra ?? '');
    noticias.push({
      slug: materia.slug,
      dia: String(post.dia),
      palavra,
      nome: String(post.nome ?? ''),
      serie: String(post.serie ?? ''),
      gancho: String(post.gancho ?? ''),
      fontes: Array.isArray(post.fontes) ? post.fontes.map(String) : [],
      materia,
      ebook: ebookDaPalavra(palavra, pastas.palavras),
      capa: capaDaNoticia(materia.slug, pastas.publico),
    });
  }
  return noticias;
}

export function noticiaPorSlug(slug: string, pastas?: Pastas): Noticia | undefined {
  return lerNoticias(pastas).find((n) => n.slug === slug);
}

// Até `quantas` outras notícias para a pessoa ler em seguida (as mais recentes, menos a atual).
export function leiaTambem(slug: string, quantas = 3, pastas?: Pastas): Noticia[] {
  return lerNoticias(pastas)
    .filter((n) => n.slug !== slug)
    .slice(0, quantas);
}

export const caminhoDaNoticia = (slug: string) => `/noticias/${slug}`;

export function dataLonga(dia: string): string {
  return new Date(`${dia}T12:00:00-03:00`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
