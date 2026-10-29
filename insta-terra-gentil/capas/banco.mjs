// Banco de capas: lista as capas prontas de uma espécie e escolhe a da vez, sem repetir seguido.
import fs from 'node:fs';
import path from 'node:path';
import { lerJson } from '../lib/json.mjs';
import { entradasDoPost } from './catalogo.mjs';
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

// Quantos posts antes do dia tinham esse slug entre as capas possíveis (tema ou planta): o
// rodízio é por capa, então "Phalaenopsis amabilis" e "Phalaenopsis aphrodite" somam juntas.
export function vezesDoSlug(slug, posts, dia, catalogo) {
  const usou = (p) => entradasDoPost(p, catalogo).some((e) => e.slug === slug);
  return posts.filter((p) => p.dia < dia && usou(p)).length;
}

// Lê dados/posts só o necessário: dia (do nome do arquivo), especie e tema.
export function lerPosts(pasta) {
  if (!fs.existsSync(pasta)) return [];
  return fs
    .readdirSync(pasta)
    .filter((nome) => /^\d{4}-\d{2}-\d{2}-.+\.json$/.test(nome))
    .map((nome) => {
      const { especie, tema } = lerJson(path.join(pasta, nome));
      return { dia: nome.slice(0, 10), especie, tema: tema ?? null };
    });
}

function aprovadasDo(slug, { pastaBanco, revisao, rosto }) {
  const idDe = (c) => path.basename(c, path.extname(c));
  return capasDaEspecie(slug, pastaBanco).filter((c) => {
    const hash = hashDoArquivo(c);
    const rostoOk = rostoConfere(rosto, idDe(c), hash) || Boolean(revisao[idDe(c)]?.excecaoRosto);
    return vale(revisao, idDe(c), hash) && rostoOk;
  });
}

// post = { especie, tema } (ou só a espécie). catalogo = dados/capas.json .especies.
// revisao = capas/banco/revisao.json (lerRevisao). Só entra capa aprovada, intacta e com rosto do
// André; sem revisão e rosto, nada. Tema com capa vence a planta. Devolve { caminho, credito }.
export function capaDoDia(post, dia, opcoes) {
  const { catalogo, posts, revisao, rosto } = opcoes;
  if (!revisao || !rosto) {
    throw new Error('[capas] sem revisão e nota de rosto, nenhuma capa é usada');
  }
  for (const entrada of entradasDoPost(post, catalogo)) {
    const aprovadas = aprovadasDo(entrada.slug, opcoes);
    if (!aprovadas.length) continue;
    const caminho = escolherCapa(aprovadas, vezesDoSlug(entrada.slug, posts, dia, catalogo));
    return { caminho, credito: 'Foto: Terra Gentil' };
  }
  return null;
}
