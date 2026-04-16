import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-terra-600 tracking-wide uppercase">
              Conheça a Terra Gentil
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-terra-900 mt-3 mb-6 leading-tight">
              Transformando os quintais mais esquecidos em espaços vivos
            </h2>
            <div className="space-y-4 text-terra-700 leading-relaxed">
              <p>
                Fundador da <strong className="text-terra-800">Terra Gentil</strong>, André está por trás de um dos
                projetos mais inspiradores de jardinagem e transformação visual no Brasil.
              </p>
              <p>
                Com equipamentos profissionais, dedicação e um olhar único para o potencial de cada espaço,
                ele transforma terrenos tomados pelo mato em lugares limpos, cuidados e prontos para florescer novamente.
              </p>
              <p className="text-terra-600 italic">
                🌿 Seja gentil com a terra. Seja Terra Gentil.
              </p>
            </div>

            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 mt-8 text-terra-700 font-medium hover:text-terra-500 transition group"
            >
              Conheça nossa história
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-terra-50 rounded-2xl p-6 border border-terra-100">
                <div className="text-3xl font-bold text-terra-700">90%</div>
                <div className="text-sm text-terra-600 mt-1 font-medium">
                  Transformar histórias em jardins
                </div>
              </div>
              <div className="bg-terra-100 rounded-2xl p-6 border border-terra-200">
                <div className="text-3xl font-bold text-terra-700">95%</div>
                <div className="text-sm text-terra-700 mt-1 font-medium">
                  Espalhar gentileza real
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-terra-100 rounded-2xl p-6 border border-terra-200">
                <div className="text-3xl font-bold text-terra-700">80%</div>
                <div className="text-sm text-terra-700 mt-1 font-medium">
                  Conteúdos com propósito
                </div>
              </div>
              <div className="bg-terra-50 rounded-2xl p-6 border border-terra-100">
                <div className="text-3xl font-bold text-terra-700">75%</div>
                <div className="text-sm text-terra-600 mt-1 font-medium">
                  Técnica com sensibilidade
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
