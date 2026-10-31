// Testa a leitura e a troca de textos e fotos de uma pagina do canvas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aplicarPagina, lerPagina } from './paginas.mjs';

const PAGINA = `<html><x-dc><helmet><style>b{}</style></helmet>
<div><h1>Raiz &amp; vaso</h1><svg><text>icone</text></svg>
<img src="/_blob/abc" alt="André"><p> Regue pouco. </p></div></x-dc><script>x</script></html>`;

test('lerPagina lista textos fora de svg e fotos com alt', () => {
  const { textos, fotos } = lerPagina(PAGINA);
  assert.deepEqual(textos, ['Raiz & vaso', 'Regue pouco.']);
  assert.deepEqual(fotos, [{ src: '/_blob/abc', alt: 'André' }]);
});

test('aplicarPagina troca na ordem, escapa e mantem os espacos', () => {
  const novo = { textos: ['Solo < vivo', 'Adube.'], fotos: [{ src: 'x.jpg', alt: 'Terra "boa"' }] };
  const corpo = aplicarPagina(PAGINA, novo);
  assert.match(corpo, /<h1>Solo &lt; vivo<\/h1>/);
  assert.match(corpo, /<p> Adube\. <\/p>/);
  assert.match(corpo, /src="x\.jpg" alt="Terra &quot;boa&quot;"/);
  assert.match(corpo, /<text>icone<\/text>/);
});

test('aplicarPagina recusa roteiro com contagem diferente do molde', () => {
  assert.throws(() => aplicarPagina(PAGINA, { textos: ['so um'], fotos: [] }), /2 textos/);
});
