import type { Metadata } from 'next';
import StubPage from '@/components/sections/StubPage';

export const metadata: Metadata = {
  title: 'App · Terra Gentil',
  description:
    'O Doutor das Plantas no seu bolso. Diagnóstico por foto, plano de rega e biblioteca de espécies brasileiras. Em breve nas lojas.',
};

const SECTIONS = [
  { t: 'Diagnóstico por foto', d: 'Aponta a câmera, IA Gemini identifica espécie e doença em segundos.' },
  { t: 'Plano de rega', d: 'Lembretes inteligentes baseados na sua planta, sua casa e o clima da semana.' },
  { t: 'Biblioteca', d: '600+ espécies brasileiras com fichas escritas pelo André.' },
  { t: 'Comunidade', d: 'Mostre seu jardim, peça ajuda, vire amigo de outros jardineiros.' },
] as const;

export default function AppPage() {
  return (
    <StubPage
      eyebrow="Em desenvolvimento"
      title="O App"
      titleItal="completo"
      sub="Diagnóstico por foto, plano de rega e biblioteca de espécies. Aterrissando em 2026."
      sections={SECTIONS}
    />
  );
}
