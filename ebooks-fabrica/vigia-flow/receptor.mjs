// Receptor local do TG Vigia: escuta 127.0.0.1:47812 (PORTA), recebe o estado e grava em saida/ (SAIDA):
// origem "galeria" vai para estado-2k.json, o resto para estado.json; todo POST entra no historico.ndjson.
// Se existir saida/comando.txt com "recarregar", responde 200 {"comando":"recarregar"} UMA vez e apaga o arquivo
// (a extensao se recarrega). So aceita POST /estado. Uso: node receptor.mjs
import { createServer } from "node:http";
import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pasta = process.env.SAIDA || join(dirname(fileURLToPath(import.meta.url)), "saida");
const porta = Number(process.env.PORTA || 47812);
const comandos = ["recarregar"];
mkdirSync(pasta, { recursive: true });

const pegarComando = () => {
  const arq = join(pasta, "comando.txt");
  if (!existsSync(arq)) return null;
  const c = readFileSync(arq, "utf8").trim();
  unlinkSync(arq);
  return comandos.includes(c) ? c : null;
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
      const arq = estado.origem === "galeria" ? "estado-2k.json" : "estado.json";
      writeFileSync(join(pasta, arq), JSON.stringify(estado));
      appendFileSync(join(pasta, "historico.ndjson"), JSON.stringify(estado) + "\n");
      const comando = pegarComando();
      if (comando) return res.writeHead(200, { ...cabecalhos, "Content-Type": "application/json" })
        .end(JSON.stringify({ comando }));
      res.writeHead(204, cabecalhos).end();
    } catch {
      res.writeHead(400, cabecalhos).end();
    }
  });
}).listen(porta, "127.0.0.1", () => console.log("receptor no ar em 127.0.0.1:" + porta));
