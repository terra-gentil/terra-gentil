// Verificador dos limites de tamanho e do cabeçalho de cada arquivo .mjs (ver AGENTS.md).
import fs from 'node:fs';
import path from 'node:path';
import { LIMITES } from './config.mjs';

const IGNORAR = new Set(['node_modules', '.cache', 'saida']);

// Lista todos os .mjs abaixo de `dir`, em ordem, pulando pastas geradas.
export function listarCodigo(dir) {
  const achados = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(item.name) || item.name.startsWith('.')) continue;
    const caminho = path.join(dir, item.name);
    if (item.isDirectory()) achados.push(...listarCodigo(caminho));
    else if (item.name.endsWith('.mjs')) achados.push(caminho);
  }
  return achados.sort();
}

// Devolve a lista de problemas do texto de um arquivo (vazia = dentro dos limites).
export function problemasDoTexto(texto, limites = LIMITES) {
  const problemas = [];
  const linhas = texto.replace(/\n$/, '').split('\n');
  if (linhas.length > limites.linhasPorArquivo) {
    problemas.push(`${linhas.length} linhas (máximo ${limites.linhasPorArquivo})`);
  }
  if (texto.length > limites.caracteresPorArquivo) {
    problemas.push(`${texto.length} caracteres (máximo ${limites.caracteresPorArquivo})`);
  }
  linhas.forEach((linha, i) => {
    if (linha.length > limites.caracteresPorLinha) {
      problemas.push(`linha ${i + 1} com ${linha.length} caracteres`);
    }
  });
  if (!linhas[0]?.startsWith('// ')) {
    problemas.push('falta o comentário de cabeçalho na 1a linha');
  }
  return problemas;
}
