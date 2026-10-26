// Imagem local vira data URI: a página renderizada não depende de caminho de arquivo nem de rede.
import fs from 'node:fs';
import path from 'node:path';

const TIPOS = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

// Endereço da web e data URI passam direto; só caminho de arquivo é lido e convertido.
export function paraDataUri(caminho) {
  if (/^(https?:|data:)/i.test(caminho)) return caminho;
  const tipo = TIPOS[path.extname(caminho).toLowerCase()];
  if (!tipo) throw new Error(`[imagem] formato não aceito: ${caminho}`);
  let bytes;
  try {
    bytes = fs.readFileSync(caminho);
  } catch (erro) {
    throw new Error(`[imagem] não consegui ler ${caminho}: ${erro.message}`);
  }
  return `data:${tipo};base64,${bytes.toString('base64')}`;
}
