import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Equipamentos — Terra Gentil',
  description: 'Conheça os equipamentos profissionais usados pelo Terra Gentil nas transformações de jardins.',
};

const equipmentCategories = [
  {
    name: 'Roçadeiras',
    icon: '🌾',
    level: 95,
    description: 'Precisão, potência e segurança para cada tipo de terreno e vegetação.',
  },
  {
    name: 'Sopradores',
    icon: '💨',
    level: 90,
    description: 'Limpeza ágil e eficiente, ideal para finalização dos trabalhos com economia de tempo.',
  },
  {
    name: 'Edge de Borda',
    icon: '✂️',
    level: 85,
    description: 'Acabamento perfeito nas bordas do gramado, respeitando formas e detalhes do terreno.',
  },
  {
    name: 'Vassoura Elétrica',
    icon: '🧹',
    level: 98,
    description: 'Praticidade na varrição de calçadas, pisos externos e áreas ajardinadas.',
  },
];

export default function EquipamentosPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-terra-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mb-4">Equipamentos</h1>
          <p className="text-terra-700 text-lg">
            Usamos o que há de melhor em equipamentos. E estamos abertos a parcerias com marcas.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {equipmentCategories.map((eq) => (
              <div key={eq.name} className="bg-terra-50 rounded-2xl p-6 border border-terra-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{eq.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-terra-800 mb-1 uppercase tracking-wide">
                      {eq.name}
                    </h3>
                    <p className="text-sm text-terra-700 leading-relaxed">{eq.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-terra-600 mb-1">
                    <span>Nível de uso</span>
                    <span className="font-bold">{eq.level}%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-terra-200">
                    <div
                      className="h-full bg-gradient-to-r from-terra-500 to-terra-400 rounded-full"
                      style={{ width: `${eq.level}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 py-10 bg-terra-800 rounded-3xl text-terra-100">
            <h2 className="text-2xl font-bold text-white mb-3">É uma marca e quer aparecer?</h2>
            <p className="text-terra-200 max-w-xl mx-auto mb-6 px-4">
              Estamos abertos a parcerias com marcas que queiram ver seus produtos em ação nas transformações Terra Gentil.
            </p>
            <a
              href="https://wa.me/5511920938591?text=Ol%C3%A1!%20Gostaria%20de%20falar%20sobre%20parceria%20Terra%20Gentil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-terra-50 text-terra-800 px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
            >
              Falar sobre parceria
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
