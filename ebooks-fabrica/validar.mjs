// Confere os roteiros: fatos existem na biblia, sem travessao, fotos repetidas no mesmo livro.
import { readFileSync, readdirSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const fatos = JSON.parse(readFileSync(`${REPO}/dados/biblia.json`, 'utf8')).fatos;
for (const arq of readdirSync(`${REPO}/gama-ebooks/roteiros`).filter((a) => a.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(`${REPO}/gama-ebooks/roteiros/${arq}`, 'utf8'));
  const erros = [];
  const fotos = {};
  r.paginas.forEach((p, i) => {
    for (const f of p.fatos ?? []) if (!fatos[f]) erros.push(`p${i + 1} fato inexistente ${f}`);
    for (const t of p.textos) if (/[\u2013\u2014]/.test(t)) erros.push(`p${i + 1} travessao: ${t}`);
    for (const f of p.fotos ?? []) (fotos[f.src] ??= []).push(i + 1);
  });
  for (const [src, pgs] of Object.entries(fotos)) if (pgs.length > 1) erros.push(`foto repetida ${src} em ${pgs}`);
  console.log(arq, erros.length ? '\n  ' + erros.join('\n  ') : 'ok');
}
