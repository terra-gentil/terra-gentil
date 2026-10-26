// Fatos do post: cada um vem do livro, com a página e um trecho literal que o código confere.
import { trechoEstaNaPagina } from './livros.mjs';

// Toxicidade e pet só entram com fonte ASPCA ou Sinitox, e a rotina não consulta essas fontes.
// Até existir uma fonte verificável, o fato que fala disso é recusado.
const TOXICIDADE = /t[óo]xic|venen|\bpets?\b|\bc[ãa]es\b|\bc[ãa]o\b|\bgatos?\b/i;
const TRECHO_MINIMO = 25;

// bruto = [{ texto, pagina, trecho }]. Devolve os fatos com a "fonte" montada ("Título, p. 12").
export function validarFatos(fatos, { paginas, titulo }) {
  if (!Array.isArray(fatos) || fatos.length < 3) {
    throw new Error('[fatos] a pauta precisa de pelo menos 3 fatos');
  }
  return fatos.map((fato, i) => {
    const { texto, pagina, trecho } = fato ?? {};
    if (!texto?.trim()) throw new Error(`[fatos] fato ${i} sem texto`);
    if (TOXICIDADE.test(texto) || TOXICIDADE.test(trecho ?? '')) {
      throw new Error(`[fatos] fato ${i} fala de toxicidade ou pet, sem fonte ASPCA/Sinitox`);
    }
    if (!Number.isInteger(pagina) || pagina < 1 || pagina > paginas.length) {
      throw new Error(
        `[fatos] fato ${i} com página inválida (${pagina}, o livro tem ${paginas.length})`,
      );
    }
    if ((trecho ?? '').trim().length < TRECHO_MINIMO) {
      throw new Error(
        `[fatos] fato ${i} sem trecho literal do livro (mínimo ${TRECHO_MINIMO} caracteres)`,
      );
    }
    if (!trechoEstaNaPagina(paginas, pagina, trecho)) {
      throw new Error(`[fatos] fato ${i}: o trecho não existe na página ${pagina} do livro`);
    }
    return { texto: texto.trim(), pagina, trecho: trecho.trim(), fonte: `${titulo}, p. ${pagina}` };
  });
}
