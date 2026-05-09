'use client';

import Image from 'next/image';
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        setStatus('success');
        setEmail('');
        return;
      }
      setStatus('error');
      setErrorMsg(data.error ?? 'Não conseguimos te inscrever agora. Tente novamente.');
    } catch {
      setStatus('error');
      setErrorMsg('Falha de conexão. Verifique sua internet e tente de novo.');
    }
  }

  const buttonLabel =
    status === 'loading' ? 'Enviando…' : status === 'success' ? '✓ Inscrito' : 'Quero receber';

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
        <form className="news-form" onSubmit={onSubmit} noValidate>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading' || status === 'success'}
            aria-label="Seu e-mail"
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? 'news-error' : undefined}
          />
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
            name="website"
          />
          <button type="submit" disabled={status === 'loading' || status === 'success'}>
            {buttonLabel}
          </button>
        </form>
        <p className="news-feedback" role="status" aria-live="polite">
          {status === 'success' && 'Pronto. Te vejo na sexta com a primeira edição.'}
          {status === 'error' && (
            <span id="news-error" className="news-error">
              {errorMsg}
            </span>
          )}
        </p>
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
