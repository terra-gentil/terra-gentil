// Diz se da para gerar ou baixar agora. Imprime UMA linha: "PODE" ou "ESPERE <minutos> <motivo>".
// Sempre: resfriamento do saida/alerta.json (regras.mjs: 60 min limite, 180 min atividade incomum).
// "node pode.mjs gerar" (rodar ANTES de cada "Gerar selecionadas"): tambem respeita o ritmo entre lotes, sorteado
// e guardado em saida/ritmo.json (18 a 35 min; a cada 3 lotes, 60 a 100 min). Ao imprimir PODE ele ja marca o
// lote como feito e sorteia o proximo horario: so chamar quando for gerar de verdade. Ate 13/11 os lotes sairam
// a cada 13 min cravados por 2 h 30, o que tem cara de robo.
// "node pode.mjs 2k": resfriamento e espaco entre rodadas de 2K (o receptor aplica o mesmo).
// Uso: node pode.mjs [gerar|2k]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  restanteEsfriar, alertaAtual, restante2k, sortearMin,
  GERAR_MIN, GERAR_MAX, PAUSA_LONGA_MIN, PAUSA_LONGA_MAX, LOTES_ATE_PAUSA_LONGA,
} from "./regras.mjs";

const pasta = process.env.SAIDA || join(dirname(fileURLToPath(import.meta.url)), "saida");
const modo = process.argv[2] || "";
const agora = Date.now();
const esfriar = restanteEsfriar(pasta, agora);

if (esfriar > 0) {
  console.log(`ESPERE ${Math.ceil(esfriar)} ${alertaAtual(pasta)}`);
} else if (modo === "2k" && restante2k(pasta, agora) > 0) {
  console.log(`ESPERE ${Math.ceil(restante2k(pasta, agora))} espaco-entre-2k`);
} else if (modo === "gerar") {
  const arq = join(pasta, "ritmo.json");
  let ritmo = {};
  try { ritmo = JSON.parse(readFileSync(arq, "utf8")); } catch { /* primeiro lote */ }
  if (ritmo.proximoGerar && agora < ritmo.proximoGerar) {
    console.log(`ESPERE ${Math.ceil((ritmo.proximoGerar - agora) / 60000)} ritmo-entre-lotes`);
  } else {
    const lotes = (ritmo.lotes || 0) + 1;
    const longa = lotes % LOTES_ATE_PAUSA_LONGA === 0;
    const min = longa ? sortearMin(PAUSA_LONGA_MIN, PAUSA_LONGA_MAX) : sortearMin(GERAR_MIN, GERAR_MAX);
    const proximoGerar = Math.round(agora + min * 60000);
    writeFileSync(arq, JSON.stringify({ lotes, quando: new Date(agora).toISOString(), proximoGerar,
      proximoGerarLegivel: new Date(proximoGerar).toISOString() }));
    console.log("PODE");
  }
} else {
  console.log("PODE");
}
