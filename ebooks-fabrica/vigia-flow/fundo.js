// TG Vigia das Fotos, fundo (service worker). Recebe {tipo: "estado", dados} dos leitores e entrega ao receptor
// local (receptor.mjs, 127.0.0.1:47812) com a hora. Receptor fora do ar: tenta de novo na proxima mensagem.
// Resposta {comando: "recarregar"} (arquivo saida/comando.txt): a extensao se recarrega. Outros comandos
// ("2k a b [passo]", "parar2k") sao repassados a aba que mandou a mensagem. Se o estado traz alerta de limite ou
// atividade incomum, manda "parar-fila" a todos os quadros dessa aba na hora (para a geracao e o laco de 2K).
// Nada sai pra internet. Recebe: mensagens. Devolve: POST local e chrome.tabs.sendMessage.
const RECEPTOR = "http://127.0.0.1:47812/estado";
const PARADAS = ["limite", "incomum"];
const mandar = (aba, comando) => {
  if (aba === null) return;
  try { chrome.tabs.sendMessage(aba, { tipo: "comando", comando }).catch(() => {}); } catch (e) { /* aba fechada */ }
};
chrome.runtime.onMessage.addListener((msg, quem) => {
  if (!msg || msg.tipo !== "estado" || !msg.dados) return;
  const aba = quem && quem.tab ? quem.tab.id : null;
  if (PARADAS.includes(msg.dados.alerta) || PARADAS.includes(msg.dados.parou)) mandar(aba, "parar-fila");
  const corpo = JSON.stringify({ ...msg.dados, quando: new Date().toISOString() });
  fetch(RECEPTOR, { method: "POST", headers: { "Content-Type": "application/json" }, body: corpo })
    .then((r) => (r.status === 200 ? r.json() : null))
    .then((j) => {
      if (!j || !j.comando) return;
      if (j.comando === "recarregar") chrome.runtime.reload();
      else mandar(aba, j.comando);
    })
    .catch(() => {});
});
