// Fatos do post: do ebook (página e trecho literal que o código confere) ou da bíblia (catálogo).
import { validarFatoBiblia } from './biblia.mjs';
import { trechoEstaNaPagina } from './livros.mjs';

// Toxicidade e pet só entram com fonte de pet verificável: fato da bíblia vindo da cartilha
// UFG, da ASPCA, do artigo de Ancara ou da Cats Protection. Fora disso, o fato é recusado.
export const TOXICIDADE = /t[óo]xic|venen|\bpets?\b|\bc[ãa]es\b|\bc[ãa]o\b|\bgatos?\b/i;
const TRECHO_MINIMO = 25;

function validarFatoEbook(fato, i, { paginas, titulo }) {
  const { texto, pagina, trecho } = fato;
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
}

// bruto = [{ texto, pagina, trecho }] ou [{ biblia, texto }]. Devolve os fatos com a "fonte"
// montada ("Título, p. 12"). biblia = catálogo (lerBiblia), só exigido se algum fato vier dela.
export function validarFatos(fatos, { paginas, titulo, biblia = null }) {
  if (!Array.isArray(fatos) || fatos.length < 3) {
    throw new Error('[fatos] a pauta precisa de pelo menos 3 fatos');
  }
  return fatos.map((fato, i) => {
    const { texto, trecho } = fato ?? {};
    if (!texto?.trim()) throw new Error(`[fatos] fato ${i} sem texto`);
    const valido = fato.biblia
      ? validarFatoBiblia(fato, i, biblia)
      : validarFatoEbook(fato, i, { paginas, titulo });
    const fala = TOXICIDADE.test(texto) || TOXICIDADE.test(trecho ?? '');
    if (fala && !valido.fontePet) {
      throw new Error(`[fatos] fato ${i} fala de toxicidade ou pet, sem fonte de pet`);
    }
    return valido;
  });
}

// A matéria pode falar de toxicidade ou pet se o post usar um fato com fonte de pet.
export const temFontePet = (fatos, usados) => (usados ?? []).some((n) => fatos[n]?.fontePet);
