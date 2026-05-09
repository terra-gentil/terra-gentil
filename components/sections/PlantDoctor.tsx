'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import BrandMark from '@/components/layout/BrandMark';
import { findEbookForPlant } from '@/data/ebooks';
import type { Diagnosis, DiagnosisExtras } from '@/types/diagnosis';

const LOADING_MESSAGES = [
  '🔍 Escaneando folhas e caule...',
  '📚 Consultando milhões de plantas...',
  '🧪 Verificando toxicidade...',
  '☀️ Calculando iluminação...',
  '💊 Escrevendo a receita...',
];

const HEALTH_STATUS: Record<DiagnosisExtras['healthStatus'], { label: string; color: string }> = {
  saudavel: { label: 'Saudável', color: '#16a34a' },
  atencao: { label: 'Atenção', color: '#f59e0b' },
  doente: { label: 'Doente', color: '#fb6f92' },
  critico: { label: 'Crítico', color: '#e63b6e' },
  nao_aplicavel: { label: 'Não se aplica', color: '#a8a29e' },
};

interface PlantDoctorProps {
  variant?: 'compact' | 'full';
}

export default function PlantDoctor({ variant = 'compact' }: PlantDoctorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [notPlantMessage, setNotPlantMessage] = useState<string | null>(null);
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
    setNotPlantMessage(null);
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

        const data = await res.json();

        if (!res.ok) {
          throw new Error(typeof data?.error === 'string' ? data.error : 'Erro na análise');
        }

        setProgress(100);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;

        setTimeout(() => {
          if (data?.notPlant) {
            setNotPlantMessage(typeof data.message === 'string' ? data.message : 'A imagem não parece ser de uma planta.');
          } else {
            setDiagnosis(data);
          }
          setLoading(false);
        }, 400);
      } catch (err) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Falha na análise. Tente novamente com uma foto mais nítida.');
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImage(null);
    setDiagnosis(null);
    setNotPlantMessage(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ebook = diagnosis ? findEbookForPlant(diagnosis.plantName) : null;
  const status = diagnosis?.extras
    ? HEALTH_STATUS[diagnosis.extras.healthStatus]
    : null;

  return (
    <div className="pd-card">
      <div className="pd-header">
        <div className="pd-avatar">
          <BrandMark color="#0B1410" size={26} />
        </div>
        <div>
          <div className="pd-name">Doutor Terra Gentil</div>
          <div className="pd-status">
            {loading
              ? 'analisando agora'
              : diagnosis
                ? 'diagnóstico pronto'
                : notPlantMessage
                  ? 'nada de planta aqui'
                  : 'pronto pra te ouvir'}
          </div>
        </div>
      </div>

      {!image && !loading && !diagnosis && !error && !notPlantMessage && (
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

      {notPlantMessage && (
        <>
          <div
            role="status"
            style={{
              padding: '20px 18px',
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: 14,
              color: '#78350f',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <strong style={{ fontSize: 17 }}>Hmm, parece que não é uma planta...</strong>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{notPlantMessage}</span>
          </div>
          <button type="button" className="pd-reset" onClick={reset}>
            Tentar outra foto
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
              {/* Badges sobrepostos no topo (so em full) */}
              {variant === 'full' && diagnosis.extras && status && (
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: status.color,
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                    }}
                  >
                    {status.label}
                  </span>
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Confiança {Math.round(diagnosis.extras.confidence * 100)}%
                  </span>
                </div>
              )}
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

          {/* Bloco rico apenas em /doutor (full) */}
          {variant === 'full' && diagnosis.extras && (
            <DiagnosisFullBlock extras={diagnosis.extras} />
          )}

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

function DiagnosisFullBlock({ extras }: { extras: DiagnosisExtras }) {
  const SEVERITY_COLOR: Record<string, string> = {
    leve: '#16a34a',
    moderado: '#f59e0b',
    grave: '#fb6f92',
    critico: '#e63b6e',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
      {/* Qualidade da foto / luz */}
      <div
        style={{
          padding: 14,
          background: '#f6f1e7',
          border: '1px solid #efeae0',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 14, color: '#1c1917' }}>📸 Qualidade da foto</strong>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#16a34a' }}>{extras.lightQuality.percent}%</span>
        </div>
        <div
          style={{
            height: 8,
            background: '#efeae0',
            borderRadius: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.max(0, Math.min(100, extras.lightQuality.percent))}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #fb6f92 0%, #f59e0b 50%, #16a34a 100%)',
            }}
          />
        </div>
        {extras.lightQuality.verdict && (
          <span style={{ fontSize: 13, color: '#57534e', lineHeight: 1.4 }}>
            {extras.lightQuality.verdict}
          </span>
        )}
      </div>

      {/* Problemas detectados */}
      {extras.detectedProblems.length > 0 && (
        <div
          style={{
            padding: 14,
            background: '#fff',
            border: '2px solid #fde68a',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <strong style={{ fontSize: 14, color: '#78350f' }}>🔬 Problemas detectados</strong>
          {extras.detectedProblems.map((p, i) => {
            const sevKey = p.severity?.toLowerCase() ?? '';
            const color = SEVERITY_COLOR[sevKey] ?? '#a8a29e';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  borderLeft: `3px solid ${color}`,
                  paddingLeft: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1917' }}>{p.description}</span>
                  {p.severity && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'white',
                        background: color,
                        padding: '2px 8px',
                        borderRadius: 100,
                        letterSpacing: 0.3,
                      }}
                    >
                      {p.severity}
                    </span>
                  )}
                </div>
                {p.cause && (
                  <span style={{ fontSize: 13, color: '#57534e', lineHeight: 1.4 }}>
                    Provável causa: {p.cause}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Plano de tratamento (texto longo, alem da timeline) */}
      {extras.treatmentPlan && (
        <div
          style={{
            padding: 14,
            background: '#dcfce7',
            border: '1px solid #16a34a',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <strong style={{ fontSize: 14, color: '#14532d' }}>💊 Plano de tratamento</strong>
          <span style={{ fontSize: 14, color: '#1c1917', lineHeight: 1.5 }}>{extras.treatmentPlan}</span>
        </div>
      )}

      {/* Retorno se necessario */}
      {extras.needsFollowup.required && extras.needsFollowup.message && (
        <div
          style={{
            padding: 12,
            background: '#e0f2fe',
            border: '1px solid #38bdf8',
            borderRadius: 12,
            fontSize: 13,
            color: '#075985',
            lineHeight: 1.5,
          }}
        >
          📅 <strong>Acompanhamento:</strong> {extras.needsFollowup.message}
        </div>
      )}
    </div>
  );
}
