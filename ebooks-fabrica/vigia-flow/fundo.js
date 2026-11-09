// TG Vigia das Fotos, fundo (service worker). Recebe {tipo: "estado", dados} dos leitores e entrega ao receptor
// local (receptor.mjs, 127.0.0.1:47812) com a hora. Receptor fora do ar: tenta de novo na proxima mensagem.
// Se o receptor responder {comando: "recarregar"} (arquivo saida/comando.txt), a extensao se recarrega e assim
// atualiza a si mesma depois que eu edito os arquivos. Nada sai pra internet. Recebe: mensagens. Devolve: POST local.
const RECEPTOR = "http://127.0.0.1:47812/estado";
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.tipo !== "estado") return;
  const corpo = JSON.stringify({ ...msg.dados, quando: new Date().toISOString() });
  fetch(RECEPTOR, { method: "POST", headers: { "Content-Type": "application/json" }, body: corpo })
    .then((r) => (r.status === 200 ? r.json() : null))
    .then((j) => { if (j && j.comando === "recarregar") chrome.runtime.reload(); })
    .catch(() => {});
});
