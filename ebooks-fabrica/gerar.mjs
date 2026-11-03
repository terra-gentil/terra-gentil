// Expande um roteiro curto (spec .mjs) no roteiro completo do motor: poe rodape e numeracao.
// uso: node gerar.mjs <spec.mjs> <saida.json>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const MOLDES = ['Main', 'Carta', 'Rapido', 'Sumario', 'Ficha', 'Abertura1', 'Tabela', 'Abertura',
  'Passos', 'Texto', 'Erro', 'Abertura3', 'Precisar', 'Alerta', 'Galeria', 'Sinais', 'Sabia',
  'Checklist', 'Fechamento'];
const { default: s } = await import(pathToFileURL(resolve(process.argv[2])).href);
const nome = `${s.livro} ${s.titulo.toUpperCase()}`;
const total = s.paginas.length;
if (total !== MOLDES.length) throw new Error(`esperava ${MOLDES.length} paginas, veio ${total}`);
const paginas = s.paginas.map((p, i) => {
  const molde = `${MOLDES[i]}.dc.html`;
  const textos = [...p.t];
  if (i === 0) textos.splice(0, 0, 'TG', s.livro.slice(3));
  else if (i === total - 1) textos.push(nome, `${i + 1} DE ${total}`);
  else textos.push(`Na próxima: ${p.n}`, '→', nome, `${i + 1} DE ${total}`);
  const pg = { molde };
  if (p.f) pg.fatos = p.f;
  pg.textos = textos;
  if (p.p) pg.fotos = p.p.map(([src, alt]) => ({ src, alt }));
  return pg;
});
const roteiro = { livro: s.livro, titulo: s.titulo, serie: s.serie, paginas };
writeFileSync(process.argv[3], JSON.stringify(roteiro, null, 2) + '\n');
console.log('ok', process.argv[3]);
