// Filas de fotos do Flow da leva 9 (TG 101 a 114): Gentileza sem oculos, 2 por fila, lugar dito na cena.
// Acrescentar o livro novo em LIVROS quando o roteiro dele fechar. Uso: node filas9.mjs
import { writeFileSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/gama-ebooks';
const ESTILO = 'Documentary photo, soft natural daylight, Brazilian home garden, realistic colors, sharp focus, no text, no logos';
const M = 'the small mascot figurine';
const H = "Close-up of a man's hands";
// [id, especie, cena, mascote]; gesto = elenco 9:16, sintoma 9:16, var 3:4
const LIVROS = {
  '101': [
    ['slv-gesto-1', 'garden soil', `${H} rubbing a pinch of garden soil between the fingers to feel if it is sandy`, false],
    ['slv-gesto-2', 'garden soil', `${H} bending a rolled sausage of moist soil into a ring`, false],
    ['slv-gesto-3', 'sandy soil bed', `${H} spreading a 10 cm layer of cured manure over sandy soil in a garden bed; ${M} sits on the wooden edge of the bed`, true],
    ['slv-sintoma-1', 'compacted soil', 'Rainwater pooling on hard cracked bare garden soil after a storm, with a pale sandy crust', false],
    ['slv-var-grumos', 'crumbly soil', 'Dark crumbly garden soil made of small round clumps in a bed', false],
    ['slv-var-minhoca', 'earthworms', 'Earthworms wriggling in a handful of dark moist soil', false],
    ['slv-var-cobertura', 'mulched plant', `Straw mulch around a vegetable plant with a small gap around the stem; ${M} stands on the straw next to it`, true],
    ['slv-var-barranco', 'jute net slope', 'A slope covered with jute netting and small plants growing through the holes', false],
  ],
  '102': [
    ['cvv-gesto-1', 'hedge planting strip', `${H} stretching a string between two bamboo stakes along a strip of bare soil`, false],
    ['cvv-gesto-2', 'hedge seedling', `${H} planting a small hedge seedling in the soil beside the string; ${M} sits on the edge of the strip`, true],
    ['cvv-gesto-3', 'young tree', `${H} tying a young tree to two wooden stakes with a soft tie`, false],
    ['cvv-sintoma-1', 'wind-burned plant', 'Low twisted shrub with scorched brown leaf edges in a windy exposed spot', false],
    ['cvv-var-hibisco', 'hibiscus hedge', 'Red hibiscus hedge in bloom with large flowers along a garden wall', false],
    ['cvv-var-escova', 'bottlebrush', `Bottlebrush with red brush-shaped flowers in a dense row; ${M} stands on the ground in front of it`, true],
    ['cvv-var-tupinambo', 'jerusalem artichoke', 'Tall Jerusalem artichoke with yellow flowers growing as a windbreak at the edge of a vegetable garden', false],
    ['cvv-var-rosa-canina', 'dog rose', 'Dog rose with simple pink flowers in a country hedge', false],
  ],
};
for (const [n, lista] of Object.entries(LIVROS)) {
  const fotos = lista.map(([id, especie, cena, mascote]) => ({
    id, especie, proporcao: id.includes('-var-') ? '3:4' : '9:16', elenco: id.includes('-gesto-'), cena, mascote,
  }));
  writeFileSync(`${REPO}/fila-fotos-tg${n}.json`, JSON.stringify({ livro: `TG ${n}`, estilo: ESTILO, fotos }, null, 2) + '\n');
  console.log(`tg${n}: ${fotos.length} fotos, ${fotos.filter((f) => f.mascote).length} com mascote`);
}
