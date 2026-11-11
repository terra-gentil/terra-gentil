// Leva 10 (TG 115 a 128): separa os fatos livres da biblia por livro, sem fato repetido entre livros.
// Uso: node pools/montar10.mjs   (gera pools/pool10-115.txt ... pool10-128.txt e mostra as contagens)
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

// [numero, titulo, prefixos de id (ou null), regex de texto/especie]
const LIVROS = [
  ['115', 'Extratos e Chas de Planta', /^f11-/, /./],
  ['116', 'Araceas de Casa', /^w18-/, /./],
  ['117', 'Agave e Companhia', null, /agave|iuca|yucca|sisal|piteira|babosa|aloe|haworthia|sansevieria|espada-de|dracena/i],
  ['118', 'Palmeiras e Tropicais', null, /palmeira|palmito|areca|c[ií]cas|coqueiro|bananeira|ra[ií]ni|bambu|strelitzia|helic[oô]nia/i],
  ['119', 'Rosa Pelo Mundo', /^r20-/, /./],
  ['120', 'Estaca de Jardim', /^m33-/, /./],
  ['121', 'Trepadeiras de Flor', null, /trepadeira|tumb[eé]rgia|ipom[eé]ia|glic[ií]nia|alamanda|mandevila|cobeia|ervilha-de-cheiro|cip[oó]|jasmim-manga|primavera|maracuj[aá]-ornam/i],
  ['122', 'Bulbos e Dalias', null, /bulbo|d[aá]lia|amar[ií]lis|alstroem|l[ií]rio|gladi|tuberosa|agapanto|rizoma|tub[eé]rculo/i],
  ['123', 'Arbustos Floridos', null, /hort[eê]nsia|camelia|cam[eé]lia|azaleia|espirradeira|hibisco|arbusto|bola-de-neve|abutilon|lantana|brunfelsia|ixora|pingo-de-ouro/i],
  ['124', 'Horta Diferente', /^g32-/, /amaranto|erva-doce|raiz-forte|gengibre|shungiku|sabugueiro|mirtilo|chic[oó]ria|taioba|inhame|aspargo|ruibarbo|bertalha|ora-pro|capuchinha|c[uú]rcuma|jil[oó]|maxixe/i],
  ['125', 'Horta em Pouco Espaco', /^(h35|w31|s28|g32)-/, /pouco espa[cç]o|vaso|palete|muro|calha|varanda|canteiro|vertical|microverde|anão|an[aã]o|garrafa|balde/i],
  ['126', 'Desenho do Jardim', /^(i36|q34)-/, /./],
  ['127', 'Folha Colorida', null, /cal[aá]dio|c[rt]ot[oó]n|coleus|maranta|calathea|tradesc|peper[oô]mia|begonia|beg[oô]nia|colorid|variegad|manchad|listrad/i],
  ['128', 'Colher e Secar Ervas', /^v19-/, /./],
];
const dono = {};
const ordem = ['115', '116', '119', '120', '117', '118', '121', '122', '123', '124', '127', '125', '126', '128'];
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
  writeFileSync(`${import.meta.dirname}/pool10-${n}.txt`, `# TG ${n} ${titulo}: ${linhas.length} fatos (so estes)\n${linhas.join('\n')}\n`);
  cont[`${n} ${titulo}`] = linhas.length;
}
console.log(cont);
