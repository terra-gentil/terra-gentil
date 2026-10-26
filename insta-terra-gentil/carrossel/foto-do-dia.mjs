// Foto do dia: usa a escolha curada da espécie, se houver, senão busca no banco gratuito.
import { baixarFoto } from '../imagem/baixar.mjs';
import { buscarFoto } from '../imagem/banco.mjs';
import { creditoDe } from '../imagem/escolher.mjs';

// curadas = { "Epipremnum aureum": { foto: { url, licenca, autor, fonte, paginaUrl } } }
// (dados/fotos.json). O André escolhe uma vez por espécie; o banco automático é o reserva.
export async function fotoDoDia(especie, { curadas = {}, pasta, buscar, baixar } = {}) {
  const buscarNoBanco = buscar ?? buscarFoto;
  const baixarArquivo = baixar ?? baixarFoto;
  const curada = curadas[especie];
  if (curada) {
    const baixada = await baixarArquivo(
      { foto: curada.foto, credito: curada.credito ?? creditoDe(curada.foto) },
      especie,
      pasta,
    );
    return { ...baixada, provedor: 'curada' };
  }
  const r = await buscarNoBanco(especie);
  if (!r.escolhida) {
    const motivo = r.falhas.join('; ') || 'sem candidatas';
    throw new Error(`[foto] nenhuma foto segura para ${especie}: ${motivo}`);
  }
  const baixada = await baixarArquivo(r.escolhida, especie, pasta);
  return { ...baixada, provedor: r.provedor };
}
