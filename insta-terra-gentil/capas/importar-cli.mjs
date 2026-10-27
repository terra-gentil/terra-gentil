// Linha de comando: leva as capas baixadas do Flow para capas/banco/<slug>/ em 1080x1350 (ffmpeg).
// uso: node capas/importar-cli.mjs <pasta-de-downloads>   (só arquivos <slug>-<A|B|C>-<n>.*)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { naRaiz } from '../lib/config.mjs';

const NOME_DA_CAPA = /^([a-z-]+)-([ABC])-(\d+)\.(jpe?g|png|webp)$/i;

const origem = process.argv[2];
if (!origem || !fs.existsSync(origem)) {
  console.error('uso: node capas/importar-cli.mjs <pasta-de-downloads>');
  process.exit(1);
}

// Preenche o 4:5 sem distorcer: escala pelo lado curto e corta o excesso no centro.
const FILTRO = 'scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350';
let levadas = 0;
for (const nome of fs.readdirSync(origem)) {
  const m = NOME_DA_CAPA.exec(nome);
  if (!m) continue;
  const id = `${m[1].toLowerCase()}-${m[2].toUpperCase()}-${m[3]}`;
  const destino = naRaiz('capas', 'banco', m[1].toLowerCase(), `${id}.jpg`);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(origem, nome), '-vf', FILTRO,
    '-q:v', '3', destino], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`[capas] ffmpeg falhou em ${nome}`);
  console.log(`${nome} -> ${path.relative(naRaiz(), destino)}`);
  levadas++;
}
console.log(levadas ? `${levadas} capa(s) no banco` : 'nenhum arquivo <slug>-<A|B|C>-<n> na pasta');
