// Receptor local do TG Vigia: escuta 127.0.0.1:47812, recebe o estado da ferramenta de fotos e grava
// saida/estado.json (ultimo) e saida/historico.ndjson (um por linha). So aceita POST /estado. Uso: node receptor.mjs
import { createServer } from "node:http";
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pasta = join(dirname(fileURLToPath(import.meta.url)), "saida");
mkdirSync(pasta, { recursive: true });

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
      writeFileSync(join(pasta, "estado.json"), JSON.stringify(estado));
      appendFileSync(join(pasta, "historico.ndjson"), JSON.stringify(estado) + "\n");
      res.writeHead(204, cabecalhos).end();
    } catch {
      res.writeHead(400, cabecalhos).end();
    }
  });
}).listen(47812, "127.0.0.1", () => console.log("receptor no ar em 127.0.0.1:47812"));
