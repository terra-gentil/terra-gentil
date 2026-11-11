// TG Vigia das Fotos, leitor (roda DENTRO da moldura da ferramenta Fotos Ebook TG, no mundo isolado). Em
// intervalos sorteados (2,5 a 5 s) le a div escondida #estado-fotos (data-status, data-prontas, data-falhas,
// data-gerando; pedido da rodada 5) e, quando algo muda, manda {tipo: "estado"} ao fundo.js. Sem a div, le os
// contadores do cabecalho como plano B. Junta "alerta" (limite ou atividade incomum) quando o texto aparece.
// Nao altera a pagina nem fala com a internet. Unico clique: o botao "Parar" da propria ferramenta, uma vez,
// quando o fundo.js manda {tipo: "comando", comando: "parar-fila"} e ha foto gerando.
(() => {
  const TG = globalThis.TG;
  let ultimo = "", vivo = true, parei = false;
  const falar = (msg) => { try { chrome.runtime.sendMessage(msg); } catch (e) { vivo = false; /* recarregada */ } };
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
    if (chave === ultimo) return;
    ultimo = chave;
    falar({ tipo: "estado", dados });
  };
  const volta = () => { if (!vivo) return; olhar(); setTimeout(volta, TG.jitter(2500, 5000)); };
  setTimeout(volta, TG.jitter(2500, 5000));

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
