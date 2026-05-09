export interface Ebook {
  keywords: string[];
  title: string;
  image: string;
  pdf: string;
}

export const defaultEbook: Ebook = {
  keywords: [],
  title: '📘 O Código Secreto das Plantas',
  image: 'https://terragentil.com.br/wp-content/uploads/2025/12/O-Codigo-Secreto-das-Plantas.jpeg',
  pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/1-O-Codigo-Secreto-das-Plantas.pdf',
};

// Biblioteca dos 18 guias publicados em https://terragentil.com.br
// (sincronizada com o widget do Doutor das Plantas no WordPress antigo).
export const ebooks: Ebook[] = [
  {
    keywords: ['espada', 'são jorge', 'sansevieria', 'zamioculca', 'zz plant', 'lírio da paz'],
    title: '🛡️ O Esquadrão Imortal: 6 Plantas Indestrutíveis',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/esquadraoimortal.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/2-O-Esquadrao-Imortal.pdf',
  },
  {
    keywords: ['arruda', 'pimenteira', 'comigo-ninguém-pode', 'guiné', 'energia', 'proteção'],
    title: '✨ Plantas da Gratidão: Proteção para o Lar',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/plantasdegratidao.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/3-Plantas-da-Gratidao.pdf',
  },
  {
    keywords: ['adubo caseiro', 'economizar', 'barato', 'reciclagem', 'garrafa pet'],
    title: '💰 Jardim Lindo com Pouco Dinheiro',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/jardimbonitoebarato.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/4-Jardim-Lindo-com-Pouco-Dinheiro.pdf',
  },
  {
    keywords: ['samambaia', 'parede', 'vertical', 'treliça', 'pendente', 'véu de noiva'],
    title: '🧗 Jardim Vertical: Seu Novo Quintal na Parede',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/jardimvertical.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/5-O-Seu-Novo-Quintal-e-na-Parede.pdf',
  },
  {
    keywords: ['lavanda', 'camomila', 'jasmim', 'ansiedade', 'calma', 'terapia', 'melissa'],
    title: '🧘 Jardim Terapêutico: Plantas que Curam',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/jardimterapeutico.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/6-Jardim-Terapeutico.pdf',
  },
  {
    keywords: ['apartamento', 'pequeno', 'sacada', 'antúrio', 'begônia', 'violeta', 'kalanchoe'],
    title: '🏢 Jardim Pequeno, Amor Gigante',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/pequenojardimgiganteamor.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/7-Jardim-Pequeno-Amor-Gigante.pdf',
  },
  {
    keywords: ['salsinha', 'coentro', 'orégano', 'manjericão', 'tomilho', 'sálvia', 'alecrim'],
    title: '🥗 Horta na Varanda: Tenha Temperos Frescos',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/hortanavaranda.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/8-Horta-na-Varanda.pdf',
  },
  {
    keywords: ['sombra', 'meia-sombra', 'sol pleno', 'luz', 'varanda'],
    title: '☀️ Guia de Luz: Sol, Sombra ou Meia-Sombra?',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/guiadeluzesombra.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/9-Plantas-para-Varanda-Pequena-o-guia-gentil-de-sol-meia-sombra-e-sombra.pdf',
  },
  {
    keywords: ['gato', 'cachorro', 'cão', 'pet', 'tóxica', 'venenosa', 'segura', 'azaleia'],
    title: '🐶 Pets e Plantas: Guia de Segurança',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/plantascaesegatos.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/10-Guia-Gentil-Plantas-Caes-e-Gatos.pdf',
  },
  {
    keywords: ['suculenta', 'echeveria', 'sedum', 'cacto', 'gordinha'],
    title: '🌵 Suculentas: O Guia para Não Matar Afogada',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantarsuculentas.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/11-Como-Plantar-Suculentas.pdf',
  },
  {
    keywords: ['rosa do deserto', 'adenium', 'caudex', 'batata da planta'],
    title: '🌸 Rosa do Deserto: Segredos do Caudex',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantarroadodeserto-2.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/12-Como-Plantar-Rosa-do-Deserto.pdf',
  },
  {
    keywords: ['morango', 'morangueiro', 'fruta', 'fruto vermelho'],
    title: '🍓 Morangos do Coração: Colha Doçura',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantarmorangos.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/13-Morangos-do-Coracao.pdf',
  },
  {
    keywords: ['hortelã', 'menta', 'chá'],
    title: '🍃 Hortelã: O Aroma da Infância',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/aromadamemoria.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/14-O-Cheirinho-que-Mora-na-Memoria.pdf',
  },
  {
    keywords: ['cebolinha', 'cheiro verde', 'cebolinho'],
    title: '🥣 Cebolinha Infinita: Adeus Mercado',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/complantarcebolinha.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/15-Como-Plantar-Cebolinha-em-Casa.pdf',
  },
  {
    keywords: ['jiboia', 'epipremnum', 'jibóia'],
    title: '🌿 Jiboia: A Planta que Perdoa Tudo',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/jibioianasala.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/16-Jiboia-na-Sala.pdf',
  },
  {
    keywords: ['alface', 'salada', 'lactuca'],
    title: '🥗 Alface em Casa: Salada Crocante',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantaralface.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/17-Alface-em-Casa.pdf',
  },
  {
    keywords: ['grama', 'gramado', 'relva', 'esmeralda', 'são carlos', 'batatais'],
    title: '🏡 Tapete Verde: O Gramado Perfeito',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comocantargrama.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/18-O-TAPETE-VERDE-DA-BONDADE.pdf',
  },
  {
    keywords: ['tomate', 'tomateiro', 'cereja', 'legume'],
    title: '🍅 Tomate em Vaso: Colheita Farta',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantartomate.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/19-Tomate-em-Vaso.pdf',
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
