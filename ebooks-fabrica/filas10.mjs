// Filas de fotos do Flow da leva 10 (TG 115 a 128). Cada livro tem filas10/NNN.mjs. Uso: node filas10.mjs
import { readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/gama-ebooks';
const ESTILO = 'Documentary photo, soft natural daylight, Brazilian home garden, realistic colors, sharp focus, no text, no logos';
for (const a of readdirSync(`${import.meta.dirname}/filas10`).filter((x) => x.endsWith('.mjs')).sort()) {
  const n = a.replace('.mjs', '');
  const lista = (await import(pathToFileURL(`${import.meta.dirname}/filas10/${a}`).href)).default;
  const fotos = lista.map(([id, especie, cena, mascote]) => ({
    id, especie, proporcao: id.includes('-var-') ? '3:4' : '9:16', elenco: id.includes('-gesto-'), cena, mascote,
  }));
  writeFileSync(`${REPO}/fila-fotos-tg${n}.json`, JSON.stringify({ livro: `TG ${n}`, estilo: ESTILO, fotos }, null, 2) + '\n');
  console.log(`tg${n}: ${fotos.length} fotos, ${fotos.filter((f) => f.mascote).length} com mascote`);
}
