// Receptor local do TG Vigia: escuta 127.0.0.1:47812 (PORTA), recebe o estado e grava em saida/ (SAIDA):
// origem "galeria" vai para estado-2k.json, o resto para estado.json; todo POST entra no historico.ndjson.
// Origem "pulso" nao grava nada, so busca comando. Alerta de limite ou atividade incomum grava alerta.json e
// abre um resfriamento (regras.mjs: 60 min para limite, 180 para atividade incomum).
// Comandos de saida/comando.txt, respondidos UMA vez em 200 {"comando": ...} e apagados: "recarregar" (qualquer
// POST), "2k a b [passo]" e "parar2k" (so em POST da galeria, para cair na aba certa). So aceita POST /estado.
// Comando de 2K recusado (estado-2k.json com fim e parou, comando apagado): "esfriando" (resfriamento aberto),
// "extensao-velha" (versao abaixo da VERSAO_MINIMA), "gerando" (ferramenta gerando: 2K e geracao nunca juntos),
// "espacando" (menos de INTERVALO_2K_MIN desde a ultima rodada; uma rodada pequena por vez).
// Uso: node receptor.mjs
import { createServer } from "node:http";
import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { restanteEsfriar, alertaAtual, restante2k, gerandoAgora, VERSAO_MINIMA } from "./regras.mjs";

const pasta = process.env.SAIDA || join(dirname(fileURLToPath(import.meta.url)), "saida");
const porta = Number(process.env.PORTA || 47812);
const paradas = ["limite", "incomum"];
const valido = (c) => c === "recarregar" || c === "parar2k" || /^2k \d+ \d+( \d)?$/.test(c);
const daGaleria = (origem) => origem === "galeria" || origem === "pulso";
const versaoOk = (v) => {
  const [maior, menor] = String(v || "0").split(".").map(Number);
  const [mMaior, mMenor] = String(VERSAO_MINIMA).split(".").map(Number);
  return maior > mMaior || (maior === mMaior && (menor || 0) >= mMenor);
};
mkdirSync(pasta, { recursive: true });

const esfriando = () => restanteEsfriar(pasta) > 0;

const recusar2k = (estado) => {
  if (esfriando()) return ["esfriando", Math.ceil(restanteEsfriar(pasta))];
  if (!versaoOk(estado.versao)) return ["extensao-velha", 0];
  if (gerandoAgora(pasta)) return ["gerando", 0];
  if (restante2k(pasta) > 0) return ["espacando", Math.ceil(restante2k(pasta))];
  return null;
};

const pegarComando = (estado) => {
  const arq = join(pasta, "comando.txt");
  if (!existsSync(arq)) return null;
  const c = readFileSync(arq, "utf8").trim();
  if (!valido(c)) { unlinkSync(arq); return null; }
  if (c !== "recarregar" && !daGaleria(estado.origem)) return null; // fica guardado ate o pulso da galeria
  unlinkSync(arq);
  if (c.startsWith("2k")) {
    const recusa = recusar2k(estado);
    if (recusa) {
      const [parou, faltaMin] = recusa;
      writeFileSync(join(pasta, "estado-2k.json"),
        JSON.stringify({ origem: "galeria", fim: true, parou, faltaMin, comando: c, quando: new Date().toISOString() }));
      return null;
    }
    writeFileSync(join(pasta, "ultimo-2k.json"), JSON.stringify({ comando: c, quando: new Date().toISOString() }));
  }
  return c;
};

createServer((req, res) => {
  const cabecalhos = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (req.method === "OPTIONS") return res.writeHead(204, cabecalhos).end();
  if (req.method !== "POST" || req.url !== "/estado") return res.writeHead(404, cabecalhos).end();
  let corpo = "";
  req.on("data", (pedaco) => { corpo += pedaco; if (corpo.length > 20000) req.destroy(); });
  req.on("end", () => {
    try {
      const estado = JSON.parse(corpo);
      if (estado.origem !== "pulso") {
        const arq = estado.origem === "galeria" ? "estado-2k.json" : "estado.json";
        writeFileSync(join(pasta, arq), JSON.stringify(estado));
        appendFileSync(join(pasta, "historico.ndjson"), JSON.stringify(estado) + "\n");
        // a ferramenta as vezes so avisa pelo status (bloqueado_limite), sem o campo alerta (12/11/2026)
        const porStatus = /limite|incomum/i.test(String(estado.status || ""));
        const incomum = estado.alerta === "incomum" || estado.parou === "incomum" || /incomum/i.test(String(estado.status || ""));
        // nao renova o resfriamento enquanto o mesmo aviso continua na tela; atividade incomum por cima de um
        // resfriamento de limite troca para o resfriamento longo
        const subir = incomum && !/incomum/i.test(alertaAtual(pasta));
        if ((paradas.includes(estado.alerta) || paradas.includes(estado.parou) || porStatus) && (!esfriando() || subir)) {
          writeFileSync(join(pasta, "alerta.json"), JSON.stringify(estado));
        }
      }
      const comando = pegarComando(estado);
      if (comando) return res.writeHead(200, { ...cabecalhos, "Content-Type": "application/json" })
        .end(JSON.stringify({ comando }));
      res.writeHead(204, cabecalhos).end();
    } catch {
      res.writeHead(400, cabecalhos).end();
    }
  });
}).listen(porta, "127.0.0.1", () => console.log("receptor no ar em 127.0.0.1:" + porta));
