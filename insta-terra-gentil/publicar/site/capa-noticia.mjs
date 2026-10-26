// Grava no site a capa da notícia (public/noticias/<slug>/): o JPEG da capa e o crédito da foto.
import fs from 'node:fs';
import path from 'node:path';
import { lerJson } from '../../lib/json.mjs';

// post = o JSON em dados/posts. saida = pasta do render. publico = public/noticias do site.
// Devolve o que gravou, ou null se o post não tem matéria (post antigo, sem página no site).
export function gravarCapa({ post, saida, publico }) {
  const slug = post?.materia?.slug;
  if (!slug) return null;
  const nomes = fs.readdirSync(saida);
  const capa = nomes.find((n) => /-01\.jpg$/.test(n));
  const fichaNome = nomes.find((n) => n.endsWith('-ficha.json'));
  if (!capa || !fichaNome) throw new Error(`[capa] sem capa ou ficha em ${saida}`);
  const { credito } = lerJson(path.join(saida, fichaNome));
  const pasta = path.join(publico, slug);
  fs.mkdirSync(pasta, { recursive: true });
  fs.copyFileSync(path.join(saida, capa), path.join(pasta, 'capa.jpg'));
  fs.writeFileSync(path.join(pasta, 'capa.json'), `${JSON.stringify({ credito }, null, 2)}\n`);
  return { slug, pasta };
}
