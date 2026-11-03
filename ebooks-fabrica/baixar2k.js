// Baixa em 2K as imagens a..b da galeria do projeto no Flow (0 = mais nova). Colar no console
// (ou javascript_tool) com a aba da galeria em primeiro plano; depois: await __baixar2k(0, 13)
// Uma chamada longa estoura o tempo do javascript_tool, mas o laco segue rodando na pagina.
window.__baixar2k = async (a, b) => {
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const acha = (txt) => [...document.querySelectorAll('[role=menuitem],button,div,span')]
    .filter(e => e.offsetParent && e.textContent.trim().startsWith(txt))
    .sort((x, y) => x.textContent.length - y.textContent.length)[0];
  const fecha = () => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  const log = [];
  for (let i = a; i <= b; i++) {
    const img = [...document.querySelectorAll('img')].filter(x => x.width > 100)[i];
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
    k2.click(); log.push(i + ':ok'); await espera(4000);
  }
  return log;
};
