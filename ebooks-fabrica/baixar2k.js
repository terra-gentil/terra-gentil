// PLANO B, evitar. O caminho normal agora e a extensao vigia (vigia-flow/laco2k.js, comando "2k a b passo" em
// vigia-flow/saida/comando.txt), que roda no mundo isolado. Este arquivo, colado no console, deixa pegada na
// pagina: variaveis em window, atributo data-b2k, e pede Trusted Types e localStorage para ser carregado.
// Baixa em 2K as imagens a..b da galeria do projeto no Flow (0 = mais nova). Uso: __baixar2k(3, 37) sem await.
// Progresso em document.documentElement.dataset.b2k (JSON: i, ok, falhas, seguidas, fim, parou). Regras (cada
// uma nasceu de um erro real): faixa maxima 38; try/catch por posicao; esperas sorteadas, nunca fixas; PARA na
// primeira falha de 2K e no primeiro aviso de limite ou atividade incomum (insistir piora); blocos de retrato
// tem so ~92 px de largura, entao o filtro de imagem usa altura (> 100) e nao largura.
window.__baixar2k = async (a, b, passo = 2) => {
  if (b - a > 38) throw new Error('faixa grande demais: maximo 38 posicoes por rodada');
  const espera = (min, max) => new Promise(r => setTimeout(r, min + (max - min) * (Math.random() + Math.random()) / 2));
  const acha = (txt) => [...document.querySelectorAll('[role=menuitem],button,div,span')]
    .filter(e => e.offsetParent && e.textContent.trim().startsWith(txt))
    .sort((x, y) => x.textContent.length - y.textContent.length)[0];
  const fecha = () => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  const tela = () => document.body.innerText || '';
  const falhou = () => /Falha no aumento de resolu/i.test(tela());
  const aviso = () => /atividade incomum|unusual activity/i.test(tela()) ? 'incomum' : /Limite do Flow/i.test(tela()) ? 'limite' : '';
  const ponto = (el) => {
    const r = el.getBoundingClientRect();
    return {bubbles: true, cancelable: true, clientX: r.x + r.width * (0.3 + Math.random() * 0.4), clientY: r.y + r.height * (0.3 + Math.random() * 0.4)};
  };
  const passa = (el, o = ponto(el)) => {
    for (const t of ['pointerover', 'pointerenter', 'mouseover', 'mouseenter', 'pointermove', 'mousemove']) el.dispatchEvent(new MouseEvent(t, o));
  };
  const est = {a, b, i: a, ok: 0, falhas: 0, seguidas: 0, fim: false, parou: ''};
  const salva = () => { document.documentElement.dataset.b2k = JSON.stringify(est); };
  const log = window.__log = [];
  window.__fim = false;
  for (let i = a; i <= b && !est.parou; i += passo) {
    est.i = i; salva();
    try {
      est.parou = aviso(); if (est.parou) break;
      if (falhou()) { est.parou = 'limite2k'; break; }
      const img = [...document.querySelectorAll('img')].filter(x => x.width > 60 && x.height > 100)[i];
      if (!img) { log.push(i + ':sem imagem'); continue; }
      img.scrollIntoView({block: 'center', behavior: 'smooth'}); await espera(1500, 3200);
      const o = ponto(img); passa(img, o);
      img.dispatchEvent(new MouseEvent('contextmenu', {...o, button: 2, buttons: 2})); await espera(900, 1900);
      const dl = acha('Fazer o download');
      if (!dl) { log.push(i + ':sem menu'); fecha(); await espera(1500, 3500); continue; }
      passa(dl); await espera(350, 900);
      dl.click(); await espera(900, 1900);
      const k2 = acha('2K');
      if (!k2) { log.push(i + ':sem 2K'); fecha(); await espera(1500, 3500); continue; }
      passa(k2); await espera(300, 900);
      k2.click();
      let ruim = false;
      for (let t = 0; t < 8 && !ruim; t++) { await espera(500, 900); ruim = falhou(); }
      if (ruim) { est.falhas++; est.seguidas++; est.parou = 'limite2k'; log.push(i + ':falha2k'); }
      else {
        est.ok++; est.seguidas = 0; log.push(i + ':ok');
        await espera(12000, 20000);
        if (Math.random() < 0.15) await espera(20000, 45000);
      }
    } catch (e) { log.push(i + ':erro ' + e); fecha(); }
  }
  est.fim = true; window.__fim = true; salva();
  return log;
};
