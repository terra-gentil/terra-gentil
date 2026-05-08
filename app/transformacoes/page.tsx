import type { Metadata } from 'next';
import { transformations } from '@/data/transformations';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';

export const metadata: Metadata = {
  title: 'Transformações — Terra Gentil',
  description: 'Veja o antes e depois das transformações de jardins e quintais feitas pela Terra Gentil.',
};

export default function TransformacoesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-terra-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mb-4">Antes e Depois</h1>
          <p className="text-terra-700 text-lg">
            Arraste cada imagem para revelar o poder da transformação.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {transformations.map((t) => (
              <div key={t.id} className="space-y-4">
                <BeforeAfterSlider before={t.beforeImage} after={t.afterImage} alt={t.title} />
                <div>
                  <h2 className="text-xl font-bold text-terra-800">{t.title}</h2>
                  {t.description && <p className="text-terra-600 mt-1">{t.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
