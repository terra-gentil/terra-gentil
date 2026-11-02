// Sobe os PDFs web (ebooks/pdf-web/TGNNN.pdf) para o bucket R2 privado e confere pelo Worker.
// Precisa de `npx wrangler login` uma vez (conta canalterragentil@gmail.com).
// Uso: node scripts/guias/subir-pdfs.mjs TG004 TG005   (sem argumento: todos do lote.json)
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const EBOOKS = process.env.EBOOKS_DIR || 'C:/Users/engan/Documents/Terra Gentil/ebooks';
const BUCKET = 'terra-gentil-pdfs';
const WORKER = 'https://terra-gentil-pdfs.canalterragentil.workers.dev';

let codigos = process.argv.slice(2).map((c) => c.toUpperCase());
if (!codigos.length) codigos = JSON.parse(readFileSync(join('scripts', 'guias', 'lote.json'), 'utf8')).map((l) => l[0]);

const falhas = [];
for (const c of codigos) {
  const arq = join(EBOOKS, 'pdf-web', `${c}.pdf`);
  if (!existsSync(arq)) {
    falhas.push(`${c}: sem ${arq}`);
    continue;
  }
  const mb = (statSync(arq).size / 1048576).toFixed(1);
  // No Windows o wrangler as vezes quebra ao fechar (assert do libuv) depois de ja ter enviado:
  // vale a mensagem "Upload complete." e a conferencia pelo Worker, nao o codigo de saida.
  const out = spawnSync('npx', ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${c}.pdf`, '--file', `"${arq}"`,
    '--content-type', 'application/pdf', '--remote'], { encoding: 'utf8', shell: true });
  if (!`${out.stdout}${out.stderr}`.includes('Upload complete.')) {
    const ultima = `${out.stderr}`.trim().split(/\r?\n/).pop();
    falhas.push(`${c}: wrangler nao confirmou o envio (${ultima})`);
    continue;
  }
  const r = await fetch(`${WORKER}/${c}.pdf`, { method: 'HEAD' });
  console.log(`${r.status} ${c}.pdf (${mb} MB)`);
  if (!r.ok) falhas.push(`${c}: Worker respondeu ${r.status}`);
}
if (falhas.length) {
  for (const f of falhas) console.error(`FALHA ${f}`);
  process.exit(1);
}
console.log(`${codigos.length} PDF(s) no bucket.`);
