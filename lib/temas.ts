// Temas da colecao: agrupam os livros com pagina propria (/guias/[slug]) para a teia de links
// internos (livros do mesmo tema se indicam) e para as secoes do /guias. Livro novo: incluir o
// codigo no tema certo. Livro sem tema cai em "Cuidados do dia a dia".

export interface Tema {
  id: string;
  nome: string;
  /** Uma frase para a secao do /guias. */
  chamada: string;
  codigos: string[];
}

export const TEMAS: Tema[] = [
  {
    id: 'orquideas',
    nome: 'Orquídeas',
    chamada: 'Fazer florir de novo, tratar, replantar e conhecer as espécies.',
    codigos: ['TG015', 'TG016', 'TG017', 'TG018'],
  },
  {
    id: 'suculentas',
    nome: 'Suculentas, cactos e rosa-do-deserto',
    chamada: 'Pouca água, muito sol e mudas que viram coleção.',
    codigos: ['TG004', 'TG010', 'TG011', 'TG019', 'TG020', 'TG021'],
  },
  {
    id: 'rosas',
    nome: 'Roseiras',
    chamada: 'Rosa no vaso, poda, doença e muda de estaca.',
    codigos: ['TG029', 'TG030', 'TG031', 'TG032'],
  },
  {
    id: 'horta',
    nome: 'Horta em casa',
    chamada: 'Da semente ao prato, no vaso, na varanda ou no canteiro.',
    codigos: ['TG012', 'TG013', 'TG014', 'TG025', 'TG027', 'TG039', 'TG040', 'TG042', 'TG043', 'TG044', 'TG045', 'TG055', 'TG061', 'TG063', 'TG064', 'TG065', 'TG067', 'TG068'],
  },
  {
    id: 'dentro-de-casa',
    nome: 'Plantas dentro de casa',
    chamada: 'Folhagens e flores para pouca luz, com bicho em casa.',
    codigos: ['TG008', 'TG009', 'TG033', 'TG034', 'TG035', 'TG036', 'TG037', 'TG038', 'TG051', 'TG052', 'TG053', 'TG066', 'TG069', 'TG070'],
  },
  {
    id: 'jardim',
    nome: 'Jardim e quintal',
    chamada: 'Começar do zero, chamar abelha e passarinho, árvore e flor.',
    codigos: ['TG024', 'TG026', 'TG028', 'TG046', 'TG047', 'TG048', 'TG049', 'TG050', 'TG054', 'TG056', 'TG062'],
  },
  {
    id: 'cuidados',
    nome: 'Cuidados do dia a dia',
    chamada: 'Rega, terra, mudas de graça, praga e mato sem veneno.',
    codigos: ['TG005', 'TG006', 'TG007', 'TG022', 'TG023', 'TG041', 'TG057', 'TG058', 'TG059', 'TG060'],
  },
];

const RESERVA = TEMAS[TEMAS.length - 1];

export function temaDe(codigo: string): Tema {
  return TEMAS.find((t) => t.codigos.includes(codigo)) ?? RESERVA;
}

/**
 * Ebook antigo (so PDF, data/ebooks.ts e palavras do Instagram) que ja tem livro novo do mesmo
 * assunto com pagina propria. No site, o link passa a levar para a pagina (melhor para o Google e
 * para quem le); o PDF antigo continua no ar e a automacao do Instagram nao muda.
 * Chave: nome do arquivo do PDF antigo. Valor: slug da pagina nova.
 */
export const PAGINA_DO_EBOOK_ANTIGO: Record<string, string> = {
  '8-Horta-na-Varanda.pdf': 'horta-na-varanda',
  '9-Plantas-para-Varanda-Pequena-o-guia-gentil-de-sol-meia-sombra-e-sombra.pdf': 'planta-sem-sol',
  '10-Guia-Gentil-Plantas-Caes-e-Gatos.pdf': 'casa-com-pet',
  '11-Como-Plantar-Suculentas.pdf': 'suculentas-sem-afogar',
  '12-Como-Plantar-Rosa-do-Deserto.pdf': 'rosa-do-deserto',
  '13-Morangos-do-Coracao.pdf': 'morango-no-vaso',
  '14-O-Cheirinho-que-Mora-na-Memoria.pdf': 'temperos-da-janela',
  '15-Como-Plantar-Cebolinha-em-Casa.pdf': 'temperos-da-janela',
  '16-Jiboia-na-Sala.pdf': 'jiboia-e-filodendro',
  '17-Alface-em-Casa.pdf': 'horta-em-vaso',
  '19-Tomate-em-Vaso.pdf': 'tomate-no-vaso',
};

/** Slug da pagina nova para um PDF antigo ("/ebooks/x.pdf" ou "x.pdf"), se houver. */
export function paginaDoEbookAntigo(pdf: string): string | undefined {
  return PAGINA_DO_EBOOK_ANTIGO[decodeURIComponent(pdf).split('/').pop() ?? ''];
}
