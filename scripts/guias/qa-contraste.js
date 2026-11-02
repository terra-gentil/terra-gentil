// QA de contraste da pagina de livro (WCAG AA). Rodar no navegador, na pagina /guias/<slug> ja aberta
// (console do DevTools ou javascript_tool do Chrome). Devolve 'ok' ou a lista do que nao da pra ler.
// Motivo: em 01/11/2026 o botao de baixo saiu ambar sobre laranja (1.07:1) porque `.bp-content a` venceu `.lv-botao`.
(() => {
  const parse = (c) => {
    const m = c.match(/[\d.]+/g);
    return m ? m.map(Number) : null;
  };
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const fundo = (el) => {
    while (el) {
      const c = parse(getComputedStyle(el).backgroundColor);
      if (c && (c[3] === undefined || c[3] > 0.5)) return c;
      el = el.parentElement;
    }
    return [255, 255, 255];
  };
  const falhas = [];
  document.querySelectorAll('.lv-pag *').forEach((el) => {
    const txt = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim())
      .join(' ');
    if (!txt) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const fg = parse(cs.color);
    const bg = fundo(el);
    const [a, b] = [lum(fg), lum(bg)];
    const razao = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    if (razao < (grande ? 3 : 4.5)) {
      falhas.push(`${razao.toFixed(2)} | ${el.tagName}.${String(el.className).slice(0, 40)} | ${cs.color} sobre rgb(${bg.join(',')}) | ${txt.slice(0, 40)}`);
    }
  });
  // Todos os botoes de download precisam ter a mesma cor de texto (o de cima e o de baixo).
  const cores = [...document.querySelectorAll('.lv-botao__texto')].map((t) => getComputedStyle(t).color);
  if (new Set(cores).size > 1) falhas.push(`botoes de download com cores diferentes: ${cores.join(' / ')}`);
  return falhas.length ? falhas.join('\n') : 'ok';
})();
