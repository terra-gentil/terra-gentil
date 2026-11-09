// Testes automaticos do vigia. Cada teste guarda um erro que ja aconteceu ou um contrato que a extensao exige.
// Uso: node --test vigia.test.mjs (na pasta vigia-flow). Rode antes de mandar recarregar a extensao.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const ler = (p) => readFileSync(join(aqui, p), "utf8");

test("manifest valido e todos os arquivos citados existem", () => {
  const m = JSON.parse(ler("manifest.json"));
  assert.equal(m.manifest_version, 3);
  const arquivos = [m.background.service_worker, ...m.content_scripts.flatMap((c) => c.js)];
  for (const a of arquivos) assert.ok(existsSync(join(aqui, a)), "falta " + a);
  assert.ok(m.host_permissions.includes("https://flow.google.com/*"), "galeria sem permissao");
});

test("scripts da extensao e o laco de 2K tem sintaxe valida", () => {
  for (const a of ["conteudo.js", "conteudo-galeria.js", "fundo.js", "../baixar2k.js"]) {
    assert.doesNotThrow(() => new Function(ler(a)), a);
  }
});

test("laco de 2K mantem as travas aprendidas", () => {
  const t = ler("../baixar2k.js");
  assert.match(t, /b - a > 38/, "faixa maxima sumiu");
  assert.match(t, /seguidas >= 2/, "trava de 2 falhas sumiu");
  assert.match(t, /catch \(e\)/, "try/catch por posicao sumiu");
  assert.match(t, /passo = 2/, "passo de 2 (galeria duplica foto) sumiu");
});

test("vigia do 2K tem folga para aba em segundo plano", () => {
  assert.match(ler("esperar-2k.mjs"), /"sem-sinal", 300/, "sem-sinal abaixo de 300 s encerra o vigia com o laco vivo");
});

test("vigia da geracao trata com_falhas como limite, nao como fim limpo", () => {
  assert.match(ler("esperar-fim.mjs"), /com_falhas/, "fila interrompida por limite virou 'fim' e eu nao soube");
});

test("vigia do 2K nao depende de campo quando vindo da pagina", () => {
  assert.doesNotMatch(ler("esperar-2k.mjs"), /s\.quando/, "POST injetado na pagina nao tem quando: limite virava sem-sinal");
});

test("receptor separa a galeria e manda recarregar so uma vez", async () => {
  const saida = mkdtempSync(join(tmpdir(), "vigia-"));
  const porta = 47900 + Math.floor(Math.random() * 90);
  const filho = spawn("node", [join(aqui, "receptor.mjs")], { env: { ...process.env, SAIDA: saida, PORTA: String(porta) } });
  await new Promise((ok) => filho.stdout.once("data", ok));
  const post = (o) => fetch(`http://127.0.0.1:${porta}/estado`, { method: "POST", body: JSON.stringify(o) });
  try {
    assert.equal((await post({ origem: "galeria", i: 3 })).status, 204);
    assert.ok(existsSync(join(saida, "estado-2k.json")));
    assert.ok(!existsSync(join(saida, "estado.json")), "galeria nao pode sobrescrever o estado das fotos");
    writeFileSync(join(saida, "comando.txt"), "recarregar");
    const r = await post({ origem: "div" });
    assert.deepEqual(await r.json(), { comando: "recarregar" });
    assert.equal((await post({ origem: "div" })).status, 204, "comando nao pode repetir");
    writeFileSync(join(saida, "comando.txt"), "apagar-tudo");
    assert.equal((await post({ origem: "div" })).status, 204, "comando fora da lista precisa ser ignorado");
  } finally { filho.kill(); }
});
