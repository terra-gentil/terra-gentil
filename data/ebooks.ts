export interface Ebook {
  keywords: string[];
  title: string;
  image: string;
  pdf: string;
}

// PDFs e capas hospedados localmente em public/ebooks/ apos o WordPress
// antigo no Hostinger comecar a retornar 403 nos uploads/2025/12.
// Backup das URLs originais: https://plum-tarsier-720506.hostingersite.com/wp-content/uploads/2025/12/
export const defaultEbook: Ebook = {
  keywords: [],
  title: '📘 O Código Secreto das Plantas',
  image: '/ebooks/covers/O-Codigo-Secreto-das-Plantas.jpeg',
  pdf: '/ebooks/1-O-Codigo-Secreto-das-Plantas.pdf',
};

export const ebooks: Ebook[] = [
  {
    keywords: ['espada', 'são jorge', 'sansevieria', 'zamioculca', 'zz plant', 'lírio da paz'],
    title: '🛡️ O Esquadrão Imortal: 6 Plantas Indestrutíveis',
    image: '/ebooks/covers/esquadraoimortal.jpeg',
    pdf: '/ebooks/2-O-Esquadrao-Imortal.pdf',
  },
  {
    keywords: ['arruda', 'pimenteira', 'comigo-ninguém-pode', 'guiné', 'energia', 'proteção'],
    title: '✨ Plantas da Gratidão: Proteção para o Lar',
    image: '/ebooks/covers/plantasdegratidao.jpeg',
    pdf: '/ebooks/3-Plantas-da-Gratidao.pdf',
  },
  {
    keywords: ['adubo caseiro', 'economizar', 'barato', 'reciclagem', 'garrafa pet'],
    title: '💰 Jardim Lindo com Pouco Dinheiro',
    image: '/ebooks/covers/jardimbonitoebarato.jpeg',
    pdf: '/ebooks/4-Jardim-Lindo-com-Pouco-Dinheiro.pdf',
  },
  {
    keywords: ['samambaia', 'parede', 'vertical', 'treliça', 'pendente', 'véu de noiva'],
    title: '🧗 Jardim Vertical: Seu Novo Quintal na Parede',
    image: '/ebooks/covers/jardimvertical.jpeg',
    pdf: '/ebooks/5-O-Seu-Novo-Quintal-e-na-Parede.pdf',
  },
  {
    keywords: ['lavanda', 'camomila', 'jasmim', 'ansiedade', 'calma', 'terapia', 'melissa'],
    title: '🧘 Jardim Terapêutico: Plantas que Curam',
    image: '/ebooks/covers/jardimterapeutico.jpeg',
    pdf: '/ebooks/6-Jardim-Terapeutico.pdf',
  },
  {
    keywords: ['apartamento', 'pequeno', 'sacada', 'antúrio', 'begônia', 'violeta', 'kalanchoe'],
    title: '🏢 Jardim Pequeno, Amor Gigante',
    image: '/ebooks/covers/pequenojardimgiganteamor.jpeg',
    pdf: '/ebooks/7-Jardim-Pequeno-Amor-Gigante.pdf',
  },
  {
    keywords: ['salsinha', 'coentro', 'orégano', 'manjericão', 'tomilho', 'sálvia', 'alecrim'],
    title: '🥗 Horta na Varanda: Tenha Temperos Frescos',
    image: '/ebooks/covers/hortanavaranda.jpeg',
    pdf: '/ebooks/8-Horta-na-Varanda.pdf',
  },
  {
    keywords: ['sombra', 'meia-sombra', 'sol pleno', 'luz', 'varanda'],
    title: '☀️ Guia de Luz: Sol, Sombra ou Meia-Sombra?',
    image: '/ebooks/covers/guiadeluzesombra.jpeg',
    pdf: '/ebooks/9-Plantas-para-Varanda-Pequena-o-guia-gentil-de-sol-meia-sombra-e-sombra.pdf',
  },
  {
    keywords: ['gato', 'cachorro', 'cão', 'pet', 'tóxica', 'venenosa', 'segura', 'azaleia'],
    title: '🐶 Pets e Plantas: Guia de Segurança',
    image: '/ebooks/covers/plantascaesegatos.jpeg',
    pdf: '/ebooks/10-Guia-Gentil-Plantas-Caes-e-Gatos.pdf',
  },
  {
    keywords: ['suculenta', 'echeveria', 'sedum', 'cacto', 'gordinha'],
    title: '🌵 Suculentas: O Guia para Não Matar Afogada',
    image: '/ebooks/covers/comoplantarsuculentas.jpeg',
    pdf: '/ebooks/11-Como-Plantar-Suculentas.pdf',
  },
  {
    keywords: ['rosa do deserto', 'adenium', 'caudex', 'batata da planta'],
    title: '🌸 Rosa do Deserto: Segredos do Caudex',
    image: '/ebooks/covers/comoplantarroadodeserto-2.jpeg',
    pdf: '/ebooks/12-Como-Plantar-Rosa-do-Deserto.pdf',
  },
  {
    keywords: ['morango', 'morangueiro', 'fruta', 'fruto vermelho'],
    title: '🍓 Morangos do Coração: Colha Doçura',
    image: '/ebooks/covers/comoplantarmorangos.jpeg',
    pdf: '/ebooks/13-Morangos-do-Coracao.pdf',
  },
  {
    keywords: ['hortelã', 'menta', 'chá'],
    title: '🍃 Hortelã: O Aroma da Infância',
    image: '/ebooks/covers/aromadamemoria.jpeg',
    pdf: '/ebooks/14-O-Cheirinho-que-Mora-na-Memoria.pdf',
  },
  {
    keywords: ['cebolinha', 'cheiro verde', 'cebolinho'],
    title: '🥣 Cebolinha Infinita: Adeus Mercado',
    image: '/ebooks/covers/complantarcebolinha.jpeg',
    pdf: '/ebooks/15-Como-Plantar-Cebolinha-em-Casa.pdf',
  },
  {
    keywords: ['jiboia', 'epipremnum', 'jibóia'],
    title: '🌿 Jiboia: A Planta que Perdoa Tudo',
    image: '/ebooks/covers/jibioianasala.jpeg',
    pdf: '/ebooks/16-Jiboia-na-Sala.pdf',
  },
  {
    keywords: ['alface', 'salada', 'lactuca'],
    title: '🥗 Alface em Casa: Salada Crocante',
    image: '/ebooks/covers/comoplantaralface.jpeg',
    pdf: '/ebooks/17-Alface-em-Casa.pdf',
  },
  {
    keywords: ['grama', 'gramado', 'relva', 'esmeralda', 'são carlos', 'batatais'],
    title: '🏡 Tapete Verde: O Gramado Perfeito',
    image: '/ebooks/covers/comocantargrama.jpeg',
    pdf: '/ebooks/18-O-TAPETE-VERDE-DA-BONDADE.pdf',
  },
  {
    keywords: ['tomate', 'tomateiro', 'cereja', 'legume'],
    title: '🍅 Tomate em Vaso: Colheita Farta',
    image: '/ebooks/covers/comoplantartomate.jpeg',
    pdf: '/ebooks/19-Tomate-em-Vaso.pdf',
  },
];

export function findEbookForPlant(plantName: string): Ebook {
  const name = plantName.toLowerCase();
  for (const ebook of ebooks) {
    if (ebook.keywords.some((k) => name.includes(k))) {
      return ebook;
    }
  }
  return defaultEbook;
}
