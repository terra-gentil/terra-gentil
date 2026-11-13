// TG Vigia das Fotos, GALERIA (pagina principal do projeto no Flow, so o quadro de cima). Roda no mundo isolado
// da extensao: nao cria variavel em window, nao grava atributo, nao usa localStorage nem Trusted Types da pagina.
// 1) Le a tela em intervalos sorteados e avisa o fundo.js quando aparece "Limite do Flow", atividade incomum ou
//    "Falha no aumento de resolucao" ({tipo: "estado", dados: {origem: "galeria", alerta, toastFalha, ...}}).
// 2) Fora da tela da ferramenta, manda um pulso a cada 15 a 25 s para buscar comando do receptor.
// 3) Ao receber {tipo: "comando", comando: "2k a b [passo]"}, roda o laco de 2K (laco2k.js) nesta aba, em ritmo
//    humano; "parar2k" ou "parar-fila" cancelam. So aqui a extensao clica, e so no menu de download.
// Plano B antigo (../baixar2k.js colado no console) ainda e lido pelo data-b2k, mas deixa pegada na pagina.
(() => {
  const TG = globalThis.TG;
  let ultimo = "", vivo = true, rodando = false, cancelar = false, progresso = null;
  const falar = (msg) => { try { chrome.runtime.sendMessage(msg); } catch (e) { vivo = false; /* recarregada */ } };
  const texto = () => document.body.innerText || "";
  const naFerramenta = () => /\/tool\//.test(location.pathname);
  const ponto = (el) => {
    const r = el.getBoundingClientRect();
    return {
      bubbles: true, cancelable: true, view: window,
      clientX: r.x + r.width * (0.3 + Math.random() * 0.4),
      clientY: r.y + r.height * (0.3 + Math.random() * 0.4),
    };
  };
  const passar = (el, o = ponto(el)) => {
    for (const t of ["pointerover", "pointerenter", "mouseover", "mouseenter", "pointermove", "mousemove"])
      el.dispatchEvent(new MouseEvent(t, o));
  };

  const amb = {
    texto,
    agora: () => Date.now(),
    cancelado: () => cancelar || !vivo,
    esperar: (ms) => new Promise((r) => setTimeout(r, ms)),
    relatar: (est) => { progresso = { ...est }; olhar(); },
    // blocos de retrato tem ~92 px de largura: o filtro e por ALTURA, senao o indice nao bate com a grade
    imagens: () => [...document.querySelectorAll("img")].filter((x) => x.width > 60 && x.height > 100),
    rolar: (img) => img.scrollIntoView({ block: "center", behavior: "smooth" }),
    menu: (img) => {
      const o = ponto(img);
      passar(img, o);
      img.dispatchEvent(new MouseEvent("contextmenu", { ...o, button: 2, buttons: 2 }));
    },
    acha: (txt) => [...document.querySelectorAll("[role=menuitem],button,div,span")]
      .filter((e) => e.offsetParent && e.textContent.trim().startsWith(txt))
      .sort((x, y) => x.textContent.length - y.textContent.length)[0],
    passar,
    clicar: (el) => el.click(),
    fechar: () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
  };

  function olhar() {
    let laco = progresso;
    if (!laco) { try { laco = JSON.parse(document.documentElement.dataset.b2k || "null"); } catch (e) { laco = null; } }
    const t = texto();
    // na tela da ferramenta o quadro de cima guarda a conversa do Criador, que cita "Limite do Flow": alarme
    // falso (13/11/2026). Ali o limite vem do quadro da ferramenta (conteudo.js); aqui so vale atividade incomum.
    let alerta = TG.sinalDeParada(t);
    if (naFerramenta() && alerta === "limite") alerta = "";
    const toastFalha = TG.falha2k(t);
    if (!laco && !toastFalha && !alerta) return;
    const dados = { origem: "galeria", ...(laco || {}), toastFalha, alerta };
    const chave = JSON.stringify(dados);
    if (chave === ultimo) return;
    ultimo = chave;
    falar({ tipo: "estado", dados });
  }

  const repetir = (fn, min, max) => {
    const volta = () => { if (!vivo) return; fn(); setTimeout(volta, TG.jitter(min, max)); };
    setTimeout(volta, TG.jitter(min, max));
  };
  repetir(olhar, 2500, 5000);
  repetir(() => {
    if (!naFerramenta() && document.visibilityState === "visible") falar({ tipo: "estado", dados: { origem: "pulso" } });
  }, 15000, 25000);

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.tipo !== "comando") return;
    const c = String(msg.comando || "");
    if (c === "parar2k" || c === "parar-fila") { cancelar = true; return; }
    const m = c.match(/^2k (\d+) (\d+)(?: (\d+))?$/);
    if (!m || rodando || naFerramenta()) return;
    rodando = true; cancelar = false;
    TG.rodarLaco2k({ a: Number(m[1]), b: Number(m[2]), passo: Number(m[3] || 2) }, amb)
      .finally(() => { rodando = false; });
  });
})();
