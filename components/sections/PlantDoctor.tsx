'use client';

import { useState, useRef } from 'react';
import { Camera, Leaf, Loader2, AlertCircle, RefreshCw, Droplets, Sun, Thermometer, Activity } from 'lucide-react';
import { findEbookForPlant } from '@/data/ebooks';

interface Diagnosis {
  plantName: string;
  scientificName: string;
  welcomeMessage: string;
  toxicity: {
    isToxic: boolean;
    details: string;
  };
  diagnosis: {
    problem: string;
    description: string;
  };
  stats: {
    light: string;
    watering: string;
    temperature: string;
    difficulty: string;
  };
  treatment: Array<{
    period: string;
    action: string;
  }>;
}

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

      const progressInterval = simulateProgress();

      try {
        const res = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
        });

        if (!res.ok) throw new Error('Erro na análise');
        const data = await res.json();

        setProgress(100);
        clearInterval(progressInterval);
        setTimeout(() => {
          setDiagnosis(data);
          setLoading(false);
        }, 400);
      } catch (err) {
        clearInterval(progressInterval);
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
    <section id="doutor" className="py-20 bg-gradient-to-br from-terra-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-terra-100 text-terra-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Leaf size={14} />
            <span>Inteligência Artificial</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-terra-900 mb-4">
            Doutor das Plantas
          </h2>
          <p className="text-terra-700 max-w-xl mx-auto">
            Folhas amarelas? Manchas? Tire uma foto e descubra o que está acontecendo com sua planta em segundos.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-terra-100 overflow-hidden">
          {!image && !loading && !diagnosis && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-12 border-4 border-dashed border-terra-300 hover:border-terra-500 hover:bg-terra-50 transition-all group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-terra-100 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-terra-200 transition-all">
                  <Camera size={36} className="text-terra-700" />
                </div>
                <div>
                  <div className="text-lg font-bold text-terra-800 uppercase tracking-wide">
                    Toque para enviar uma foto
                  </div>
                  <div className="text-sm text-terra-600 mt-2">
                    🎯 Dica: fotografe o caule e as folhas
                  </div>
                </div>
              </div>
            </button>
          )}

          {loading && (
            <div className="p-8 text-center">
              <div className="relative w-40 h-40 mx-auto mb-6">
                {image && (
                  <img
                    src={image}
                    alt="Analisando"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-terra-400/30 to-transparent animate-scan-line pointer-events-none" />
              </div>

              <div className="flex items-center gap-3 max-w-md mx-auto mb-3">
                <div className="flex-1 h-2 bg-terra-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-terra-500 to-terra-400 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm font-bold text-terra-800 w-12 text-right">
                  {progress}%
                </div>
              </div>

              <div className="text-terra-700 font-medium animate-pulse flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {loadingMsg}
              </div>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 bg-terra-700 hover:bg-terra-800 text-white px-6 py-3 rounded-full font-medium transition"
              >
                <RefreshCw size={18} />
                Tentar novamente
              </button>
            </div>
          )}

          {diagnosis && (
            <div className="p-6 md:p-8">
              {image && (
                <img
                  src={image}
                  alt={diagnosis.plantName}
                  className="w-full max-h-64 object-cover rounded-2xl mb-6"
                />
              )}

              <div className="text-center border-b border-terra-100 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-terra-900">{diagnosis.plantName}</h3>
                <p className="text-terra-600 italic font-serif text-sm mt-1">
                  {diagnosis.scientificName}
                </p>
              </div>

              <div className="bg-terra-50 rounded-2xl p-4 mb-6 border border-terra-100">
                <div className="text-xs font-bold text-terra-700 uppercase mb-1">
                  Doutor Terra Gentil diz:
                </div>
                <p className="text-sm text-terra-800 leading-relaxed">
                  {diagnosis.welcomeMessage}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Stat icon={<Sun size={18} />} label="Luz" value={diagnosis.stats.light} />
                <Stat icon={<Droplets size={18} />} label="Rega" value={diagnosis.stats.watering} />
                <Stat icon={<Thermometer size={18} />} label="Temperatura" value={diagnosis.stats.temperature} />
                <Stat icon={<Activity size={18} />} label="Nível" value={diagnosis.stats.difficulty} />
              </div>

              <div
                className={`rounded-2xl p-4 mb-6 border text-center ${
                  diagnosis.toxicity.isToxic
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="font-bold text-sm mb-1">
                  {diagnosis.toxicity.isToxic ? '⚠️ Planta tóxica' : '✅ Planta segura'}
                </div>
                <p className="text-xs leading-relaxed">{diagnosis.toxicity.details}</p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-4 mb-6">
                <div className="font-bold text-amber-900 mb-2">
                  ⚠️ Diagnóstico: {diagnosis.diagnosis.problem}
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {diagnosis.diagnosis.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 font-bold text-terra-800 mb-4">
                  <span className="text-xl">💊</span> Plano de ação
                </div>
                <div className="border-l-2 border-terra-200 pl-5 space-y-4">
                  {diagnosis.treatment.map((step, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[27px] top-1 w-3 h-3 bg-terra-600 rounded-full border-2 border-white shadow" />
                      <div className="inline-block bg-terra-100 text-terra-800 text-xs font-bold px-2 py-1 rounded mb-1 uppercase">
                        {step.period}
                      </div>
                      <p className="text-sm text-terra-700 leading-relaxed">{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {ebook && (
                <div className="bg-gradient-to-br from-amber-300 to-orange-400 rounded-2xl p-6 text-center mb-6">
                  <div className="inline-block bg-white/90 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
                    🎁 Presente pra você
                  </div>
                  <div className="mb-2">
                    <img
                      src={ebook.image}
                      alt={ebook.title}
                      className="w-20 h-20 mx-auto rounded-lg shadow-lg object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-amber-900 mb-3">{ebook.title}</h4>
                  <a
                    href={ebook.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-full font-bold text-sm transition hover:scale-105"
                  >
                    Baixar guia grátis
                  </a>
                </div>
              )}

              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 bg-terra-50 hover:bg-terra-100 text-terra-800 py-3 rounded-full font-medium border border-terra-200 transition"
              >
                <RefreshCw size={18} />
                Nova consulta
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-terra-50 rounded-xl p-3 border border-terra-100 text-center">
      <div className="text-terra-700 flex justify-center mb-1">{icon}</div>
      <div className="text-[10px] uppercase text-terra-600 font-bold tracking-wide">{label}</div>
      <div className="text-sm font-medium text-terra-800 mt-1">{value}</div>
    </div>
  );
}
