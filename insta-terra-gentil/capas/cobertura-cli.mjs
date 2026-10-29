// Linha de comando: lista o catálogo de capas com aprovadas e o post que alcança cada entrada.
// uso: node capas/cobertura-cli.mjs
import path from 'node:path';
import { DADOS, naRaiz } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { cobertura, pastasOrfas } from './cobertura.mjs';
import { lerRevisao } from './revisao.mjs';
import { lerRosto } from './rosto.mjs';

const { especies } = lerJson(path.join(DADOS, 'capas.json'));
const pastaBanco = naRaiz('capas', 'banco');
const opcoes = { pastaBanco, revisao: lerRevisao(pastaBanco), rosto: lerRosto(pastaBanco) };
const linhas = cobertura(especies, opcoes);
const como = (a) => (a ? (a.tema ? `tema: ${a.tema}` : `especie: ${a.especie}`) : 'NUNCA');
console.log('| Slug | Nome | Aprovadas | Post que usa |\n|---|---|---|---|');
for (const l of linhas)
  console.log(`| ${l.slug} | ${l.nome} | ${l.aprovadas} | ${como(l.alcanca)} |`);
const total = linhas.reduce((s, l) => s + l.aprovadas, 0);
const paradas = linhas.filter((l) => !l.alcanca).length;
console.log(
  `\n${total} capas aprovadas; entradas sem post: ${paradas}; sem foto: ${
    linhas.filter((l) => !l.aprovadas).length
  }; pastas órfãs: ${pastasOrfas(especies, pastaBanco).length}`,
);
