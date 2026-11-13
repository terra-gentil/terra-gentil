// Receptor local do TG Vigia: escuta 127.0.0.1:47812 (PORTA), recebe o estado e grava em saida/ (SAIDA):
// origem "galeria" vai para estado-2k.json, o resto para estado.json; todo POST entra no historico.ndjson.
// Origem "pulso" nao grava nada, so busca comando. Alerta de limite ou atividade incomum grava alerta.json e
// abre um resfriamento (ESFRIAR_MIN, padrao 60 min) em que o comando de 2K e recusado (parou "esfriando").
// Comandos de saida/comando.txt, respondidos UMA vez em 200 {"comando": ...} e apagados: "recarregar" (qualquer
// POST), "2k a b [passo]" e "parar2k" (so em POST da galeria, para cair na aba certa). So aceita POST /estado.
// Uso: node receptor.mjs
import { createServer } from "node:http";
import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync, unlinkSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pasta = process.env.SAIDA || join(dirname(fileURLToPath(import.meta.url)), "saida");
const porta = Number(process.env.PORTA || 47812);
const esfriarMs = Number(process.env.ESFRIAR_MIN || 60) * 60000;
const paradas = ["limite", "incomum"];
const valido = (c) => c === "recarregar" || c === "parar2k" || /^2k \d+ \d+( \d)?$/.test(c);
const daGaleria = (origem) => origem === "galeria" || origem === "pulso";
mkdirSync(pasta, { recursive: true });

const esfriando = () => {
  try { return Date.now() - statSync(join(pasta, "alerta.json")).mtimeMs < esfriarMs; } catch { return false; }
};

const pegarComando = (origem) => {
  const arq = join(pasta, "comando.txt");
  if (!existsSync(arq)) return null;
  const c = readFileSync(arq, "utf8").trim();
  if (!valido(c)) { unlinkSync(arq); return null; }
  if (c !== "recarregar" && !daGaleria(origem)) return null; // fica guardado ate o pulso da galeria
  unlinkSync(arq);
  if (c.startsWith("2k") && esfriando()) {
    const recusa = { origem: "galeria", fim: true, parou: "esfriando", quando: new Date().toISOString() };
    writeFileSync(join(pasta, "estado-2k.json"), JSON.stringify(recusa));
    return null;
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
        // nao renova o resfriamento enquanto o mesmo aviso continua na tela
        // a ferramenta as vezes so avisa pelo status (bloqueado_limite), sem o campo alerta (12/11/2026)
        const porStatus = /limite|incomum/i.test(String(estado.status || ""));
        if ((paradas.includes(estado.alerta) || paradas.includes(estado.parou) || porStatus) && !esfriando()) {
          writeFileSync(join(pasta, "alerta.json"), JSON.stringify(estado));
        }
      }
      const comando = pegarComando(estado.origem);
      if (comando) return res.writeHead(200, { ...cabecalhos, "Content-Type": "application/json" })
        .end(JSON.stringify({ comando }));
      res.writeHead(204, cabecalhos).end();
    } catch {
      res.writeHead(400, cabecalhos).end();
    }
  });
}).listen(porta, "127.0.0.1", () => console.log("receptor no ar em 127.0.0.1:" + porta));
