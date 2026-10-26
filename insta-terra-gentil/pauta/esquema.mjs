// Esquema JSON da resposta do modelo: um objeto por slide, com os campos que o modelo escreve.
import { ESTRUTURA, TEXTOS_OBRIGATORIOS } from '../carrossel/estrutura.mjs';

// O fechamento da marca é fixo no código ("Gentileza gera gentileza"); o modelo só escreve o texto.
export const FINAL_FIXO = Object.freeze({
  tarja: 'Para levar',
  linha1: 'Gentileza',
  destaque: 'gera',
  linha2: 'gentileza',
});

export const chaveDoSlide = (i) => `slide${i + 1}_${ESTRUTURA[i]}`;
export const camposDoModelo = (tipo) => (tipo === 'final' ? ['texto'] : TEXTOS_OBRIGATORIOS[tipo]);

const texto = { type: 'string' };

function objeto(campos) {
  const properties = Object.fromEntries(campos.map((campo) => [campo, texto]));
  return { type: 'object', properties, required: campos, additionalProperties: false };
}

// Tamanho de campo não vai no esquema (a API não aceita maxLength): vai no prompt e na validação.
export function esquemaDoRoteiro() {
  const properties = {
    gancho: texto,
    resumo: texto,
    fatosUsados: { type: 'array', items: { type: 'integer' } },
  };
  ESTRUTURA.forEach((tipo, i) => {
    properties[chaveDoSlide(i)] = objeto(camposDoModelo(tipo));
  });
  return {
    type: 'object',
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}
