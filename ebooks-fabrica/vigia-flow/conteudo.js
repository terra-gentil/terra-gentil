// TG Vigia das Fotos, leitor (roda DENTRO da moldura da ferramenta Fotos Ebook TG, no mundo isolado). Em
// intervalos sorteados (4 a 8 s) le a div escondida #estado-fotos (data-status, data-prontas, data-falhas,
// data-gerando; pedido da rodada 5) e, quando algo muda, manda {tipo: "estado"} ao fundo.js. Sem a div, le os
// contadores do cabecalho como plano B. Junta "alerta" (limite ou atividade incomum) quando o texto aparece.
// Nao altera a pagina nem fala com a internet. Unico clique: o botao "Parar" da propria ferramenta, uma vez,
// quando o fundo.js manda {tipo: "comando", comando: "parar-fila"} e ha foto gerando.
// Eco (v1.4): com a tela parada, repete o mesmo estado a cada 3 a 6 min com eco: true. O receptor so grava o
// eco em saida/vivo.json (prova de que a extensao esta viva e qual versao), nunca no estado.json. Sem eco, uma
// ferramenta ociosa nao mandava nada e parecia extensao morta (13/11/2026, 18:38 em diante).
(() => {
  const TG = globalThis.TG;
  let ultimo = "", vivo = true, parei = false, ultimaFala = 0, proximoEco = TG.jitter(180000, 360000);
  // extensao recarregada: o contexto morre (runtime.id some) e o script velho para de vez, sem erro na pagina
  const falar = (msg) => {
    try {
      if (!chrome.runtime || !chrome.runtime.id) { vivo = false; return; }
      const p = chrome.runtime.sendMessage(msg);
      if (p && p.catch) p.catch(() => {});
    } catch (e) { vivo = false; }
  };
  const contador = (rotulo, t) => {
    const m = t.match(new RegExp(rotulo + "\\s*:?\\s*(\\d+)", "i"));
    return m ? Number(m[1]) : null;
  };
  const olhar = () => {
    const div = document.getElementById("estado-fotos");
    const t = document.body.innerText || "";
    let dados;
    if (div) {
      dados = {
        origem: "div",
        status: (div.getAttribute("data-status") || "").trim().toLowerCase(),
        prontas: div.getAttribute("data-prontas") || "",
        falhas: div.getAttribute("data-falhas") || "",
        gerando: (div.getAttribute("data-gerando") || "").trim(),
      };
    } else if (/Prontas/i.test(t) && /Gerando/i.test(t)) {
      dados = {
        origem: "cabecalho",
        status: "",
        pendentes: contador("Pendentes", t),
        gerando: contador("Gerando", t),
        conferindo: contador("Conferindo", t),
        prontas: contador("Prontas", t),
      };
    } else return;
    const alerta = TG.sinalDeParada(t);
    if (alerta) dados.alerta = alerta;
    const chave = JSON.stringify(dados);
    if (chave === ultimo) {
      if (Date.now() - ultimaFala < proximoEco) return;
      dados.eco = true;
    }
    ultimo = chave; ultimaFala = Date.now(); proximoEco = TG.jitter(180000, 360000);
    falar({ tipo: "estado", dados });
  };
  const volta = () => { if (!vivo) return; olhar(); setTimeout(volta, TG.jitter(4000, 8000)); };
  setTimeout(volta, TG.jitter(4000, 8000));

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.tipo !== "comando" || msg.comando !== "parar-fila" || parei) return;
    const div = document.getElementById("estado-fotos");
    if (!div || !(div.getAttribute("data-gerando") || "").trim()) return;
    const rotulo = (b) => (b.getAttribute("aria-label") || b.textContent || "").trim();
    const botao = [...document.querySelectorAll("button")].find((b) => /^parar$/i.test(rotulo(b)) && !b.disabled);
    if (!botao) return;
    parei = true;
    setTimeout(() => botao.click(), TG.jitter(600, 1800));
  });
})();
