// Registro do que foi ao ar (dados/publicados/AAAA-MM-DD.json): barra postar o mesmo dia 2 vezes.
import fs from 'node:fs';
import path from 'node:path';
import { DADOS } from '../../lib/config.mjs';
import { lerJson } from '../../lib/json.mjs';

const pasta = (base) => path.join(base, 'publicados');

export function lerRegistro(dia, base = DADOS) {
  const arquivo = path.join(pasta(base), `${dia}.json`);
  return fs.existsSync(arquivo) ? lerJson(arquivo) : null;
}

export function gravarRegistro(dia, dados, base = DADOS) {
  fs.mkdirSync(pasta(base), { recursive: true });
  const arquivo = path.join(pasta(base), `${dia}.json`);
  fs.writeFileSync(arquivo, `${JSON.stringify({ dia, ...dados }, null, 2)}\n`);
  return arquivo;
}
