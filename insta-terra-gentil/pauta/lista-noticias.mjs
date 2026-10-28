// Lista da pauta de notícias para a rotina: só tema e link, do mais novo ao mais velho.
// Pauta ausente ou velha não é erro: a rotina segue com o rodízio dos livros.
import fs from 'node:fs';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';

export const ARQUIVO_PAUTA = path.join(DADOS, 'pauta-noticias.json');
export const MAXIMO_PADRAO = 15;
// Coleta roda todo dia: pauta com mais de 3 dias sem atualizar indica coleta quebrada.
const DIAS_PARA_VELHA = 3;
const DIA_MS = 24 * 60 * 60 * 1000;

export function listarNoticias(estado, { max = MAXIMO_PADRAO, agora = new Date() } = {}) {
  if (!estado?.atualizadoEm) return { total: 0, velha: true, itens: [] };
  const idade = agora.getTime() - Date.parse(estado.atualizadoEm);
  const itens = estado.itens.slice(0, max).map((i) => ({
    titulo: i.titulo,
    url: i.url,
    fonte: i.fonte,
    publicadoEm: i.publicadoEm,
    categorias: i.categorias.slice(0, 6),
  }));
  return {
    atualizadoEm: estado.atualizadoEm,
    total: estado.itens.length,
    velha: idade > DIAS_PARA_VELHA * DIA_MS,
    itens,
  };
}

export function lerPauta(arquivo = ARQUIVO_PAUTA) {
  return fs.existsSync(arquivo) ? lerJson(arquivo) : null;
}
