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

// Fator único de encolhimento das linhas do título: 1 se a mais larga cabe, senão proporcional,
// nunca abaixo do mínimo (aí o aviso de estouro avisa). Pura, para testar sem navegador.
export function fatorDeEncolhimento(larguras, disponivel, minimo = 0.55) {
  const maior = Math.max(...larguras, 0);
  if (!maior || maior <= disponivel) return 1;
  return Math.max(minimo, disponivel / maior);
}

// Roda na página, então cada função traz a própria seleção: as linhas do h1 são os filhos em
// bloco com texto. Trava cada uma numa linha só (sem quebrar em "espada-de-são-jorge") e mede
// a largura real do texto. Devolve as larguras de cada h1, na ordem da página.
export function medirLinhasTitulo() {
  return [...document.body.querySelectorAll('h1')].map((h1) =>
    [...h1.children]
      .filter((el) => el.textContent.trim() && getComputedStyle(el).display === 'block')
      .map((el) => {
        el.style.whiteSpace = 'nowrap';
        const faixa = document.createRange();
        faixa.selectNodeContents(el);
        return faixa.getBoundingClientRect().width;
      }),
  );
}

// Aplica o fator de cada h1 (vindo de fatorDeEncolhimento) em todas as linhas dele.
export function encolherLinhasTitulo(fatores) {
  [...document.body.querySelectorAll('h1')].forEach((h1, i) => {
    if (fatores[i] >= 1) return;
    for (const el of h1.children) {
      if (!el.textContent.trim() || getComputedStyle(el).display !== 'block') continue;
      const estilo = getComputedStyle(el);
      // Mantém a altura da linha original: sem isso o acento de uma linha bate na de cima.
      if (estilo.lineHeight !== 'normal') el.style.lineHeight = estilo.lineHeight;
      el.style.fontSize = `${parseFloat(estilo.fontSize) * fatores[i]}px`;
    }
  });
}
