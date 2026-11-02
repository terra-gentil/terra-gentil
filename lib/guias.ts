import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ebooks } from '@/data/ebooks';

// Paginas de livro do site. O conteudo vem de data/guias/<slug>.json, gerado por
// scripts/guias/gerar.mjs a partir do livro pronto. O texto nunca e reescrito aqui:
// so reconhecemos o tipo de cada trecho (ficha, passo, dica, lista, tabela) para
// desenhar melhor na tela.

export interface GuiaFoto {
  src: string;
  largura: number;
  altura: number;
  alt: string;
}

export interface GuiaPagina {
  n: number;
  linhas: string[];
  fotos: GuiaFoto[];
}

export interface GuiaMeta {
  /** <title> da busca, sem a marca (ate ~50 caracteres). */
  titulo: string;
  /** Meta description, 140 a 160 caracteres. */
  descricao: string;
  /** Nome do arquivo do PDF no armazenamento (R2). */
  pdf: string;
  /** Data (AAAA-MM-DD) da ultima revisao da pagina. */
  atualizado: string;
}

export interface Guia {
  codigo: string;
  slug: string;
  titulo: string;
  /** Capa do livro (pagina 1 renderizada), miniatura do botao de download. */
  capa?: GuiaFoto;
  meta: GuiaMeta;
  paginas: GuiaPagina[];
}

export type Variante = 'dica' | 'alerta' | 'faca' | 'missao';

export type Bloco =
  | { tipo: 'p'; texto: string }
  | { tipo: 'rotulo'; texto: string }
  | { tipo: 'campos'; itens: { rotulo: string; texto: string }[] }
  | { tipo: 'passos'; itens: { n: string; titulo: string; texto: string }[] }
  | { tipo: 'callout'; variante: Variante; rotulo: string; linhas: string[] }
  | { tipo: 'lista'; rotulo: string | null; itens: string[] }
  | { tipo: 'tabela'; cabecalho: string[]; linhas: string[][] }
  | { tipo: 'destaque'; pre: string; grande: string; legenda: string };

export interface GuiaSecao {
  id: string;
  rotulo: string | null;
  titulo: string;
  blocos: Bloco[];
  fotos: GuiaFoto[];
}

export interface GuiaFaq {
  id: string;
  pergunta: string;
  /** Linhas cruas, para o JSON-LD. */
  resposta: string[];
  blocos: Bloco[];
  fotos: GuiaFoto[];
}

export interface GuiaMontado {
  subtitulo: string;
  hero: GuiaFoto | null;
  carta: GuiaSecao | null;
  secoes: GuiaSecao[];
  faq: GuiaFaq[];
  proximo: string | null;
}

const PASTA = join(process.cwd(), 'data', 'guias');

export function listarGuias(): Guia[] {
  if (!existsSync(PASTA)) return [];
  return readdirSync(PASTA)
    .filter((a) => a.endsWith('.json'))
    .map((a) => JSON.parse(readFileSync(join(PASTA, a), 'utf8')) as Guia)
    .sort((a, b) => a.codigo.localeCompare(b.codigo));
}

/** Total de ebooks gratis do site: colecao antiga (so PDF) mais os livros com pagina propria. */
export function totalEbooks(): number {
  return ebooks.length + listarGuias().length;
}

export function lerGuia(slug: string): Guia | null {
  return listarGuias().find((g) => g.slug === slug) ?? null;
}

const limpar = (l: string) => l.replace(/\t/g, ' ');

/** Linha de rotulo: so maiusculas, numeros e pontuacao ("DICA DO ANDRÉ", "01"). */
export function ehRotulo(linha: string): boolean {
  return !/[a-zà-ú]/.test(limpar(linha));
}

const ehNumero = (l: string) => /^\d+$/.test(l.trim());
/** Item curto de lista: ate 48 caracteres e sem fechar frase. */
const ehItemCurto = (l: string) => l.length <= 48 && !/[.?!:]$/.test(l);

const CALLOUTS: Record<string, Variante> = {
  'DICA DO ANDRÉ': 'dica',
  ATENÇÃO: 'alerta',
  'FAÇA ASSIM': 'faca',
  'SUA MISSÃO ATÉ AMANHÃ': 'missao',
};

/** Texto corrido (JSON-LD, contagem de palavras). */
export function textoDe(linhas: string[]): string {
  return linhas.map(limpar).join(' ');
}

