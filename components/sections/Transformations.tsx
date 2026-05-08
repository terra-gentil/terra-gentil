import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { transformations } from '@/data/transformations';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';

export default function Transformations() {
  return (
    <section className="py-20 bg-terra-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-terra-600 tracking-wide uppercase">
            Antes e depois
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-terra-900 mt-3 mb-4">
            Cada espaço tem um potencial
          </h2>
          <p className="text-terra-700">
            Arraste a barra para revelar a transformação. Cada projeto é uma história de cuidado e dedicação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {transformations.map((t) => (
            <div key={t.id} className="space-y-3">
              <BeforeAfterSlider before={t.beforeImage} after={t.afterImage} alt={t.title} />
              <div className="px-2">
                <h3 className="font-semibold text-terra-800">{t.title}</h3>
                {t.description && (
                  <p className="text-sm text-terra-600 mt-1">{t.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/transformacoes"
            className="inline-flex items-center gap-2 bg-terra-700 hover:bg-terra-800 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
          >
            Ver todas as transformações
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
