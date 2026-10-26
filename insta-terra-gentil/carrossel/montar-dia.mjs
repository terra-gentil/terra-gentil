// Monta o carrossel do dia: molde da rotação + foto da espécie + roteiro de 8 slides + legenda.
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_SITE } from '../lib/config.mjs';
import { paraDataUri } from './dc/imagens.mjs';
import { OBRIGATORIOS } from './contrato.mjs';
import { ESTRUTURA, problemasDoRoteiro } from './estrutura.mjs';
import { medirEstouro } from './estouro.mjs';
import { legendaDe } from './legenda.mjs';
import { montarSlide } from './moldes.mjs';
import { moldeDoDia } from './rotacao.mjs';

const IMAGENS = path.join(RAIZ_SITE, 'public', 'images');
const poseDoMascote = (i) => path.join(IMAGENS, 'mascot', `pose-${(i % 8) + 1}.jpg`);
const FOTO_ANDRE = path.join(IMAGENS, 'photos', 'andre-bench.png');
const ESCURECIMENTO_CAPA = 45;

// Só manda o que o contrato do tipo pede: capa não tem mascote, só passo tem foto do André.
function dadosDoSlide(slide, i, foto, credito) {
  const tipo = ESTRUTURA[i];
  const campos = OBRIGATORIOS[tipo];
  const dados = { ...slide, foto, contador: `${i + 1}/${ESTRUTURA.length}` };
  if (campos.includes('mascote')) dados.mascote = paraDataUri(poseDoMascote(i));
  if (campos.includes('fotoAndre')) dados.fotoAndre = paraDataUri(FOTO_ANDRE);
  if (campos.includes('legendaFoto')) dados.legendaFoto ??= credito;
  if (tipo === 'capa') dados.escurecimento ??= ESCURECIMENTO_CAPA;
  if (tipo === 'passo') {
    const numero = ESTRUTURA.slice(0, i + 1).filter((t) => t === 'passo').length;
    dados.numero ??= String(numero).padStart(2, '0');
    dados.tarja ??= `Passo ${numero}`;
  }
  return dados;
}

// post = { especie, gancho, resumo?, palavra?, slides[8] }. dependências injetáveis para teste.
export async function montarDia(post, { dia, saida, renderizar, obterFoto, tituloEbook }) {
  const problemas = problemasDoRoteiro(post.slides);
  if (problemas.length) {
    throw new Error(`[montar-dia] roteiro inválido:\n- ${problemas.join('\n- ')}`);
  }
  fs.mkdirSync(saida, { recursive: true });
  const molde = moldeDoDia(dia);
  const foto = await obterFoto(post.especie);
  const fotoUri = paraDataUri(foto.caminho);
  const paginas = post.slides.map((slide, i) => ({
    html: montarSlide(molde, ESTRUTURA[i], dadosDoSlide(slide, i, fotoUri, foto.credito)),
    saida: path.join(saida, `${dia}-${molde}-${String(i + 1).padStart(2, '0')}.png`),
  }));
  const avisos = [];
  const aoAbrir = async (pagina, arquivo) => {
    const fora = await medirEstouro(pagina);
    if (fora.length) avisos.push({ slide: path.basename(arquivo), textoFora: fora });
  };
  const pngs = await renderizar(paginas, { aoAbrir });
  const legenda = legendaDe({ ...post, tituloEbook, credito: foto.credito });
  fs.writeFileSync(path.join(saida, `${dia}-legenda.txt`), `${legenda}\n`);
  const { especie } = post;
  const ficha = { dia, molde, especie, credito: foto.credito, provedor: foto.provedor, avisos };
  fs.writeFileSync(path.join(saida, `${dia}-ficha.json`), `${JSON.stringify(ficha, null, 2)}\n`);
  return { molde, pngs, legenda, avisos, foto };
}
