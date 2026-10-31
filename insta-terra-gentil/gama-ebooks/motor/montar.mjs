// Junta as paginas de um roteiro (molde do canvas + textos + fotos) num HTML unico para o PDF.
import { aplicarPagina, lerPagina } from './paginas.mjs';

const BLOB = /^\/_blob\/([0-9a-f]{32})$/;

// Foto do Claude Design vira <id>.jpg; o resto e nome de arquivo na pasta de fotos.
export function arquivoDaFoto(src) {
  const m = src.match(BLOB);
  return m ? `${m[1]}.jpg` : src;
}

// Roteiro a partir de um canvas pronto: base para escrever o proximo livro.
export function extrairRoteiro(canvas, lerMolde) {
  return {
    livro: '',
    titulo: canvas.title ?? '',
    serie: '#1F4D2B',
    paginas: canvas.order.map((molde) => ({ molde, ...lerPagina(lerMolde(molde)) })),
  };
}

function fontesDe(src) {
  const m = src.match(/<helmet>([\s\S]*?)<\/helmet>/);
  return m ? m[1] : '';
}

export function montarLivro(roteiro, lerMolde) {
  let fontes = '';
  const paginas = roteiro.paginas.map((pg, i) => {
    const src = lerMolde(pg.molde);
    if (fontesDe(src).length > fontes.length) fontes = fontesDe(src);
    const fotos = (pg.fotos ?? []).map((f) => ({ ...f, src: arquivoDaFoto(f.src) }));
    let corpo = aplicarPagina(src, { textos: pg.textos, fotos }, `p${i + 1} ${pg.molde}`);
    corpo = corpo.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
    corpo = corpo.replaceAll('{{serie}}', roteiro.serie ?? '#1F4D2B');
    return `<section class="pg">${corpo}</section>`;
  });
  const css = '@page{size:1080px 1920px;margin:0}body{margin:0}'
    + '.pg{width:1080px;height:1920px;overflow:hidden;break-after:page}'
    // Bloco nao encolhe: tabela cortada vira estouro visivel na checagem, nunca linha escondida
    + '.pg>div>*{flex-shrink:0}';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${fontes}
<style>${css}</style></head><body>${paginas.join('\n')}</body></html>`;
}
