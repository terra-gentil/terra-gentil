// Livros dos ebooks em texto: extrai o PDF por página e confere se um trecho existe na página.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { DADOS, EBOOKS_DIR } from '../lib/config.mjs';

export const PASTA_LIVROS = path.join(DADOS, 'livros');

// Sem acento, minúsculo, só letras e números separados por um espaço: o PDF quebra linha e
// troca aspas no meio da frase, então a conferência de trecho ignora pontuação e espaçamento.
export function normalizarTexto(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// O pdftotext separa as páginas com form feed (\f). Página 1 = índice 0.
export function paginasDoTexto(texto) {
  const paginas = texto.split('\f');
  if (paginas.length > 1 && !paginas.at(-1).trim()) paginas.pop();
  return paginas;
}

export function trechoEstaNaPagina(paginas, pagina, trecho) {
  const alvo = normalizarTexto(trecho ?? '');
  const base = normalizarTexto(paginas[pagina - 1] ?? '');
  return alvo.length > 0 && base.includes(alvo);
}

// "16-Jiboia-na-Sala.pdf" -> dados/livros/16-Jiboia-na-Sala.txt
export function arquivoDoLivro(item, pasta = PASTA_LIVROS) {
  return path.join(pasta, item.pdf.replace(/\.pdf$/i, '.txt'));
}

export function lerLivro(item, pasta = PASTA_LIVROS) {
  const arquivo = arquivoDoLivro(item, pasta);
  if (!fs.existsSync(arquivo)) throw new Error(`[livros] falta ${arquivo}: rode "livros"`);
  return paginasDoTexto(fs.readFileSync(arquivo, 'utf8'));
}

// pdftotext (poppler) vem no Git for Windows e no apt. PDFTOTEXT aponta para outro caminho.
export function extrairPdf(pdf, executar = execFileSync) {
  const programa = process.env.PDFTOTEXT || 'pdftotext';
  const saida = executar(programa, ['-enc', 'UTF-8', pdf, '-'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (!saida.trim()) throw new Error(`[livros] ${pdf} sem texto (PDF só de imagem?)`);
  return saida;
}

export function extrairTodos(palavras, { forcar = false, pastaPdf = EBOOKS_DIR } = {}) {
  fs.mkdirSync(PASTA_LIVROS, { recursive: true });
  return palavras.map((item) => {
    const destino = arquivoDoLivro(item);
    if (!forcar && fs.existsSync(destino)) return { palavra: item.palavra, feito: false };
    const texto = extrairPdf(path.join(pastaPdf, item.pdf));
    fs.writeFileSync(destino, texto);
    return { palavra: item.palavra, feito: true, paginas: paginasDoTexto(texto).length };
  });
}
