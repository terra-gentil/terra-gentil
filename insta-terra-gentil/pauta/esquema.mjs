// Formato do que a rotina escreve: um objeto por slide ("slide3_problema"), só com os textos.
import { ESTRUTURA, TEXTOS_OBRIGATORIOS } from '../carrossel/estrutura.mjs';

// O fechamento da marca é fixo no código ("Gentileza gera gentileza"); a rotina só escreve o texto.
export const FINAL_FIXO = Object.freeze({
  tarja: 'Para levar',
  linha1: 'Gentileza',
  destaque: 'gera',
  linha2: 'gentileza',
});

export const chaveDoSlide = (i) => `slide${i + 1}_${ESTRUTURA[i]}`;
export const camposDoModelo = (tipo) => (tipo === 'final' ? ['texto'] : TEXTOS_OBRIGATORIOS[tipo]);

// Lista de chaves esperadas no JSON da rotina, na ordem: usada no prompt e na conferência.
export const CHAVES_DO_BRUTO = Object.freeze([
  'palavra',
  'especie',
  'nome',
  'serie',
  'gancho',
  'resumo',
  'fatos',
  'fatosUsados',
  'materia',
  ...ESTRUTURA.map((_, i) => chaveDoSlide(i)),
]);
