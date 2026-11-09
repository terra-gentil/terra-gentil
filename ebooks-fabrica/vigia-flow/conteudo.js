// TG Vigia das Fotos, leitor (roda DENTRO da moldura da ferramenta Fotos Ebook TG). A cada 2 s le a div escondida
// #estado-fotos (data-status, data-prontas, data-falhas, data-gerando; pedido da rodada 5) e, quando algo muda,
// manda {tipo: "estado"} ao fundo.js. Sem a div, le os contadores do cabecalho como plano B.
// Nao clica, nao altera a pagina, nao fala com a internet. Recebe: nada. Devolve: mensagens chrome.runtime.
(() => {
  let ultimo = "";
  const falar = (msg) => { try { chrome.runtime.sendMessage(msg); } catch (e) { /* extensao recarregada */ } };
  const contador = (rotulo) => {
    const re = new RegExp(rotulo + "\\s*:?\\s*(\\d+)", "i");
    const m = (document.body.innerText || "").match(re);
    return m ? Number(m[1]) : null;
  };
  setInterval(() => {
    const div = document.getElementById("estado-fotos");
    let dados;
    if (div) {
      dados = {
        origem: "div",
        status: (div.getAttribute("data-status") || "").trim().toLowerCase(),
        prontas: div.getAttribute("data-prontas") || "",
        falhas: div.getAttribute("data-falhas") || "",
        gerando: (div.getAttribute("data-gerando") || "").trim(),
      };
    } else if (/Prontas/i.test(document.body.innerText || "") && /Gerando/i.test(document.body.innerText || "")) {
      dados = {
        origem: "cabecalho",
        status: "",
        pendentes: contador("Pendentes"),
        gerando: contador("Gerando"),
        conferindo: contador("Conferindo"),
        prontas: contador("Prontas"),
      };
    } else return;
    const chave = JSON.stringify(dados);
    if (chave === ultimo) return;
    ultimo = chave;
    falar({ tipo: "estado", dados });
  }, 2000);
})();
