export interface Transformation {
  id: string;
  title: string;
  location?: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
}

export const transformations: Transformation[] = [
  {
    id: 'quintal-1',
    title: 'Quintal transformado',
    beforeImage: '/images/transformacao-1-antes.jpeg',
    afterImage: '/images/transformacao-1-depois.jpeg',
    description: 'De terreno abandonado a espaço vivo.',
  },
  {
    id: 'quintal-2',
    title: 'Cantinho do jardim',
    beforeImage: '/images/transformacao-2-antes.jpeg',
    afterImage: '/images/transformacao-2-depois.jpeg',
    description: 'Devolvendo vida a um espaço esquecido.',
  },
];
