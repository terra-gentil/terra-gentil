// Biblioteca de moldes: acha o .dc.html certo (molde + tipo de slide) e monta o HTML do slide.
import fs from 'node:fs';
import path from 'node:path';
import { naRaiz } from '../lib/config.mjs';
import { TIPOS } from './contrato.mjs';
import { montarHtml } from './dc/montar.mjs';

export const PASTA_MOLDES = naRaiz('carrossel', 'moldes');

export function listarMoldes(pasta = PASTA_MOLDES) {
  return fs
    .readdirSync(pasta, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function lerMolde(molde, tipo, pasta = PASTA_MOLDES) {
  if (!TIPOS.includes(tipo)) throw new Error(`[moldes] tipo de slide desconhecido: ${tipo}`);
  const arquivo = path.join(pasta, molde, `${tipo}.dc.html`);
  try {
    return fs.readFileSync(arquivo, 'utf8');
  } catch (erro) {
    throw new Error(`[moldes] não achei ${molde}/${tipo}: ${erro.message}`);
  }
}

// dados = só o que muda no dia. O resto do slide vem do padrão do molde.
export function montarSlide(molde, tipo, dados = {}, pasta = PASTA_MOLDES) {
  return montarHtml(lerMolde(molde, tipo, pasta), dados);
}
