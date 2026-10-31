// Linha de comando: leva as capas baixadas do Flow para capas/banco/<slug>/ em 1080x1350 (ffmpeg),
// aplica o tratamento anti-IA e atualiza capas/banco/indice.json com as tags de cada foto.
// uso: node capas/importar-cli.mjs <pasta>   (só arquivos <slug>-<A..E>-<n>[_data].*)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { naRaiz } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import * as indice from './indice.mjs';
import { gravarRevisao, hashDoArquivo, lerRevisao, marcar } from './revisao.mjs';

const origem = process.argv[2];
if (!origem || !fs.existsSync(origem)) {
  console.error('uso: node capas/importar-cli.mjs <pasta-de-downloads>');
  process.exit(1);
}

// Preenche o 4:5 sem distorcer: escala pelo lado curto e corta o excesso no centro.
const FILTRO = 'scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350';
const pastaBanco = naRaiz('capas', 'banco');
const catalogo = lerJson(naRaiz('dados', 'capas.json')).especies;
const novas = [];

// Tratamento anti-IA (TRATAMENTO-ANTI-IA.md) já na entrada: rosto e revisão valem para o final.
function tratar(destino) {
  const tmp = `${destino}.tmp.jpg`;
  const script = naRaiz('capas', 'tratar_capa.py');
  const saida = ['ignore', 'ignore', 'inherit'];
  const r = spawnSync('python', ['-I', script, destino, tmp], { stdio: saida });
  if (r.status !== 0) throw new Error(`[capas] tratamento falhou em ${destino}`);
  fs.renameSync(tmp, destino);
}

for (const nome of fs.readdirSync(origem)) {
  const capa = indice.lerNomeDaCapa(nome);
  if (!capa) continue;
  const id = `${capa.slug}-${capa.cenario}-${capa.n}`;
  const destino = path.join(pastaBanco, capa.slug, `${id}.jpg`);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(origem, nome), '-vf', FILTRO,
    '-q:v', '3', destino], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`[capas] ffmpeg falhou em ${nome}`);
  tratar(destino);
  const extra = { largura: 1080, altura: 1350, origem: nome };
  novas.push(indice.entradaDoIndice(capa, catalogo, extra));
  console.log(`${nome} -> ${path.relative(naRaiz(), destino)}`);
}

if (novas.length) {
  indice.gravarIndice(pastaBanco, indice.mesclarIndice(indice.lerIndice(pastaBanco), novas));
  // Capa nova entra como pendente: só vale depois de revisada (capas/revisar-cli.mjs aprovada).
  let capas = lerRevisao(pastaBanco);
  for (const { id, arquivo } of novas) {
    const hash = hashDoArquivo(path.join(pastaBanco, ...arquivo.split('/')));
    capas = marcar(capas, id, 'pendente', hash);
  }
  gravarRevisao(pastaBanco, capas);
}
console.log(novas.length ? `${novas.length} capa(s) no banco` : 'nenhum arquivo de capa na pasta');
