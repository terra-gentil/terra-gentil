// Testes do leitor de RSS.
import test from 'node:test';
import assert from 'node:assert/strict';
import { lerFeed } from './feed.mjs';

const XML = `<?xml version="1.0"?><rss version="2.0"><channel><title>Site</title>
<item><title><![CDATA[Como podar a jiboia & cia]]></title>
<link>https://www.epicgardening.com/a/</link>
<pubDate>Mon, 26 Oct 2026 10:00:00 +0000</pubDate><category><![CDATA[Houseplants]]></category>
<category>Care</category><description>texto da matéria que não deve sair</description></item>
<item><title>Sem link</title></item>
<item><title>Data ruim</title><link>https://x.com/b</link><pubDate>ontem</pubDate></item>
</channel></rss>`;

test('lê título, link, data e categorias', () => {
  const [a] = lerFeed(XML);
  assert.equal(a.titulo, 'Como podar a jiboia & cia');
  assert.equal(a.url, 'https://www.epicgardening.com/a/');
  assert.equal(a.publicadoEm, '2026-10-26T10:00:00.000Z');
  assert.deepEqual(a.categorias, ['Houseplants', 'Care']);
});

test('decodifica entidades numéricas', () => {
  const xml =
    '<rss><item><title>Seana&#8217;s &amp; jardim</title><link>https://x.com/a</link>' +
    '</item></rss>';
  assert.equal(lerFeed(xml)[0].titulo, 'Seana’s & jardim');
});

test('não carrega o texto da matéria', () => {
  assert.equal(JSON.stringify(lerFeed(XML)).includes('texto da matéria'), false);
});

test('descarta item sem link e tolera data inválida', () => {
  const itens = lerFeed(XML);
  assert.equal(itens.length, 2);
  assert.equal(itens[1].publicadoEm, null);
});

test('recusa conteúdo que não é RSS', () => {
  assert.throws(() => lerFeed('<html>Just a moment...</html>'), /não é um RSS/);
});
