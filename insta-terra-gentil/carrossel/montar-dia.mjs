// Monta o carrossel do dia: molde da rotação + foto da espécie + roteiro de 8 slides + legenda.
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_SITE, SITE_URL } from '../lib/config.mjs';
import { paraDataUri } from './dc/imagens.mjs';
import { OBRIGATORIOS } from './contrato.mjs';
import { ESTRUTURA, problemasDoRoteiro } from './estrutura.mjs';
import { medirEstouro } from './estouro.mjs';
import { ctaDoFinal } from './cta.mjs';
import { legendaDe } from './legenda.mjs';
import { montarSlide } from './moldes.mjs';
import { FOTO_LIMPA, moldeDoDia } from './rotacao.mjs';
import { equilibrarTitulo } from './titulo.mjs';

const IMAGENS = path.join(RAIZ_SITE, 'public', 'images');
const poseDoMascote = (i) => path.join(IMAGENS, 'mascot', `pose-${(i % 8) + 1}.jpg`);
const FOTO_ANDRE = path.join(IMAGENS, 'photos', 'andre-bench.png');
const ESCURECIMENTO_CAPA = 30;
const ESCURECIMENTO_CAPA_ANDRE = 8; // foto do André: véu mínimo para a logo aparecer
// Slide da segunda foto do André (o "Passo 1", onde ele mostra como faz).
export const SLIDE_DENTRO = ESTRUTURA.indexOf('passo');
// Enquadramento da foto por slide, para os 8 não parecerem o mesmo recorte repetido.
const ENQUADRAMENTOS = [
  ['center', 1],
  ['top', 1.2],
  ['bottom', 1.25],
  ['left', 1.3],
  ['center', 1.15],
  ['top right', 1.25],
  ['bottom left', 1.2],
  ['center', 1.1],
];

// Só manda o que o contrato do tipo pede: capa não tem mascote, só passo tem foto do André.
function dadosDoSlide(slide, i, foto, credito, pessoa) {
  const tipo = ESTRUTURA[i];
  const campos = OBRIGATORIOS[tipo];
  const dados = { ...equilibrarTitulo(slide), foto, contador: `${i + 1}/${ESTRUTURA.length}` };
  if (campos.includes('mascote')) dados.mascote = paraDataUri(poseDoMascote(i));
  if (campos.includes('fotoAndre')) dados.fotoAndre = paraDataUri(FOTO_ANDRE);
  if (campos.includes('legendaFoto')) dados.legendaFoto ??= credito;
  if (tipo === 'capa') {
    dados.escurecimento ??= pessoa ? ESCURECIMENTO_CAPA_ANDRE : ESCURECIMENTO_CAPA;
  }
  const [foco, zoom] = ENQUADRAMENTOS[i];
  dados.foco ??= foco;
  dados.zoom ??= zoom;
  if (tipo === 'passo') {
    const numero = ESTRUTURA.slice(0, i + 1).filter((t) => t === 'passo').length;
    dados.numero ??= String(numero).padStart(2, '0');
    dados.tarja ??= `Passo ${numero}`;
    // O álbum usa `nota` como legenda da polaroid: sem isto vaza o texto de exemplo do molde.
    dados.nota ??= 'terra gentil';
  }
  return dados;
}

// post = { especie, gancho, resumo?, palavra?, slides[8] }. dependências injetáveis para teste.
// obterCapa (opcional) devolve a capa do André com a planta ou o tema (capas/banco.mjs) ou null.
export async function montarDia(post, opcoes) {
  const { dia, saida, renderizar, obterFoto, obterCapa, tituloEbook, capaEbook } = opcoes;
  const problemas = problemasDoRoteiro(post.slides);
  if (problemas.length) {
    throw new Error(`[montar-dia] roteiro inválido:\n- ${problemas.join('\n- ')}`);
  }
  fs.mkdirSync(saida, { recursive: true });
  const molde = moldeDoDia(dia);
  const foto = await obterFoto(post.especie);
  const fotoUri = paraDataUri(foto.caminho);
  const capa = obterCapa ? await obterCapa(post, dia) : null;
  const capaUri = capa ? paraDataUri(capa.caminho) : fotoUri;
  const dentroUri = capa?.dentro ? paraDataUri(capa.dentro) : null;
  const comAndre = (i) =>
    (ESTRUTURA[i] === 'capa' && !!capa) || (i === SLIDE_DENTRO && !!dentroUri);
  const fotoDe = (i) => {
    if (ESTRUTURA[i] === 'capa') return capaUri;
    return i === SLIDE_DENTRO && dentroUri ? dentroUri : fotoUri;
  };
  // Com ebook, o último slide mostra a capa dele no lugar do mascote.
  const cta = ctaDoFinal(post.palavra, tituloEbook);
  if (post.palavra && capaEbook) {
    Object.assign(cta, { capaEbook: paraDataUri(capaEbook), mostrarMascote: false });
  }
  const comCta = (slide, i) => (ESTRUTURA[i] === 'final' ? { ...slide, ...cta } : slide);
  const paginas = post.slides.map((slide, i) => ({
    html: montarSlide(
      molde,
      ESTRUTURA[i],
      dadosDoSlide(comCta(slide, i), i, fotoDe(i), foto.credito, !!capa),
    ),
    saida: path.join(saida, `${dia}-${molde}-${String(i + 1).padStart(2, '0')}.png`),
    fotoLimpa: FOTO_LIMPA.has(molde),
    capa: ESTRUTURA[i] === 'capa',
    pessoa: comAndre(i),
  }));
  const avisos = [];
  const aoAbrir = async (pagina, arquivo) => {
    const fora = await medirEstouro(pagina);
    if (fora.length) avisos.push({ slide: path.basename(arquivo), textoFora: fora });
  };
  const pngs = await renderizar(paginas, { aoAbrir, jpeg: true });
  const urlNoticia = post.materia ? `${SITE_URL}/noticias/${post.materia.slug}` : undefined;
  const legenda = legendaDe({ ...post, tituloEbook, credito: foto.credito, urlNoticia });
  fs.writeFileSync(path.join(saida, `${dia}-legenda.txt`), `${legenda}\n`);
  const { especie } = post;
  const { credito, provedor } = foto;
  const ficha = { dia, molde, especie, credito, provedor, avisos, noticia: urlNoticia };
  ficha.capa = capa ? path.basename(capa.caminho) : null;
  ficha.dentro = capa?.dentro ? path.basename(capa.dentro) : null;
  fs.writeFileSync(path.join(saida, `${dia}-ficha.json`), `${JSON.stringify(ficha, null, 2)}\n`);
  return { molde, pngs, legenda, avisos, foto, capa };
}
