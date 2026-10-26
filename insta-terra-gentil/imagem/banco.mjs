// Interface única do banco de imagens: busca em cada provedor e escolhe a foto da espécie.
import { buscarCommons } from './commons.mjs';
import { escolherFoto } from './escolher.mjs';

// Provedor é só uma função (termo) => candidatos. Pixabay ou Unsplash entram aqui depois.
const PROVEDORES = [buscarCommons];

export async function buscarFoto(termo, { provedores = PROVEDORES, ...opcoes } = {}) {
  if (!termo || typeof termo !== 'string') throw new Error('[banco] falta o nome da espécie');
  const resultados = await Promise.allSettled(provedores.map((buscar) => buscar(termo)));
  const candidatos = resultados.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  const falhas = resultados
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason?.message ?? String(r.reason));
  return { escolhida: escolherFoto(candidatos, opcoes), candidatos: candidatos.length, falhas };
}
