// Tratamento da foto de fundo (roda na página): realce por resolução, desfoque e gradiente.
// Princípio do setlist: foto pequena ganha afiação e grão, e o texto ganha fundo legível.
export function tratarFoto({ largura, altura }) {
  const NS = 'http://www.w3.org/2000/svg';
  const foto = document.querySelector('img[style*="object-fit"]');
  const base = foto?.parentElement?.matches('[style*="inset: 0"]') ? foto.parentElement : foto;
  if (!base) return 'sem-foto';
  const { naturalWidth: lf, naturalHeight: af } = foto;
  const escala = lf ? Math.max(largura / lf, altura / af) : 0;
  const nivel = escala <= 0.8 ? 'nitida' : escala <= 1.8 ? 'media' : 'pequena';

  // Afiação por convolução: só nas fotos que precisam ser ampliadas.
  if (nivel !== 'nitida') {
    const leve = '0 -0.5 0 -0.5 3 -0.5 0 -0.5 0';
    const kernel = nivel === 'media' ? leve : '0 -1 0 -1 5 -1 0 -1 0';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('style', 'position:absolute;width:0;height:0');
    svg.innerHTML = `<filter id="afiar"><feConvolveMatrix order="3" kernelMatrix="${kernel}"/>` +
      '</filter>';
    document.body.append(svg);
    foto.style.filter = `url(#afiar) saturate(${nivel === 'media' ? 1.04 : 1.06})`;
  }

  const camadas = [];
  const nova = (css) => {
    const el = document.createElement('div');
    el.setAttribute('data-tratamento', '');
    el.style.cssText = `position:absolute;inset:0;${css}`;
    camadas.push(el);
  };

  // Grão editorial (soft-light), mais denso quanto menor a foto.
  if (nivel !== 'nitida') {
    const ruido = "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' " +
      "stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>" +
      "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";
    nova(`background:url("data:image/svg+xml;utf8,${ruido}");mix-blend-mode:soft-light;` +
      `opacity:${nivel === 'media' ? 0.35 : 0.6}`);
  }
  // Desfoque atrás do texto, mais forte embaixo, onde ficam as faixas.
  const mascara = 'linear-gradient(to bottom, transparent 12%, #000 45%)';
  nova(`backdrop-filter:blur(10px);background:rgba(11,20,16,0.3);` +
    `-webkit-mask-image:${mascara};mask-image:${mascara}`);
  // Gradiente de topo e base (o g02 do setlist): segura o contador e o rodapé.
  nova('background:linear-gradient(to bottom, rgba(11,20,16,0.22) 0%, rgba(11,20,16,0) 30%,' +
    'rgba(11,20,16,0.45) 78%, rgba(11,20,16,0.8) 100%)');

  let ultima = base;
  while (ultima.nextElementSibling?.getAttribute('style')?.includes('inset: 0')) {
    ultima = ultima.nextElementSibling;
  }
  for (const el of camadas) {
    ultima.after(el);
    ultima = el;
  }
  return nivel;
}
