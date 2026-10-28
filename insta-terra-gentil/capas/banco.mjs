// Banco de capas: lista as capas prontas de uma espécie e escolhe a da vez, sem repetir seguido.
import fs from 'node:fs';
import path from 'node:path';
import { lerJson } from '../lib/json.mjs';
import { hashDoArquivo, vale } from './revisao.mjs';
import { rostoConfere } from './rosto.mjs';

const IMAGEM = /\.(jpe?g|png|webp)$/i;

// Capas em capas/banco/<slug>/, em ordem de nome (orquidea-A-1, orquidea-B-1...).
export function capasDaEspecie(slug, pasta) {
  const dir = path.join(pasta, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((nome) => IMAGEM.test(nome))
    .sort()
    .map((nome) => path.join(dir, nome));
}

// Rodízio: a n-ésima vez que a espécie aparece usa a capa n. Com ~35 espécies e 3 a 5 capas,
// a mesma foto só volta depois de 3 a 6 meses.
export function escolherCapa(capas, vezesAntes) {
  if (!capas.length) return null;
  return capas[vezesAntes % capas.length];
}

// Quantos posts dessa espécie saíram antes do dia (arquivos AAAA-MM-DD-*.json em dados/posts).
export function vezesAntes(especie, posts, dia) {
  return posts.filter((p) => p.dia < dia && p.especie === especie).length;
}

// Lê dados/posts só o necessário: dia (do nome do arquivo) e especie.
export function lerPosts(pasta) {
  if (!fs.existsSync(pasta)) return [];
  return fs
    .readdirSync(pasta)
    .filter((nome) => /^\d{4}-\d{2}-\d{2}-.+\.json$/.test(nome))
    .map((nome) => ({ dia: nome.slice(0, 10), especie: lerJson(path.join(pasta, nome)).especie }));
}

// catalogo = dados/capas.json .especies. revisao = capas/banco/revisao.json (lerRevisao).
// Só entra capa aprovada, intacta e com rosto do André; sem revisão e rosto, nada.
// Devolve { caminho, credito } ou null.
export function capaDoDia(especie, dia, { catalogo, pastaBanco, posts, revisao, rosto }) {
  if (!revisao || !rosto) {
    throw new Error('[capas] sem revisão e nota de rosto, nenhuma capa é usada');
  }
  const entrada = catalogo[especie];
  if (!entrada) return null;
  const idDe = (c) => path.basename(c, path.extname(c));
  const aprovadas = capasDaEspecie(entrada.slug, pastaBanco)
    .filter((c) => {
      const hash = hashDoArquivo(c);
      const rostoOk = rostoConfere(rosto, idDe(c), hash) || Boolean(revisao[idDe(c)]?.excecaoRosto);
      return vale(revisao, idDe(c), hash) && rostoOk;
    });
  const caminho = escolherCapa(aprovadas, vezesAntes(especie, posts, dia));
  return caminho ? { caminho, credito: 'Foto: Terra Gentil' } : null;
}
