// Linha de comando: gera a fila de capas para a ferramenta "Capas TG" do Flow.
// uso: node capas/fila-cli.mjs [slug ...] [--por-cenario N]   (sem slug = todas as espécies)
import fs from 'node:fs';
import path from 'node:path';
import { DADOS, naRaiz } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { filaDeCapas } from './prompts.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--por-cenario');
const porCenario = i >= 0 ? Number(args[i + 1]) : 1;
const slugs = args.filter((a, j) => !a.startsWith('--') && (i < 0 || j !== i + 1));

const { especies } = lerJson(path.join(DADOS, 'capas.json'));
const escolhidas = Object.fromEntries(
  Object.entries(especies).filter(([, e]) => !slugs.length || slugs.includes(e.slug)),
);
if (!Object.keys(escolhidas).length) {
  console.error(`nenhuma espécie com slug ${slugs.join(', ')} em dados/capas.json`);
  process.exit(1);
}

const fila = { capas: filaDeCapas(escolhidas, { porCenario }) };
const saida = naRaiz('saida', 'fila-capas.json');
fs.mkdirSync(path.dirname(saida), { recursive: true });
fs.writeFileSync(saida, `${JSON.stringify(fila, null, 2)}\n`);
console.log(`${fila.capas.length} capas na fila: ${saida}`);
