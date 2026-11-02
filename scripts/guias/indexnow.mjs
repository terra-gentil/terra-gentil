// Avisa Bing, Yandex e outros (protocolo IndexNow) que paginas do site mudaram.
// A chave e publica por desenho: o arquivo public/<chave>.txt prova que o site e nosso.
// Uso: node scripts/guias/indexnow.mjs [slug ...]   (sem argumento: todas as URLs do sitemap)
const CHAVE = 'a1901618331b09c04c6d4c460109c10e';
const SITE = 'https://terragentil.com.br';

const slugs = process.argv.slice(2);
let urls;
if (slugs.length) {
  urls = slugs.map((s) => `${SITE}/guias/${s}`);
} else {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'terragentil.com.br', key: CHAVE, keyLocation: `${SITE}/${CHAVE}.txt`, urlList: urls }),
});
// 200 ou 202: recebido. 403: chave nao encontrada no site (deploy ainda nao subiu o arquivo).
console.log(`IndexNow ${res.status}: ${urls.length} URL(s)`);
if (res.status >= 400) process.exit(1);
