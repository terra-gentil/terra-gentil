// Linha de comando: capa-noticia-cli.mjs --post <post.json> --saida <pasta do render>.
// Grava em public/noticias/<slug>/ e conta no stdout o que fez. Post sem matéria: não faz nada.
import path from 'node:path';
import { RAIZ_SITE } from '../../lib/config.mjs';
import { lerJson } from '../../lib/json.mjs';
import { gravarCapa } from './capa-noticia.mjs';

const args = process.argv.slice(2);
const valor = (nome) => args[args.indexOf(nome) + 1];
const arquivo = valor('--post');
const saida = valor('--saida');
if (!arquivo || !saida) {
  console.error('uso: capa-noticia-cli.mjs --post <post.json> --saida <pasta do render>');
  process.exit(1);
}

try {
  const publico = path.join(RAIZ_SITE, 'public', 'noticias');
  const post = lerJson(path.resolve(arquivo));
  const r = gravarCapa({ post, saida: path.resolve(saida), publico });
  console.log(r ? `capa gravada em public/noticias/${r.slug}` : 'post sem matéria: nada a gravar');
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}
