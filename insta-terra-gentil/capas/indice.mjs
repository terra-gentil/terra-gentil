// Índice do banco de capas: tags por foto (espécie, cenário, estilo) para o carrossel buscar fácil.
import fs from 'node:fs';
import path from 'node:path';

export const CENARIOS_NOME = {
  A: 'segurando',
  B: 'cuidando',
  C: 'ambiente',
  D: 'ensinando',
  E: 'regando',
};

// Nome do arquivo (do Flow ou já no banco) -> { slug, cenario, n } ou null.
// Aceita "orquidea-B-1.jpg" e "orquidea-B-1_20261027112439.jpg" (sufixo de data do download).
const NOME = /^([a-z0-9-]+)-([A-E])-(\d+)(?:_\d+)?\.(jpe?g|png|webp)$/i;

export function lerNomeDaCapa(arquivo) {
  const m = NOME.exec(arquivo);
  if (!m) return null;
  return { slug: m[1].toLowerCase(), cenario: m[2].toUpperCase(), n: Number(m[3]) };
}

// Entrada do índice. catalogo = dados/capas.json .especies (chave = nome científico).
export function entradaDoIndice({ slug, cenario, n }, catalogo, extra = {}) {
  const [especie, dados] = Object.entries(catalogo).find(([, e]) => e.slug === slug) || [];
  const nomeCenario = CENARIOS_NOME[cenario];
  return {
    id: `${slug}-${cenario}-${n}`,
    arquivo: `${slug}/${slug}-${cenario}-${n}.jpg`,
    slug,
    especie: especie || null,
    nome: dados?.nome || slug,
    cenario,
    cenarioNome: nomeCenario,
    tags: [slug, nomeCenario, 'andre', 'camiseta-oficial', 'capa-slide-1'],
    ...extra,
  };
}

// Junta entradas novas ao índice: mesma id substitui, ordem estável por id.
export function mesclarIndice(atual, novas) {
  const porId = new Map(atual.map((e) => [e.id, e]));
  for (const e of novas) porId.set(e.id, e);
  return [...porId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

// Busca: todas as tags pedidas precisam estar na foto. Ex.: porTags(i, ['orquidea', 'regando']).
export function porTags(indice, tags) {
  return indice.filter((e) => tags.every((t) => e.tags.includes(t)));
}

export function lerIndice(pastaBanco) {
  const arq = path.join(pastaBanco, 'indice.json');
  return fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')).capas : [];
}

export function gravarIndice(pastaBanco, capas) {
  const arq = path.join(pastaBanco, 'indice.json');
  const sobre = 'Gerado por capas/importar-cli.mjs. Tags por foto para o carrossel.';
  fs.writeFileSync(arq, `${JSON.stringify({ _sobre: sobre, capas }, null, 2)}\n`);
}
