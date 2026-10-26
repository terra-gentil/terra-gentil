// Equilibra as linhas do título (linha1..linha3), como o balancedWrap do setlist.
// Só mexe quando há linha órfã ("E", "do") ou linha terminando em palavra solta (de, um, ou).
import { LIMITES_TEXTO } from './estrutura.mjs';

const SOLTAS = new Set([
  'e', 'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'no', 'na', 'ou',
]);
const CAMPOS = ['linha1', 'linha2', 'linha3'];

function distribuir(palavras, n) {
  const alvo = palavras.join(' ').length / n;
  const linhas = [];
  let i = 0;
  for (let l = 0; l < n; l++) {
    let linha = palavras[i++] ?? '';
    while (
      i < palavras.length &&
      palavras.length - i > n - l - 1 &&
      `${linha} ${palavras[i]}`.length <= Math.ceil(alvo * 1.12)
    ) {
      linha += ` ${palavras[i++]}`;
    }
    linhas.push(linha);
  }
  // Palavra solta no fim de uma linha (que não é a última) passa para o começo da seguinte.
  for (let l = 0; l < n - 1; l++) {
    const partes = linhas[l].split(' ');
    if (partes.length > 1 && SOLTAS.has(partes[partes.length - 1].toLowerCase())) {
      linhas[l + 1] = `${partes.pop()} ${linhas[l + 1]}`.trim();
      linhas[l] = partes.join(' ');
    }
  }
  while (i < palavras.length) linhas[n - 1] += ` ${palavras[i++]}`;
  return linhas;
}

const ultimaPalavra = (linha) => linha.trim().split(/\s+/).pop().toLowerCase();

function precisaEquilibrar(linhas) {
  return linhas.some(
    (l, i) => l.trim().length <= 3 || (i < linhas.length - 1 && SOLTAS.has(ultimaPalavra(l))),
  );
}

// Devolve uma cópia do slide com as linhas redistribuídas, ou o próprio slide se já está bom.
export function equilibrarTitulo(slide) {
  const campos = CAMPOS.filter((c) => typeof slide[c] === 'string' && slide[c].trim());
  const linhas = campos.map((c) => slide[c].trim());
  if (linhas.length < 2 || !precisaEquilibrar(linhas)) return slide;
  const palavras = linhas.join(' ').split(/\s+/);
  const novas = distribuir(palavras, linhas.length);
  if (novas.some((l, i) => l.length > LIMITES_TEXTO[campos[i]])) return slide;
  const copia = { ...slide };
  campos.forEach((c, i) => {
    copia[c] = novas[i];
  });
  return copia;
}
