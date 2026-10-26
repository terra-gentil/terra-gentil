// Interface única do banco de imagens: tenta um provedor por vez e para no primeiro que servir.
import { buscarCommons } from './commons.mjs';
import { buscarOpenverse } from './openverse.mjs';
import { escolherFoto } from './escolher.mjs';

// Ordem = prioridade. O reserva só é consultado se o anterior não achar foto segura.
export const PROVEDORES = [
  { nome: 'commons', buscar: buscarCommons },
  { nome: 'openverse', buscar: buscarOpenverse },
];

export async function buscarFoto(termo, { provedores = PROVEDORES, ...opcoes } = {}) {
  if (!termo || typeof termo !== 'string') throw new Error('[banco] falta o nome da espécie');
  const falhas = [];
  let candidatos = 0;
  for (const { nome, buscar } of provedores) {
    try {
      const lista = await buscar(termo);
      candidatos += lista.length;
      const escolhida = escolherFoto(lista, opcoes);
      if (escolhida) return { escolhida, provedor: nome, candidatos, falhas };
    } catch (erro) {
      falhas.push(`${nome}: ${erro.message}`);
    }
  }
  return { escolhida: null, provedor: null, candidatos, falhas };
}
