// Espera o fim da geracao lendo saida/estado.json (o receptor grava): sai quando nao ha foto gerando, houve ao
// menos uma pronta e o estado ficou parado por --quieto segundos (padrao 60). Sai tambem com "sem sinal" se o
// arquivo nao muda ha --sem-sinal segundos (padrao 300) e com "limite" se o status falar em limite.
// Uso: node esperar-fim.mjs [--quieto 60] [--sem-sinal 300] [--maximo 3000]. Imprime UMA linha: VIGIA <motivo> <estado>.
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const arq = join(dirname(fileURLToPath(import.meta.url)), "saida", "estado.json");
const arg = (nome, padrao) => {
  const i = process.argv.indexOf("--" + nome);
  return i > -1 ? Number(process.argv[i + 1]) : padrao;
};
const quieto = arg("quieto", 60), semSinal = arg("sem-sinal", 300), maximo = arg("maximo", 3000);
const inicio = Date.now();
const idade = () => { try { return (Date.now() - statSync(arq).mtimeMs) / 1000; } catch { return Infinity; } };
const ler = () => { try { return JSON.parse(readFileSync(arq, "utf8")); } catch { return null; } };
const vazio = (v) => v === "" || v === null || v === undefined || v === 0 || v === "0";

while (true) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = ler(), parado = idade(), total = (Date.now() - inicio) / 1000;
  const resumo = s ? JSON.stringify(s) : "sem arquivo";
  if (s && (/limite/i.test(JSON.stringify(s)) || (/com_falhas/i.test(s.status || "") && vazio(s.gerando)))) { console.log("VIGIA limite " + resumo); break; }
  if (parado > semSinal) { console.log("VIGIA sem-sinal " + resumo); break; }
  if (total > maximo) { console.log("VIGIA demorou " + resumo); break; }
  if (s && vazio(s.gerando) && !vazio(s.prontas) && parado >= quieto) { console.log("VIGIA fim " + resumo); break; }
}

