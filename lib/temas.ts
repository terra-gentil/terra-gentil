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
    codigos: ['TG012', 'TG013', 'TG014', 'TG025', 'TG027', 'TG039', 'TG040', 'TG042', 'TG043', 'TG044', 'TG045'],
  },
  {
    id: 'dentro-de-casa',
    nome: 'Plantas dentro de casa',
    chamada: 'Folhagens e flores para pouca luz, com bicho em casa.',
    codigos: ['TG008', 'TG009', 'TG033', 'TG034', 'TG035', 'TG036', 'TG037', 'TG038'],
  },
  {
    id: 'jardim',
    nome: 'Jardim e quintal',
    chamada: 'Começar do zero, chamar abelha e passarinho, árvore e flor.',
    codigos: ['TG024', 'TG026', 'TG028', 'TG046'],
  },
  {
    id: 'cuidados',
    nome: 'Cuidados do dia a dia',
    chamada: 'Rega, terra, mudas de graça, praga e mato sem veneno.',
    codigos: ['TG005', 'TG006', 'TG007', 'TG022', 'TG023', 'TG041'],
  },
];

const RESERVA = TEMAS[TEMAS.length - 1];

export function temaDe(codigo: string): Tema {
  return TEMAS.find((t) => t.codigos.includes(codigo)) ?? RESERVA;
}
