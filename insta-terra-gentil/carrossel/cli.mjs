// Linha de comando: node carrossel/cli.mjs <post.json> [AAAA-MM-DD]. Monta o carrossel em saida/.
import path from 'node:path';
import { naRaiz, DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { buscarPorPalavra, carregarPalavras } from '../dm/palavras.mjs';
import { capaDoDia, lerPosts } from '../capas/banco.mjs';
import { fotoDoDia } from './foto-do-dia.mjs';
import { montarDia } from './montar-dia.mjs';
import { renderizar } from './render.mjs';
import { diaBrasilia } from './rotacao.mjs';

const [arquivo, diaArg] = process.argv.slice(2);
if (!arquivo) {
  console.error('uso: node carrossel/cli.mjs <post.json> [AAAA-MM-DD]');
  process.exit(1);
}
const post = lerJson(path.resolve(arquivo));
const dia = diaArg ?? diaBrasilia();
const { fotos: curadas } = lerJson(path.join(DADOS, 'fotos.json'));
const pastaFotos = naRaiz('fotos');
const ebook = post.palavra ? buscarPorPalavra(carregarPalavras(), post.palavra) : null;
const { especies: catalogo } = lerJson(path.join(DADOS, 'capas.json'));
const posts = lerPosts(path.join(DADOS, 'posts'));
const banco = { catalogo, pastaBanco: naRaiz('capas', 'banco'), posts };

const resultado = await montarDia(post, {
  dia,
  saida: naRaiz('saida', dia),
  renderizar,
  obterFoto: (especie) => fotoDoDia(especie, { curadas, pasta: pastaFotos }),
  obterCapa: (especie, d) => capaDoDia(especie, d, banco),
  tituloEbook: ebook?.titulo,
});

const { molde, foto, capa } = resultado;
console.log(`molde ${molde} | foto ${foto.provedor}: ${foto.credito}`);
const origemCapa = capa ? `do André, ${path.basename(capa.caminho)}` : 'foto da planta (sem banco)';
console.log(`capa: ${origemCapa}`);
resultado.pngs.forEach((png) => console.log(png));
for (const aviso of resultado.avisos) {
  console.warn(`AVISO ${aviso.slide}: texto fora do slide: ${aviso.textoFora.join(' | ')}`);
}
