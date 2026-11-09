// TG Vigia das Fotos, leitor da GALERIA (pagina principal do projeto no Flow, so o quadro de cima). A cada 2 s le o
// progresso do laco de 2K (document.documentElement.dataset.b2k, gravado pelo baixar2k.js) e se aparece o aviso
// "Falha no aumento de resolucao". Manda {tipo: "estado", dados: {origem: "galeria", ...}} ao fundo.js quando muda.
// Nao clica, nao altera a pagina. Recebe: nada. Devolve: mensagens chrome.runtime.
(() => {
  let ultimo = "";
  const falar = (msg) => { try { chrome.runtime.sendMessage(msg); } catch (e) { /* extensao recarregada */ } };
  setInterval(() => {
    let laco = null;
    try { laco = JSON.parse(document.documentElement.dataset.b2k || "null"); } catch (e) { laco = null; }
    const toastFalha = /Falha no aumento de resolu/i.test(document.body.innerText || "");
    if (!laco && !toastFalha) return;
    const dados = { origem: "galeria", ...(laco || {}), toastFalha };
    const chave = JSON.stringify(dados);
    if (chave === ultimo) return;
    ultimo = chave;
    falar({ tipo: "estado", dados });
  }, 2000);
})();
