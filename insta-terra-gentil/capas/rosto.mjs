// Nota de rosto das capas (capas/banco/rosto.json, gerada por capas/rosto/verificar_rosto.py).
import fs from 'node:fs';
import path from 'node:path';
import { lerJson } from '../lib/json.mjs';

// Limiar de cosseno recomendado pelo SFace para "mesma pessoa". No banco, aprovadas ficaram
// em 0,41 ou mais e as capas com rosto de outro homem em 0,22 ou menos (calibração de 28/10).
export const LIMITE_ROSTO = 0.363;

export function lerRosto(pastaBanco) {
  const arquivo = path.join(pastaBanco, 'rosto.json');
  return fs.existsSync(arquivo) ? lerJson(arquivo).capas : {};
}

// true só se a nota é do mesmo arquivo (hash) e passa do limiar.
export function rostoConfere(rosto, id, hash) {
  const r = rosto[id];
  return Boolean(r) && r.sha256 === hash && typeof r.nota === 'number' && r.nota >= LIMITE_ROSTO;
}

// Toda capa aprovada precisa de nota de rosto válida e do mesmo arquivo da revisão.
export function problemasDeRosto(revisao, rosto) {
  const problemas = [];
  for (const [id, r] of Object.entries(revisao)) {
    if (r.status !== 'aprovada') continue;
    if (!rostoConfere(rosto, id, r.sha256)) problemas.push(`${id}: rosto não confere com o André`);
  }
  return problemas;
}
