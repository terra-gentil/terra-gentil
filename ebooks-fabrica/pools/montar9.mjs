// Leva 9 (TG 101 a 114): separa os fatos livres da biblia por livro, sem fato repetido entre livros.
// Cada livro tem prefixos de origem (ids) e/ou palavras-chave; o fato vai para o primeiro livro que o pede.
// Uso: node pools/montar9.mjs   (gera pools/pool9-101.txt ... pool9-114.txt e mostra as contagens)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const R = `${REPO}/gama-ebooks/roteiros`;
const CURTOS = `${import.meta.dirname}/../curtos`;
const usados = new Set();
for (const a of readdirSync(R).filter((x) => x.endsWith('.json')))
  for (const p of JSON.parse(readFileSync(`${R}/${a}`, 'utf8')).paginas) for (const f of p.fatos ?? []) usados.add(f);
for (const a of readdirSync(CURTOS).filter((x) => x.endsWith('.mjs')))
  for (const m of readFileSync(`${CURTOS}/${a}`, 'utf8').matchAll(/f:\s*\[([^\]]*)\]/g))
    for (const id of m[1].matchAll(/'([^']+)'/g)) usados.add(id[1]);
const fatos = JSON.parse(readFileSync(`${REPO}/dados/biblia.json`, 'utf8')).fatos;

// [numero, titulo, prefixos de id (ou null), palavras-chave do texto ou da especie]
const LIVROS = [
  ['101', 'Solo Vivo', /^(a8|i36|q34)-/, /argila|areia|h[uú]mus|fungo|cobertura|minhoc|mat[eé]ria org|solo|compact|socad|barro|drenag/i],
  ['102', 'Cerca Viva e Vento', null, /cerca viva|cerca|quebra-vento|sebe|vento/i],
  ['103', 'Mato Teimoso', /^(e22|z7)-/, /rizoma|perene|rebrot|estol|capim|tiririca|amargoso|volta|raiz/i],
  ['104', 'Plantas Companheiras', /^(x23|s2|g32|h35|q34|w31|s28)-/, /perto d|ao lado|companheir|cons[oó]rcio|espanta|afasta|atrai|junto|hortel[aã]|alecrim|lavanda|endro|tagetes|cravo-de-defunto|borragem|manjeric|calend|capuchinha|aliad|combina/i],
  ['105', 'Hotel de Bicho', /^(q34|x23)-/, /hotel|bicho|abrigo|toca|tronco|pilha|galhos|bambu furado|inseto|passarinho|sapo|lagartixa|ninho/i],
  ['106', 'Microclima do Quintal', /^(q34|h35|a8|q3|s28|w31|g32|i36)-/, /microclima|muro|parede|canto|abrigad|quente|frio|geada|po[cç]o|sombra|reflet|sol da tarde|sol da manh|esquent|esfria|brisa|calor/i],
  ['107', 'Sementeira e Repicagem', /^(s28|w31|m33)-/, /semente|repic|semear|semeie|bandeja|germin|mudinha|sementeira|jornal|papel[aã]o/i],
  ['108', 'Horta de Sol e de Sombra', /^(g32|h35)-/, /sombra|sol forte|sol pleno|meia-sombra|espiga|sol da manh/i],
  ['109', 'Folhas da Horta', /^(g32|h35|s2)-/, /couve|alface|r[uú]cula|espinafre|br[oó]colis|repolho|azedinha|mostarda|agri[aã]o/i],
  ['110', 'Rosas Antigas e Enxertadas', /^r20-/, /./],
  ['111', 'Pulgao e Cochonilha', null, /pulg[aã]o|cochonilha|lagarta|[aá]caro|mosca-branca|tripes|broca|larva|ferrugem|m[ií]ldio|o[ií]dio/i],
  ['112', 'Orquidea de Pedra e de Touceira', /^c4-/, /./],
  ['113', 'Pimenta no Canteiro', /^p29-/, /./],
  ['114', 'Arvore e Raiz', /^t37-/, /./],
];
const dono = {};
const ordem = ['112', '113', '114', '110', '111', '103', '105', '108', '109', '104', '106', '107', '101', '102'];
for (const n of ordem) {
  const [, , pre, re] = LIVROS.find((l) => l[0] === n);
  for (const [id, f] of Object.entries(fatos)) {
    if (usados.has(id) || dono[id]) continue;
    if (pre && !pre.test(id)) continue;
    if (!re.test(f.texto) && !re.test(f.esp)) continue;
    dono[id] = n;
  }
}
const cont = {};
for (const [n, titulo] of LIVROS) {
  const linhas = Object.entries(dono).filter(([, v]) => v === n).map(([id]) => `${id} [${fatos[id].esp}|${fatos[id].serie}] ${fatos[id].texto}`);
  writeFileSync(`${import.meta.dirname}/pool9-${n}.txt`, `# TG ${n} ${titulo}: ${linhas.length} fatos (so estes)\n${linhas.join('\n')}\n`);
  cont[`${n} ${titulo}`] = linhas.length;
}
console.log(cont);
