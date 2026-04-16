import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre — Terra Gentil',
  description: 'Conheça a história do Terra Gentil: um movimento de gentileza que transforma jardins abandonados em espaços de vida.',
};

export default function SobrePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-terra-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-medium text-terra-600 tracking-wide uppercase">
            Somos Terra Gentil
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mt-3 mb-6 leading-tight">
            Conteúdo inspirador e um movimento de gentileza
          </h1>
          <p className="text-lg text-terra-700 leading-relaxed">
            O mundo sem jardins e plantas seria um lugar vazio — é a natureza, a luz e a cor que despertam nossa alma e nos conectam com algo maior.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-terra-700 leading-relaxed">
          <p>
            O Terra Gentil nasceu como um canal no YouTube, mas logo se transformou em um movimento. Um convite à gentileza,
            ao cuidado com o espaço ao nosso redor, e à redescoberta do verde que muitas vezes esquecemos nos quintais e nas rotinas.
          </p>
          <p>
            Nosso estilo une técnicas sustentáveis, criatividade e um olhar sensível para cada jardim. Cada transformação é única,
            feita com escuta, respeito e afeto — seja revitalizando um terreno abandonado ou criando um novo espaço para florescer.
          </p>
          <p>
            Mais do que cortar grama ou plantar flores, queremos inspirar pessoas. Queremos criar um hub de gentilezas,
            onde cada poda, cada gesto e cada história compartilhada floresçam também nas telas, nos corações e nas comunidades.
          </p>
        </div>
      </section>

      <section className="py-16 bg-terra-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-terra-900 text-center mb-12">Por que seguir a Terra Gentil?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Imagens que inspiram', text: 'Cada transformação é registrada em detalhes, com luz natural e ângulos que revelam o antes e depois — não só do jardim, mas da energia do lugar.' },
              { title: 'Histórias reais', text: 'Nosso conteúdo nasce de quintais reais, com pessoas reais. Cada vídeo é um encontro, uma escuta, e uma devolução com respeito e afeto.' },
              { title: 'Ferramentas na mão, coração no trabalho', text: 'Usamos bons equipamentos, sim. Mas o que nos move mesmo é a vontade de fazer algo bom, de verdade.' },
              { title: 'Qualidade visual com propósito', text: 'Do corte de câmera ao som ambiente, tudo é pensado para que você sinta o impacto de cada transformação como se estivesse lá.' },
              { title: 'Visão sensível', text: 'Onde muitos veem apenas mato, a gente vê potencial. Criamos espaços onde o verde volta a respirar — e as pessoas também.' },
              { title: 'Gentileza é nossa linguagem', text: 'Toda transformação é um ato de cuidado. Queremos plantar gentilezas, regar ideias e colher inspiração — uma poda de cada vez.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-terra-100">
                <h3 className="font-bold text-terra-800 mb-3">{item.title}</h3>
                <p className="text-sm text-terra-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
