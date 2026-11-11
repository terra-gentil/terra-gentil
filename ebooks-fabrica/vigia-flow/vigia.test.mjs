// Testes automaticos do vigia. Cada teste guarda um erro que ja aconteceu ou um contrato que a extensao exige.
// Uso: node --test vigia.test.mjs (na pasta vigia-flow). Rode antes de mandar recarregar a extensao.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import vm from "node:vm";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const ler = (p) => readFileSync(join(aqui, p), "utf8");
const EXTENSAO = ["ritmo.js", "laco2k.js", "conteudo.js", "conteudo-galeria.js", "fundo.js"];

test("manifest valido e todos os arquivos citados existem", () => {
  const m = JSON.parse(ler("manifest.json"));
  assert.equal(m.manifest_version, 3);
  const arquivos = [m.background.service_worker, ...m.content_scripts.flatMap((c) => c.js)];
  for (const a of arquivos) assert.ok(existsSync(join(aqui, a)), "falta " + a);
  assert.ok(m.host_permissions.includes("https://flow.google.com/*"), "galeria sem permissao");
  for (const c of m.content_scripts) assert.equal(c.js[0], "ritmo.js", "ritmo.js precisa carregar antes (define TG)");
});

test("scripts da extensao e o laco de 2K tem sintaxe valida", () => {
  for (const a of [...EXTENSAO, "../baixar2k.js"]) {
    assert.doesNotThrow(() => new Function(ler(a)), a);
  }
});

