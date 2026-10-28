// Linha de comando: registra o veredito de capas do banco (aprovada, reprovada, duvida, pendente).
// uso: node capas/revisar-cli.mjs <status> <id...> [--motivo "texto"]
// reprovada tira a capa do banco e do índice (vai para capas/reprovadas/, para refazer no fim).
import fs from 'node:fs';
import path from 'node:path';
import { naRaiz } from '../lib/config.mjs';
import * as indice from './indice.mjs';
import { lerRosto, rostoConfere } from './rosto.mjs';
import { STATUS, gravarRevisao, hashDoArquivo, lerRevisao, marcar } from './revisao.mjs';

const args = process.argv.slice(2);
const excecao = args.includes('--excecao-rosto');
if (excecao) args.splice(args.indexOf('--excecao-rosto'), 1);
const posMotivo = args.indexOf('--motivo');
const motivo = posMotivo >= 0 ? args.splice(posMotivo, 2)[1] : undefined;
const [status, ...ids] = args;
if (!STATUS.includes(status) || !ids.length) {
  console.error(`uso: node capas/revisar-cli.mjs <${STATUS.join('|')}> <id...> [--motivo "texto"]`);
  process.exit(1);
}

const pastaBanco = naRaiz('capas', 'banco');
const pastaReprovadas = naRaiz('capas', 'reprovadas');
let lista = indice.lerIndice(pastaBanco);
let capas = lerRevisao(pastaBanco);
const rosto = lerRosto(pastaBanco);
const data = new Date().toISOString().slice(0, 10);

for (const id of ids) {
  const entrada = lista.find((c) => c.id === id);
  if (!entrada) throw new Error(`[revisar] ${id} não está no índice do banco`);
  const caminho = path.join(pastaBanco, ...entrada.arquivo.split('/'));
  const hash = hashDoArquivo(caminho);
  if (status === 'aprovada' && !excecao && !rostoConfere(rosto, id, hash)) {
    const como = 'rode capas/rosto/verificar_rosto.py --gravar';
    throw new Error(`[revisar] ${id}: rosto não confere com o André (${como})`);
  }
  const extra = { data, ...(motivo && { motivo }) };
  if (excecao) extra.excecaoRosto = `André, ${data}`;
  capas = marcar(capas, id, status, hash, extra);
  if (status === 'reprovada') {
    const destino = path.join(pastaReprovadas, entrada.slug, path.basename(caminho));
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.renameSync(caminho, destino);
    lista = lista.filter((c) => c.id !== id);
  }
  console.log(`${id}: ${status}`);
}

gravarRevisao(pastaBanco, capas);
indice.gravarIndice(pastaBanco, lista);
