// Capa com o André (roda na página): o rosto fica no terço de cima, então o título desce.
export function descerTitulo() {
  const h1 = document.querySelector('h1');
  const coluna = h1?.parentElement;
  if (!h1 || getComputedStyle(coluna).flexDirection !== 'column') return 'mantido';
  const caixa = h1.getBoundingClientRect();
  if (caixa.top + caixa.height / 2 > window.innerHeight * 0.55) return 'ja-embaixo';

  h1.style.margin = 'auto 0 0';
  if (h1.nextElementSibling) h1.nextElementSibling.style.marginTop = '28px';
  // Tira o degradê verde do molde (escurecia o rosto) e põe um só, atrás do título.
  for (const el of document.querySelectorAll('[style*="inset: 0"]')) {
    const estilo = el.getAttribute('style');
    if (!el.hasAttribute('data-tratamento') && estilo.includes('linear-gradient')) {
      el.style.display = 'none';
    }
  }
  const fundo = document.createElement('div');
  fundo.setAttribute('data-tratamento', '');
  fundo.style.cssText = 'position:absolute;inset:0;background:linear-gradient(to top,' +
    'rgba(11,20,16,0.9) 0%,rgba(11,20,16,0.72) 36%,rgba(11,20,16,0) 64%)';
  coluna.before(fundo);
  return 'descido';
}
