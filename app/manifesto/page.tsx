import type { Metadata } from 'next';
import StubPage from '@/components/sections/StubPage';

export const metadata: Metadata = {
  title: 'Manifesto · Terra Gentil',
  description:
    'Quatro princípios que guiam tudo que a Terra Gentil faz: do vídeo ao Doutor. Toda planta merece um diagnóstico, todo quintal merece volta.',
};

const SECTIONS = [
  {
    t: '01 · Toda planta merece um diagnóstico',
    d: 'Não jogue fora antes de entender. Plantas falam, só precisamos aprender a escutar.',
  },
  {
    t: '02 · Quintal é jardim',
    d: 'Não importa se é 4m² ou 400m². Espaço esquecido pode virar espaço vivo.',
  },
  {
    t: '03 · Conhecimento é grátis',
    d: 'Tudo que ensinamos no canal, no app e nos ebooks: zero pago. Sempre.',
  },
  {
    t: '04 · A comunidade é o sol',
    d: 'Sem vocês, nada disso cresce. Cada like, comentário e foto plantada conta.',
  },
] as const;

export default function ManifestoPage() {
  return (
    <StubPage
      eyebrow="A filosofia"
      title="O Manifesto"
      titleItal="completo"
      sub="Quatro princípios que guiam tudo que a Terra Gentil faz, do vídeo ao Doutor."
      sections={SECTIONS}
    />
  );
}
