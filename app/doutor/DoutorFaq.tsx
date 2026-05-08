'use client';

import { useState } from 'react';

const FAQ = [
  {
    q: 'É grátis mesmo? Tem pegadinha?',
    a: 'Tem zero pegadinha. Não pedimos cartão, não tem trial, não tem upsell. O Doutor é uma extensão do canal, e o canal vive de inscrição e parcerias com lojas que a gente confia.',
  },
  {
    q: 'Funciona pra qualquer planta?',
    a: 'O banco tem mais de 800 espécies cobertas, do manjericão à orquídea phalaenopsis. Se a sua planta não estiver no catálogo, a gente recebe um alerta interno e responde manualmente em até 48h.',
  },
  {
    q: 'Preciso baixar app?',
    a: 'Não. Funciona direto no navegador do celular ou no WhatsApp. Sem instalação, sem login, sem senha.',
  },
  {
    q: 'A IA substitui um agrônomo?',
    a: 'Pra 90% dos problemas domésticos (excesso de água, falta de luz, cochonilha, fungos comuns), sim. Pra casos mais sérios o sistema te recomenda procurar um profissional, com uma lista de agrônomos parceiros por cidade.',
  },
  {
    q: 'O que acontece com a foto que eu mando?',
    a: 'Fica criptografada por 30 dias só pra melhorar o modelo, depois é apagada. A gente nunca compartilha com terceiros, nunca usa em propaganda. Política de privacidade completa no rodapé.',
  },
] as const;

export default function DoutorFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="dr-faq">
      <div className="dr-faq-inner">
        <h2>
          Perguntas <span className="ital" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--leaf-deep)' }}>frequentes</span>.
        </h2>
        {FAQ.map((f, i) => (
          <button
            key={i}
            type="button"
            className={`dr-faq-item ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{ width: '100%', textAlign: 'left', background: 'none', padding: '20px 0' }}
          >
            <div className="q">
              {f.q} <span aria-hidden="true">+</span>
            </div>
            <div className="a">{f.a}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
