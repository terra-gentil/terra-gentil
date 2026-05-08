'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Newsletter() {
  const [v, setV] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section className="news">
      <div className="news-inner">
        <h2>
          Receba o <span className="ital">jardim</span> da semana
        </h2>
        <p>
          Um e-mail toda sexta com a transformação, o vídeo novo e uma planta diferente pra conhecer. Sem spam, sem
          publi, só gentileza.
        </p>
        <form
          className="news-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (v.includes('@')) setSent(true);
          }}
        >
          <input
            type="email"
            placeholder="seu@email.com"
            value={v}
            onChange={(e) => setV(e.target.value)}
            required
            aria-label="Seu e-mail"
          />
          <button type="submit">{sent ? '✓ Inscrito' : 'Quero receber'}</button>
        </form>
      </div>
      <Image
        className="news-mascot"
        src="/images/mascot/wave.png"
        alt=""
        width={400}
        height={400}
        aria-hidden="true"
      />
    </section>
  );
}
