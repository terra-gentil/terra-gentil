// Orquestra o merge das branches da rotina: valida cada uma e só então mescla. IO injetado.
import { validarRamo } from './validar.mjs';

// io = { obterInfo(ramo) -> { commits, arquivos }, aplicar(ramo) (mescla, confere e empurra) }
// Um ramo recusado ou que falha ao aplicar não impede os outros; o chamador decide o exit code.
export async function mesclarRamos(ramos, io) {
  const resultados = [];
  for (const ramo of ramos) {
    try {
      const veredito = validarRamo({ ramo, ...(await io.obterInfo(ramo)) });
      if (!veredito.ok) {
        resultados.push({ ramo, ok: false, motivo: veredito.motivo });
        continue;
      }
      await io.aplicar(ramo);
      resultados.push({ ramo, ok: true });
    } catch (erro) {
      resultados.push({ ramo, ok: false, motivo: erro.message });
    }
  }
  return resultados;
}

export function resumoDosResultados(resultados) {
  if (!resultados.length) return 'nenhuma branch da rotina para mesclar';
  return resultados
    .map((r) => (r.ok ? `mesclada: ${r.ramo}` : `RECUSADA: ${r.ramo} (${r.motivo})`))
    .join('\n');
}