export function slugDe(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Reconhece o tipo de cada trecho das linhas do livro, sem mudar nenhuma palavra. */
export function montarBlocos(entrada: string[]): Bloco[] {
  // "CHAVE ..." e a legenda de icones do PDF, sem sentido na web.
  const L = entrada.filter((l) => !/^CHAVE\b/.test(limpar(l)));
  const passosNumerados = L.filter(ehNumero).length >= 2;
  const saida: Bloco[] = [];

  const juntarCampo = (rotulo: string, texto: string) => {
    const ult = saida[saida.length - 1];
    if (ult?.tipo === 'campos') ult.itens.push({ rotulo, texto });
    else saida.push({ tipo: 'campos', itens: [{ rotulo, texto }] });
  };
  const juntarPasso = (n: string, titulo: string, texto: string) => {
    const ult = saida[saida.length - 1];
    if (ult?.tipo === 'passos') ult.itens.push({ n, titulo, texto });
    else saida.push({ tipo: 'passos', itens: [{ n, titulo, texto }] });
  };

  let i = 0;
  while (i < L.length) {
    const l = L[i];
    const t = limpar(l);

    // Tabela: 3 ou mais linhas seguidas com o mesmo numero de colunas.
    if (l.includes('\t')) {
      const cols = l.split('\t').length;
      let j = i;
      while (j < L.length && L[j].includes('\t') && L[j].split('\t').length === cols) j++;
      if (j - i >= 3) {
        const [cabecalho, ...linhas] = L.slice(i, j).map((r) => r.split('\t'));
        saida.push({ tipo: 'tabela', cabecalho, linhas });
        i = j;
        continue;
      }
    }

    if (ehNumero(t)) {
      // Numero de passo (so quando ha 2 ou mais); numero solto some.
      if (passosNumerados && L[i + 1] !== undefined) {
        juntarPasso(t, limpar(L[i + 1]), limpar(L[i + 2] ?? ''));
        i += 3;
      } else i++;
      continue;
    }

    if (ehRotulo(t)) {
      let j = i + 1;
      const corpo: string[] = [];
      while (j < L.length && !ehRotulo(L[j]) && !L[j].includes('\t')) corpo.push(L[j++]);
      const variante = CALLOUTS[t];
      if (variante) saida.push({ tipo: 'callout', variante, rotulo: t, linhas: corpo });
      else if (corpo.length === 0) saida.push({ tipo: 'rotulo', texto: t });
      else if (corpo.length === 1) juntarCampo(t, corpo[0]);
      else if (corpo.every(ehItemCurto)) saida.push({ tipo: 'lista', rotulo: t, itens: corpo });
      else {
        saida.push({ tipo: 'rotulo', texto: t });
        for (const c of corpo) saida.push({ tipo: 'p', texto: c });
      }
      i = j;
      continue;
    }

    // Texto livre: corrida de linhas ate o proximo rotulo, numero ou tabela.
    if (l.includes('\t')) {
      saida.push({ tipo: 'p', texto: t });
      i++;
      continue;
    }
    let j = i;
    const corrida: string[] = [];
    while (j < L.length && !ehRotulo(L[j]) && !L[j].includes('\t')) corrida.push(L[j++]);
    let k = 0;
    while (k < corrida.length) {
      let m = k;
      while (m < corrida.length && ehItemCurto(corrida[m])) m++;
      if (m - k >= 3) {
        saida.push({ tipo: 'lista', rotulo: null, itens: corrida.slice(k, m) });
        k = m;
      } else {
        saida.push({ tipo: 'p', texto: corrida[k] });
        k++;
      }
    }
    i = j;
  }
  return saida;
}

export function montarGuia(guia: Guia): GuiaMontado {
  const [capa, ...resto] = guia.paginas;
  const ultima = resto.pop();

  const iTitulo = capa.linhas.findIndex((l) => l === guia.titulo);
  const subtitulo = iTitulo >= 0 ? (capa.linhas[iTitulo + 1] ?? '') : '';
  const proximo = ultima?.linhas.find((l) => l.startsWith('PRÓXIMO:')) ?? null;

  let carta: GuiaSecao | null = null;
  const secoes: GuiaSecao[] = [];
  const faq: GuiaFaq[] = [];

  for (const p of resto) {
    const [primeira, ...demais] = p.linhas;
    if (!primeira) continue;
    // Mapa do livro e aberturas de capitulo sao navegacao do PDF, nao conteudo.
    if (primeira === 'NESTE LIVRO' || /^CAPÍTULO \d+$/.test(primeira)) continue;

    const rotulo = ehRotulo(primeira) ? primeira : null;
    let titulo = primeira;
    let corpo = demais;
    let blocosExtra: Bloco[] = [];

    if (primeira === 'VOCÊ SABIA?' && demais.length >= 3) {
      // Molde fixo: [prefixo, palavra grande, legenda, ...]
      blocosExtra = [{ tipo: 'destaque', pre: demais[0], grande: demais[1], legenda: demais[2] }];
      corpo = demais.slice(3);
    } else if (rotulo !== null && demais[0] !== undefined && !ehRotulo(demais[0])) {
      titulo = demais[0];
      corpo = demais.slice(1);
    } else if (rotulo !== null && CALLOUTS[limpar(demais[0] ?? '')] && demais[1] && !ehRotulo(demais[1])) {
      // "CAPITULO 3 / ATENÇÃO / Xicara sem furo afoga.": a frase vira o titulo.
      titulo = demais[1];
      corpo = [demais[0], ...demais.slice(2)];
    }

    const tituloNaSegunda = titulo !== primeira;
    const id = `${slugDe(titulo)}-${p.n}`;
    const blocos = [...blocosExtra, ...montarBlocos(corpo)];

    if (rotulo === 'UMA CARTA PARA VOCÊ') {
      carta = { id, rotulo, titulo, blocos, fotos: p.fotos };
    } else if (titulo.endsWith('?')) {
      faq.push({ id, pergunta: titulo, resposta: corpo, blocos, fotos: p.fotos });
    } else {
      secoes.push({ id, rotulo: tituloNaSegunda && rotulo !== titulo ? rotulo : null, titulo, blocos, fotos: p.fotos });
    }
  }

  return { subtitulo, hero: capa.fotos[0] ?? null, carta, secoes, faq, proximo };
}
