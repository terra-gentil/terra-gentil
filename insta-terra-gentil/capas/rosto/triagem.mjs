// Triagem de rosto antes da revisão do André: separa as capas de rosto diferente do dele.
import { LIMITE_ROSTO } from '../rosto.mjs';

export const PASTA_BARRADAS = '_rosto-reprovado';

// notas: { arquivo: { nota: number|null, rostos: number } } (saída do notas_pasta.py).
// Barra quem não tem rosto ou tem nota abaixo do limiar; o resto segue para o André.
export function triarPorNota(notas, limite = LIMITE_ROSTO) {
  const seguem = [];
  const barradas = [];
  for (const [arquivo, { nota, rostos }] of Object.entries(notas).sort()) {
    if (nota === null || !rostos) barradas.push({ arquivo, motivo: 'sem rosto' });
    else if (nota < limite) barradas.push({ arquivo, motivo: `rosto diferente (nota ${nota})` });
    else seguem.push(arquivo);
  }
  return { seguem, barradas };
}
