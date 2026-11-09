// Baixa em 2K as imagens a..b da galeria do projeto no Flow (0 = mais nova), pulando de 2 em 2 porque a galeria
// duplica cada foto. Colar no console (ou javascript_tool) com a aba da galeria em primeiro plano; depois:
// __baixar2k(3, 37) sem await (o laco segue rodando na pagina). Progresso em document.documentElement.dataset.b2k
// (JSON: i, ok, falhas, seguidas, fim, parou) que a extensao vigia le. Regras (cada uma nasceu de um erro real):
// faixa maxima 38 (a galeria descarrega o topo e os indices deslizam); try/catch por posicao; 2 falhas de 2K
// seguidas = para (limite da conta, insistir so gasta tempo).
window.__baixar2k = async (a, b, passo = 2) => {
  if (b - a > 38) throw new Error('faixa grande demais: maximo 38 posicoes por rodada');
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const acha = (txt) => [...document.querySelectorAll('[role=menuitem],button,div,span')]
    .filter(e => e.offsetParent && e.textContent.trim().startsWith(txt))
    .sort((x, y) => x.textContent.length - y.textContent.length)[0];
  const fecha = () => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  const falhou = () => /Falha no aumento de resolu/i.test(document.body.innerText || '');
  const est = {a, b, i: a, ok: 0, falhas: 0, seguidas: 0, fim: false, parou: ''};
  const salva = () => { document.documentElement.dataset.b2k = JSON.stringify(est); };
  const log = window.__log = [];
  window.__fim = false;
  for (let i = a; i <= b; i += passo) {
    est.i = i; salva();
    try {
      for (let t = 0; t < 10 && falhou(); t++) await espera(500);
      const img = [...document.querySelectorAll('img')].filter(x => x.width > 100)[i];
      if (!img) { log.push(i + ':sem imagem'); continue; }
      img.scrollIntoView({block: 'center'}); await espera(800);
      const r = img.getBoundingClientRect();
      const o = {bubbles: true, cancelable: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, button: 2};
      img.dispatchEvent(new MouseEvent('contextmenu', o)); await espera(700);
      const dl = acha('Fazer o download');
      if (!dl) { log.push(i + ':sem menu'); fecha(); continue; }
      for (const t of ['pointerover', 'pointerenter', 'mouseover', 'mouseenter', 'pointermove', 'mousemove'])
        dl.dispatchEvent(new MouseEvent(t, {bubbles: true}));
      dl.click(); await espera(700);
      const k2 = acha('2K');
      if (!k2) { log.push(i + ':sem 2K'); fecha(); continue; }
      k2.click();
      let ruim = false;
      for (let t = 0; t < 8 && !ruim; t++) { await espera(500); ruim = falhou(); }
      if (ruim) { est.falhas++; est.seguidas++; log.push(i + ':falha2k'); }
      else { est.ok++; est.seguidas = 0; log.push(i + ':ok'); await espera(1000); }
    } catch (e) { log.push(i + ':erro ' + e); fecha(); }
    if (est.seguidas >= 2) { est.parou = 'limite2k'; break; }
  }
  est.fim = true; window.__fim = true; salva();
  return log;
};