test("laco de 2K mantem as travas aprendidas", () => {
  const laco = ler("laco2k.js");
  assert.match(laco, /b - a > 38/, "faixa maxima sumiu");
  assert.match(laco, /catch \(e\)/, "try/catch por posicao sumiu");
  assert.match(laco, /passo = 2/, "passo de 2 (galeria duplica foto) sumiu");
  for (const nome of ["conteudo-galeria.js", "../baixar2k.js"]) {
    const t = ler(nome);
    assert.match(t, /x\.height > 100/, nome + ": filtro por altura sumiu: blocos de retrato (~92 px) saem do indice");
    assert.doesNotMatch(t, /x\.width > 100\)/, nome + ": filtro por largura > 100 pula blocos de retrato");
  }
  const b = ler("../baixar2k.js");
  assert.match(b, /b - a > 38/, "plano B sem faixa maxima");
  assert.match(b, /est\.parou = 'limite2k'/, "plano B precisa parar na primeira falha de 2K");
  assert.doesNotMatch(b, /espera\(\d+\)/, "plano B voltou a ter espera fixa");
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

test("vigia da geracao nao encerra na primeira volta quando nao ha arquivo", () => {
  assert.doesNotMatch(ler("esperar-fim.mjs"), /catch \{ return Infinity/, "idade infinita dispara sem-sinal na hora");
});

// ---- travas contra cara de robo (aviso de atividade incomum do Flow) ----
const carregar = () => {
  const ctx = vm.createContext({});
  vm.runInContext(ler("ritmo.js") + "\n" + ler("laco2k.js"), ctx);
  return ctx.TG;
};
// ambiente de mentira: relogio proprio; a tela muda conforme o numero de cliques no "2K"
const ambiente = (telaPorClique, total = 40) => {
  const amb = {
    t: 0, esperas: [], cliques2k: [], relatos: [],
    rnd: Math.random,
    agora: () => amb.t,
    cancelado: () => false,
    esperar: async (ms) => { amb.esperas.push(ms); amb.t += ms; },
    relatar: (e) => amb.relatos.push(JSON.parse(JSON.stringify(e))),
    texto: () => telaPorClique(amb.cliques2k.length),
    imagens: () => Array.from({ length: total }, (_, i) => ({ i })),
    rolar: () => {}, menu: () => {}, passar: () => {}, fechar: () => {},
    acha: (txt) => ({ txt }),
    clicar: (el) => { if (el.txt === "2K") amb.cliques2k.push(amb.t); },
  };
  return amb;
};

test("jitter fica sempre dentro da faixa e nao e fixo", () => {
  const TG = carregar();
  const vistos = new Set();
  for (let n = 0; n < 2000; n++) {
    const v = TG.jitter(900, 1900);
    assert.ok(v >= 900 && v <= 1900, "fora da faixa: " + v);
    vistos.add(v);
  }
  assert.ok(vistos.size > 100, "jitter sem variacao parece robo");
  assert.equal(TG.jitter(900, 1900, () => 0), 900);
  assert.ok(TG.jitter(900, 1900, () => 0.999999) <= 1900);
});

test("sinal de parada reconhece os avisos do Flow", () => {
  const TG = carregar();
  assert.equal(TG.sinalDeParada("Limite do Flow atingido"), "limite");
  assert.equal(TG.sinalDeParada("Notamos uma atividade incomum. As extensoes do navegador..."), "incomum");
  assert.equal(TG.sinalDeParada("Prontas: 3 Gerando: 1"), "");
  assert.ok(TG.falha2k("Falha no aumento de resolução"));
});

test("laco para no primeiro Limite do Flow e nao clica mais", async () => {
  const TG = carregar();
  const amb = ambiente((cliques) => (cliques >= 2 ? "Limite do Flow atingido" : "galeria"));
  const est = await TG.rodarLaco2k({ a: 0, b: 18, passo: 2 }, amb);
  assert.equal(est.parou, "limite");
  assert.equal(est.fim, true);
  assert.equal(amb.cliques2k.length, 2, "clicou depois do aviso de limite");
  assert.equal(amb.relatos.at(-1).parou, "limite", "a parada precisa chegar ao receptor");
});

test("laco para no primeiro aviso de atividade incomum, antes de qualquer clique", async () => {
  const TG = carregar();
  const amb = ambiente(() => "Notamos uma atividade incomum.");
  const est = await TG.rodarLaco2k({ a: 0, b: 6, passo: 2 }, amb);
  assert.equal(est.parou, "incomum");
  assert.equal(amb.cliques2k.length, 0);
});

test("laco para na PRIMEIRA falha de 2K, sem segunda tentativa", async () => {
  const TG = carregar();
  const amb = ambiente((cliques) => (cliques >= 1 ? "Falha no aumento de resolução" : "galeria"));
  const est = await TG.rodarLaco2k({ a: 0, b: 18, passo: 2 }, amb);
  assert.equal(est.parou, "limite2k");
  assert.equal(est.falhas, 1);
  assert.equal(amb.cliques2k.length, 1, "insistiu depois da falha de 2K");
});

test("laco para quando cancelado (parar2k ou parar-fila)", async () => {
  const TG = carregar();
  const amb = ambiente(() => "galeria");
  amb.cancelado = () => amb.cliques2k.length >= 1;
  const est = await TG.rodarLaco2k({ a: 0, b: 18, passo: 2 }, amb);
  assert.equal(est.parou, "cancelado");
  assert.equal(amb.cliques2k.length, 1);
});

test("laco respeita o teto de downloads por minuto e nunca usa espera fixa", async () => {
  const TG = carregar();
  const amb = ambiente(() => "galeria");
  amb.rnd = () => 0; // pior caso: todas as esperas no minimo da faixa
  const est = await TG.rodarLaco2k({ a: 0, b: 19, passo: 1 }, amb);
  assert.equal(est.ok, 20);
  const c = amb.cliques2k, n = TG.DOWNLOADS_POR_MINUTO;
  for (let i = n; i < c.length; i++) {
    assert.ok(c[i] - c[i - n] >= 60000, "mais de " + n + " downloads em 60 s");
  }
  const solto = ambiente(() => "galeria");
  await TG.rodarLaco2k({ a: 0, b: 9, passo: 1 }, solto);
  assert.ok(new Set(solto.esperas).size > solto.esperas.length / 2, "esperas repetidas demais");
  assert.ok(Math.min(...solto.esperas) >= 300, "espera curta demais entre acoes");
});

test("laco recusa rodada grande demais", async () => {
  const TG = carregar();
  for (const faixa of [{ a: 0, b: 40, passo: 2 }, { a: 0, b: 30, passo: 1 }]) {
    const amb = ambiente(() => "galeria");
    const est = await TG.rodarLaco2k(faixa, amb);
    assert.equal(est.parou, "faixa-invalida");
    assert.equal(amb.cliques2k.length, 0);
  }
});

test("extensao nao deixa pegada na pagina do Flow", () => {
  const m = ler("manifest.json");
  assert.doesNotMatch(m, /"world"\s*:\s*"MAIN"/, "script no mundo principal fica visivel para a pagina");
  assert.doesNotMatch(m, /debugger|scripting|webRequest|declarativeNetRequest/, "permissao que mexe na pagina ou na rede");
  for (const a of EXTENSAO) {
    const t = ler(a).replace(/^\s*\/\/.*$/gm, "");
    assert.doesNotMatch(t, /window\.__|localStorage|trustedTypes|createPolicy|\beval\(/, a + ": global ou politica visivel");
    assert.doesNotMatch(t, /dataset\.\w+\s*=[^=]|setAttribute|appendChild|insertAdjacent|innerHTML\s*=/, a + ": altera o DOM");
    assert.doesNotMatch(t, /\.prototype\.|window\.fetch\s*=|XMLHttpRequest/, a + ": mexe em nativo ou na rede da pagina");
    assert.doesNotMatch(t, /setInterval\(/, a + ": intervalo fixo e regular");
  }
});

test("vigia da geracao para no alerta e o do 2K em qualquer parada", () => {
  assert.match(ler("esperar-fim.mjs"), /alertaNovo\(\)/, "alerta do quadro de cima nao chega ao vigia da geracao");
  assert.match(ler("esperar-fim.mjs"), /incomum/, "atividade incomum precisa encerrar a espera");
  assert.match(ler("esperar-2k.mjs"), /recente && s\.parou\)/, "parada nova (limite, incomum, esfriando) virava sem-sinal");
});

test("receptor separa a galeria, manda recarregar so uma vez e esfria depois de alerta", async () => {
  const saida = mkdtempSync(join(tmpdir(), "vigia-"));
  const porta = 47900 + Math.floor(Math.random() * 90);
  const filho = spawn("node", [join(aqui, "receptor.mjs")], { env: { ...process.env, SAIDA: saida, PORTA: String(porta) } });
  await new Promise((ok) => filho.stdout.once("data", ok));
  const post = (o) => fetch(`http://127.0.0.1:${porta}/estado`, { method: "POST", body: JSON.stringify(o) });
  const historico = () => readFileSync(join(saida, "historico.ndjson"), "utf8");
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
    const antes = historico();
    assert.equal((await post({ origem: "pulso" })).status, 204);
    assert.equal(historico(), antes, "pulso nao pode gravar estado");
    writeFileSync(join(saida, "comando.txt"), "2k 0 7 1");
    assert.equal((await post({ origem: "div" })).status, 204, "comando de 2K nao pode cair na aba da ferramenta");
    assert.deepEqual(await (await post({ origem: "pulso" })).json(), { comando: "2k 0 7 1" });
    assert.equal((await post({ origem: "div", alerta: "incomum" })).status, 204);
    assert.ok(existsSync(join(saida, "alerta.json")), "alerta nao foi gravado");
    writeFileSync(join(saida, "comando.txt"), "2k 0 7 1");
    assert.equal((await post({ origem: "pulso" })).status, 204, "2K liberado durante o resfriamento");
    assert.equal(JSON.parse(readFileSync(join(saida, "estado-2k.json"), "utf8")).parou, "esfriando");
    assert.ok(!existsSync(join(saida, "comando.txt")), "comando recusado nao pode ficar para depois");
  } finally { filho.kill(); }
});
