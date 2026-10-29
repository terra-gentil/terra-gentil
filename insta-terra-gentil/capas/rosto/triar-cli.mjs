// Linha de comando: confere o rosto de cada capa baixada e move as de rosto diferente para
// <pasta>/_rosto-reprovado, antes de o André ver. Rode sempre que baixar capas do Flow.
// uso: node capas/rosto/triar-cli.mjs <pasta-de-downloads>
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { naRaiz } from '../../lib/config.mjs';
import { PASTA_BARRADAS, triarPorNota } from './triagem.mjs';

const pasta = process.argv[2];
if (!pasta || !fs.existsSync(pasta)) {
  console.error('uso: node capas/rosto/triar-cli.mjs <pasta-de-downloads>');
  process.exit(1);
}

const script = naRaiz('capas', 'rosto', 'notas_pasta.py');
const r = spawnSync('python', ['-I', script, pasta], { encoding: 'utf8', maxBuffer: 1 << 24 });
if (r.status !== 0) throw new Error(`[rosto] notas_pasta.py falhou: ${r.stderr}`);
const notas = JSON.parse(r.stdout.trim().split('\n').pop());

const { seguem, barradas } = triarPorNota(notas);
if (barradas.length) fs.mkdirSync(path.join(pasta, PASTA_BARRADAS), { recursive: true });
for (const { arquivo, motivo } of barradas) {
  fs.renameSync(path.join(pasta, arquivo), path.join(pasta, PASTA_BARRADAS, arquivo));
  console.log(`BARRADA ${arquivo}: ${motivo}`);
}
console.log(`${seguem.length} seguem para o André, ${barradas.length} barradas por rosto`);
