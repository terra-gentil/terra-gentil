// Confere uma pagina de livro ja publicada: se abre, se tem o botao de download e se o PDF responde.
// Uso: node scripts/guias/conferir-publicado.mjs suculentas-sem-afogar [https://terragentil.com.br]
const [slug, base = 'https://terragentil.com.br'] = process.argv.slice(2);
if (!slug) {
  console.error('Uso: node scripts/guias/conferir-publicado.mjs slug-do-livro [url-base]');
  process.exit(1);
}

const url = `${base.replace(/\/$/, '')}/guias/${slug}`;
const falhas = [];

const res = await fetch(url, { redirect: 'follow' });
console.log(`${res.status} ${url}`);
if (!res.ok) {
  console.error('FALHA pagina nao abriu');
  process.exit(1);
}
const html = await res.text();

if (!/<h1[^>]*>/.test(html)) falhas.push('sem h1');
if (!html.includes('application/ld+json')) falhas.push('sem dados estruturados');
if (!/<link[^>]+rel="canonical"/.test(html)) falhas.push('sem canonical');

// Botao de download: link para o PDF no endereco do R2.
const link = html.match(/href="([^"]+\.pdf)"/);
if (!link) {
  falhas.push('botao de download ausente (NEXT_PUBLIC_PDF_BASE_URL nao entrou no build? refaca o deploy)');
} else {
  const pdf = await fetch(link[1], { method: 'HEAD' });
  const tipo = pdf.headers.get('content-type') ?? '?';
  const mb = Math.round(Number(pdf.headers.get('content-length') ?? 0) / 1024 / 1024);
  console.log(`${pdf.status} ${link[1]} (${tipo}, ${mb} MB)`);
  if (!pdf.ok) falhas.push(`PDF nao responde (${pdf.status})`);
  else if (!tipo.includes('pdf')) falhas.push(`PDF com tipo estranho: ${tipo}`);
}

const sitemap = await fetch(`${base.replace(/\/$/, '')}/sitemap.xml`).then((r) => r.text());
if (!sitemap.includes(`/guias/${slug}`)) falhas.push('pagina fora do sitemap');

if (falhas.length) {
  for (const f of falhas) console.error(`FALHA ${f}`);
  process.exit(1);
}
console.log('Pagina publicada e conferida.');
