// Fachada do conversor: molde .dc.html + dados do dia viram uma página HTML pronta para render.
import { extrair, padroesDe } from './extrair.mjs';
import { aplicarCondicoes, preencher } from './gabarito.mjs';
import { calcularValores, carregarComponente } from './valores.mjs';

// dados = só o que muda no dia (foto, textos, escurecimento...). O resto vem do padrão do molde.
export function montarHtml(textoDc, dados = {}) {
  const molde = extrair(textoDc);
  const props = { ...padroesDe(molde.props), ...dados };
  const valores = calcularValores(carregarComponente(molde.codigo), props);
  const corpo = preencher(aplicarCondicoes(molde.corpo, valores), valores);
  return [
    '<!doctype html>',
    '<html lang="pt-BR">',
    `<head><meta charset="utf-8"><title>${molde.titulo}</title>${molde.helmet}</head>`,
    `<body>${corpo}</body>`,
    '</html>',
  ].join('\n');
}

// Nomes dos ajustes que o molde aceita em `dados` (usado para conferir o contrato entre moldes).
export function camposDoMolde(textoDc) {
  return Object.keys(extrair(textoDc).props).filter((nome) => !nome.startsWith('$'));
}
