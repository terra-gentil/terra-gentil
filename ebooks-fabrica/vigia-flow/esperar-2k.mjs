// Espera o fim do laco de 2K da galeria. Junta dois sinais: saida/estado-2k.json (progresso e falha, vindos da
// extensao) e os arquivos *_2K.jpg novos em Downloads (prova de que baixou). Imprime UMA linha:
// VIGIA2K fim|limite|sem-sinal|demorou <novos> <estado>. "fim" = laco terminou; "limite" = travou por 2 falhas.
// Uso: node esperar-2k.mjs [--sem-sinal 90] [--maximo 1500]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const arq = join(dirname(fileURLToPath(import.meta.url)), "saida", "estado-2k.json");
const downloads = join(homedir(), "Downloads");
const arg = (nome, padrao) => {
  const i = process.argv.indexOf("--" + nome);
  return i > -1 ? Number(process.argv[i + 1]) : padrao;
};
const semSinal = arg("sem-sinal", 300), maximo = arg("maximo", 1500); // aba em 2o plano fica lenta: nunca menos de 300
const inicio = Date.now();
const ler = () => { try { return JSON.parse(readFileSync(arq, "utf8")); } catch { return null; } };
const idade = () => { try { return (Date.now() - statSync(arq).mtimeMs) / 1000; } catch { return Infinity; } };
const novos = () => readdirSync(downloads).filter((n) => /_2K\.jpg$/i.test(n))
  .filter((n) => statSync(join(downloads, n)).mtimeMs > inicio).length;

while (true) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = ler(), parado = idade(), total = (Date.now() - inicio) / 1000;
  const fim = (motivo) => { console.log(`VIGIA2K ${motivo} ${novos()} ${s ? JSON.stringify(s) : "sem arquivo"}`); process.exit(0); };
  const recente = s && Date.now() - parado * 1000 > inicio; // hora do arquivo, o POST da pagina nao leva "quando"
  if (recente && s.parou === "limite2k") fim("limite");
  if (recente && s.fim) fim("fim");
  if (total > semSinal && !recente) fim("sem-sinal");
  if (total > maximo) fim("demorou");
  if (recente && parado > semSinal) fim("sem-sinal");
}
