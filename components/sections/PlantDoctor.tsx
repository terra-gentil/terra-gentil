'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import BrandMark from '@/components/layout/BrandMark';
import { findEbookForPlant } from '@/data/ebooks';
import type { Diagnosis } from '@/types/diagnosis';

const LOADING_MESSAGES = [
  '🔍 Escaneando folhas e caule...',
  '📚 Consultando milhões de plantas...',
  '🧪 Verificando toxicidade...',
  '☀️ Calculando iluminação...',
  '💊 Escrevendo a receita...',
];

export default function PlantDoctor() {
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const simulateProgress = () => {
    let p = 0;
    let msgIdx = 0;
    const interval = setInterval(() => {
      if (p < 85) p += Math.random() * 5;
      else if (p < 99) p += 0.2;
      if (p > 99) p = 99;
      setProgress(Math.floor(p));

      if (Math.floor(p) % 20 === 0 && p < 90) {
        msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[msgIdx]);
      }
    }, 100);
    return interval;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setDiagnosis(null);
    setLoading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setImage(e.target?.result as string);

      progressIntervalRef.current = simulateProgress();
      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error('Erro na análise');
        const data = await res.json();

        setProgress(100);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
        setTimeout(() => {
          setDiagnosis(data);
          setLoading(false);
        }, 400);
      } catch (err) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setLoading(false);
        setError('Falha na análise. Tente novamente com uma foto mais nítida.');
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImage(null);
    setDiagnosis(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ebook = diagnosis ? findEbookForPlant(diagnosis.plantName) : null;

  return (
    <div className="pd-card">
      <div className="pd-header">
        <div className="pd-avatar">
          <BrandMark color="#0B1410" size={26} />
        </div>
        <div>
          <div className="pd-name">Doutor Terra Gentil</div>
          <div className="pd-status">
            {loading ? 'analisando agora' : diagnosis ? 'diagnóstico pronto' : 'pronto pra te ouvir'}
          </div>
        </div>
      </div>

      {!image && !loading && !diagnosis && !error && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="pd-upload"
        >
          <span className="icon" aria-hidden="true">
            📷
          </span>
          <span className="title">Toque para enviar uma foto</span>
          <span className="hint">Funciona pelo celular, nem precisa de luz boa</span>
        </button>
      )}

      {loading && (
        <>
          <div className="pd-photo">
            {image && (
              <Image src={image} alt="Analisando" fill sizes="100vw" unoptimized style={{ objectFit: 'cover' }} />
            )}
            <div className="pd-scan" />
          </div>
          <div className="pd-progress" aria-label="Progresso da análise">
            <div className="pd-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="pd-loading-msg">
            <span aria-hidden="true">⏳</span>
            {loadingMsg} <strong style={{ marginLeft: 'auto' }}>{progress}%</strong>
          </div>
        </>
      )}

      {error && (
        <>
          <div className="pd-error" role="alert">
            ⚠ {error}
          </div>
          <button type="button" className="pd-reset" onClick={reset}>
            Tentar de novo
          </button>
        </>
      )}

      {diagnosis && (
        <>
          {image && (
            <div className="pd-photo">
              <Image src={image} alt={diagnosis.plantName} fill sizes="100vw" unoptimized style={{ objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  right: 12,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                  {diagnosis.plantName}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, opacity: 0.85 }}>
                  {diagnosis.scientificName}
                </div>
              </div>
            </div>
          )}

          <div className="pd-stats">
            <div className="pd-stat-mini">
              <div className="ico" aria-hidden="true">☀️</div>
              <div className="lbl">Luz</div>
              <div className="val">{diagnosis.stats.light}</div>
            </div>
            <div className="pd-stat-mini">
              <div className="ico" aria-hidden="true">💧</div>
              <div className="lbl">Rega</div>
              <div className="val">{diagnosis.stats.watering}</div>
            </div>
            <div className="pd-stat-mini">
              <div className="ico" aria-hidden="true">🌡️</div>
              <div className="lbl">Temp</div>
              <div className="val">{diagnosis.stats.temperature}</div>
            </div>
            <div className="pd-stat-mini">
              <div className="ico" aria-hidden="true">📈</div>
              <div className="lbl">Nível</div>
              <div className="val">{diagnosis.stats.difficulty}</div>
            </div>
          </div>

          <div className={`pd-toxic-safe ${diagnosis.toxicity.isToxic ? 'toxic' : 'safe'}`}>
            <strong>{diagnosis.toxicity.isToxic ? '⚠ Planta tóxica' : '✓ Planta segura'}</strong>
            <span style={{ flex: 1 }}>{diagnosis.toxicity.details}</span>
          </div>

          <div className="pd-diagnosis">
            <strong>Diagnóstico · {diagnosis.diagnosis.problem}</strong>
            {diagnosis.diagnosis.description}
          </div>

          {diagnosis.treatment.length > 0 && (
            <div className="pd-treatment">
              {diagnosis.treatment.map((step, i) => (
                <div key={i} className="pd-treatment-step">
                  <div className="period">{step.period}</div>
                  <div className="action">{step.action}</div>
                </div>
              ))}
            </div>
          )}

          {ebook && (
            <a href={ebook.pdf} target="_blank" rel="noopener noreferrer" className="pd-ebook">
              <Image
                src={ebook.image}
                alt={ebook.title}
                width={80}
                height={80}
                style={{ borderRadius: 8, objectFit: 'cover' }}
                unoptimized
              />
              <div>
                <span className="gift">🎁 Presente pra você</span>
                <div className="title">{ebook.title}</div>
                <span className="pdf-btn">Baixar PDF →</span>
              </div>
            </a>
          )}

          <button type="button" className="pd-reset" onClick={reset}>
            Nova consulta
          </button>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        style={{ display: 'none' }}
      />
    </div>
  );
}
