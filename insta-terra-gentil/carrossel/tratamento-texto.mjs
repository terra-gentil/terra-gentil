// Tratamento do texto e dos cartões (roda dentro da página): sombra de profundidade e auto-fit.

// Cartões rotacionados (foto do André, mascote) ganham sombra suave: 0 30px 40px, 45%.
export function sombrearCartoes() {
  const alvos = document.querySelectorAll('img[alt="André"], img[alt^="Mascote"]');
  for (const img of alvos) {
    const cartao = img.closest('[style*="rotate"]');
    if (cartao) cartao.style.filter = 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))';
  }
  return alvos.length;
}

// Auto-fit dos títulos grandes: reduz a fonte até caber numa linha e dentro da margem.
// Cobre nome longo de espécie, que quebrava em 3 linhas e empurrava o rodapé para fora.
export function ajustarTitulos({ largura, margem, tamanhoMinimo }) {
  const ajustados = [];
  for (const el of document.body.querySelectorAll('div')) {
    const temTexto = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    let fonte = parseFloat(getComputedStyle(el).fontSize);
    if (!temTexto || fonte < 90) continue;
    const inicial = fonte;
    const cabe = () => {
      const caixa = el.getBoundingClientRect();
      return caixa.right <= largura - margem && caixa.height <= fonte * 1.45;
    };
    while (!cabe() && fonte > tamanhoMinimo) {
      fonte -= 2;
      el.style.fontSize = `${fonte}px`;
    }
    if (fonte < inicial) ajustados.push(el.textContent.trim().slice(0, 30));
  }
  return ajustados;
}
