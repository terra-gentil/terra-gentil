// Diz se da para gerar ou baixar agora. Le saida/alerta.json (gravado pelo receptor no aviso de limite ou de
// atividade incomum) e imprime UMA linha: "PODE" ou "ESPERE <minutos> <alerta>". Resfriamento: ESFRIAR_MIN
// (padrao 60). Rodar ANTES de cada "Gerar selecionadas" e de cada comando de 2K. Uso: node pode.mjs
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const arq = join(process.env.SAIDA || join(dirname(fileURLToPath(import.meta.url)), "saida"), "alerta.json");
const esfriarMin = Number(process.env.ESFRIAR_MIN || 60);
let idadeMin = Infinity;
try { idadeMin = (Date.now() - statSync(arq).mtimeMs) / 60000; } catch { /* sem alerta */ }
if (idadeMin >= esfriarMin) console.log("PODE");
else console.log(`ESPERE ${Math.ceil(esfriarMin - idadeMin)} ${readFileSync(arq, "utf8")}`);
