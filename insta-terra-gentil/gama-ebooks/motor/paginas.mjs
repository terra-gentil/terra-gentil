// Le e reescreve uma pagina do canvas: textos e fotos na ordem em que aparecem.

// Blocos que nao tem texto de livro (icones, fontes, scripts) passam intactos.
const PEDACO = /<(svg|helmet|script|style)\b[\s\S]*?<\/\1>|<[^>]+>|[^<]+/g;
const ENTIDADES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

export function corpoDaPagina(src) {
  const partes = src.split('<x-dc>');
  if (partes.length < 2) throw new Error('pagina sem <x-dc>');
  return partes[1].split('</x-dc>')[0];
}

export function decodificar(t) {
  return t.replace(/&(amp|lt|gt|quot|#39);/g, (e) => ENTIDADES[e]).replace(/&nbsp;/g, ' ');
}

export function escapar(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function ehTexto(p) {
  return !p.startsWith('<') && p.trim() !== '';
}

function atributo(tag, nome) {
  const m = tag.match(new RegExp(`\\s${nome}="([^"]*)"`));
  return m ? decodificar(m[1]) : '';
}

export function lerPagina(src) {
  const textos = [];
  const fotos = [];
  for (const [p] of corpoDaPagina(src).matchAll(PEDACO)) {
    if (ehTexto(p)) textos.push(decodificar(p.trim()));
    else if (/^<img\b/.test(p)) fotos.push({ src: atributo(p, 'src'), alt: atributo(p, 'alt') });
  }
  return { textos, fotos };
}

function trocarImg(tag, foto) {
  const alt = escapar(foto.alt ?? '').replace(/"/g, '&quot;');
  return tag
    .replace(/\ssrc="[^"]*"/, ` src="${foto.src}"`)
    .replace(/\salt="[^"]*"/, ` alt="${alt}"`);
}

// Devolve o corpo da pagina com os textos e fotos do roteiro, na mesma ordem do molde.
export function aplicarPagina(src, { textos, fotos = [] }, nome = 'pagina') {
  const base = lerPagina(src);
  if (base.textos.length !== textos.length) {
    throw new Error(`${nome}: molde tem ${base.textos.length} textos, roteiro ${textos.length}`);
  }
  if (base.fotos.length !== fotos.length) {
    throw new Error(`${nome}: molde tem ${base.fotos.length} fotos, roteiro ${fotos.length}`);
  }
  let t = 0;
  let f = 0;
  return corpoDaPagina(src).replace(PEDACO, (p) => {
    if (ehTexto(p)) {
      const [antes, depois] = [p.match(/^\s*/)[0], p.match(/\s*$/)[0]];
      return antes + escapar(textos[t++]) + depois;
    }
    if (/^<img\b/.test(p)) return trocarImg(p, fotos[f++]);
    return p;
  });
}
