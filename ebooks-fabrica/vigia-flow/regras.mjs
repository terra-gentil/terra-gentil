// Regras de ritmo do vigia, usadas pelo receptor.mjs e pelo pode.mjs (sem DOM, sem rede, so arquivos de saida/).
// Resfriamento depois de aviso: "Limite do Flow" = ESFRIAR_MIN (padrao 60); "atividade incomum" = ESFRIAR_INCOMUM_MIN
// (padrao 180, nasceu do bloqueio de 13/11/2026 18:04: 60 min e pouco para quem ja foi marcado como robo).
// Entre rodadas de 2K: INTERVALO_2K_MIN (padrao 25, contado da entrega do comando). Entre lotes de geracao:
// sorteio de GERAR_MIN a GERAR_MAX min (padrao 18 a 35) e, a cada 3 lotes, pausa longa de 60 a 100 min.
// Versao minima da extensao que pode receber comando de 2K: VERSAO_MINIMA (v1.1 velha ja ficou carregada antes).
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const num = (nome, padrao) => Number(process.env[nome] || padrao);
export const ESFRIAR_MIN = num("ESFRIAR_MIN", 60);
export const ESFRIAR_INCOMUM_MIN = num("ESFRIAR_INCOMUM_MIN", 180);
export const INTERVALO_2K_MIN = num("INTERVALO_2K_MIN", 25);
export const GERAR_MIN = num("GERAR_MIN", 18), GERAR_MAX = num("GERAR_MAX", 35);
export const PAUSA_LONGA_MIN = 60, PAUSA_LONGA_MAX = 100, LOTES_ATE_PAUSA_LONGA = 3;
export const VERSAO_MINIMA = 1.3;

const ler = (arq) => { try { return readFileSync(arq, "utf8"); } catch { return ""; } };
const idadeMin = (arq, agora) => { try { return (agora - statSync(arq).mtimeMs) / 60000; } catch { return Infinity; } };

export const esfriarMinPara = (texto) => (/incomum/i.test(String(texto || "")) ? ESFRIAR_INCOMUM_MIN : ESFRIAR_MIN);

// minutos que faltam no resfriamento aberto pelo alerta.json (0 = livre)
export const restanteEsfriar = (pasta, agora = Date.now()) => {
  const arq = join(pasta, "alerta.json");
  const idade = idadeMin(arq, agora);
  if (idade === Infinity) return 0;
  return Math.max(0, esfriarMinPara(ler(arq)) - idade);
};
export const alertaAtual = (pasta) => ler(join(pasta, "alerta.json"));

// minutos que faltam para a proxima rodada de 2K (0 = pode)
export const restante2k = (pasta, agora = Date.now()) =>
  Math.max(0, INTERVALO_2K_MIN - idadeMin(join(pasta, "ultimo-2k.json"), agora));

// a ferramenta esta gerando? (estado.json recente com foto em "gerando"). 2K e geracao nunca ao mesmo tempo.
export const gerandoAgora = (pasta, agora = Date.now()) => {
  const arq = join(pasta, "estado.json");
  if (idadeMin(arq, agora) > 15) return false;
  try {
    const s = JSON.parse(ler(arq));
    return Boolean(String(s.gerando || "").trim()) || /^gerando$/i.test(String(s.status || ""));
  } catch { return false; }
};

export const sortearMin = (min, max, rnd = Math.random) => min + (max - min) * ((rnd() + rnd()) / 2);
