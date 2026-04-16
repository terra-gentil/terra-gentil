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

export const ebooks: Ebook[] = [
  {
    keywords: ['espada', 'são jorge', 'sansevieria', 'zamioculca', 'zz plant', 'lírio da paz'],
    title: '🛡️ O Esquadrão Imortal',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/esquadraoimortal.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/2-O-Esquadrao-Imortal.pdf',
  },
  {
    keywords: ['arruda', 'pimenteira', 'comigo-ninguém-pode', 'guiné', 'energia', 'proteção'],
    title: '✨ Plantas da Gratidão',
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
    title: '🧗 Jardim Vertical',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/jardimvertical.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/5-O-Seu-Novo-Quintal-e-na-Parede.pdf',
  },
  {
    keywords: ['lavanda', 'camomila', 'jasmim', 'ansiedade', 'calma', 'terapia', 'melissa'],
    title: '🧘 Jardim Terapêutico',
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
    title: '🥗 Horta na Varanda',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/hortanavaranda.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/8-Horta-na-Varanda.pdf',
  },
  {
    keywords: ['gato', 'cachorro', 'cão', 'pet', 'tóxica', 'venenosa', 'azaleia'],
    title: '🐶 Pets e Plantas',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/plantascaesegatos.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/10-Guia-Gentil-Plantas-Caes-e-Gatos.pdf',
  },
  {
    keywords: ['suculenta', 'echeveria', 'sedum', 'cacto', 'gordinha'],
    title: '🌵 Suculentas',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantarsuculentas.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/11-Como-Plantar-Suculentas.pdf',
  },
  {
    keywords: ['rosa do deserto', 'adenium', 'caudex'],
    title: '🌸 Rosa do Deserto',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantarroadodeserto-2.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/12-Como-Plantar-Rosa-do-Deserto.pdf',
  },
  {
    keywords: ['morango', 'morangueiro', 'fruta'],
    title: '🍓 Morangos do Coração',
    image: 'https://terragentil.com.br/wp-content/uploads/2025/12/comoplantarmorangos.jpeg',
    pdf: 'https://terragentil.com.br/wp-content/uploads/2025/12/13-Morangos-do-Coracao.pdf',
  },
  {
    keywords: ['tomate', 'tomateiro', 'cereja'],
    title: '🍅 Tomate em Vaso',
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
