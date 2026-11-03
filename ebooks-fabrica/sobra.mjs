// lista fatos de um f-ESP.txt ainda nao usados em nenhum roteiro
import { readFileSync, readdirSync } from 'node:fs';
const R = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil/gama-ebooks/roteiros';
const usados = new Set();
for (const a of readdirSync(R).filter((x) => x.endsWith('.json')))
  for (const p of JSON.parse(readFileSync(`${R}/${a}`, 'utf8')).paginas) for (const f of p.fatos ?? []) usados.add(f);
const linhas = readFileSync(process.argv[2], 'utf8').split('\n').filter((l) => l.trim() && !usados.has(l.split(' | ')[0]));
const re = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
for (const l of linhas) if (!re || re.test(l)) console.log(l);
