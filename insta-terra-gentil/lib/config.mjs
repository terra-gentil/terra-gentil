// Configuração central: caminhos, endereços da marca e limites do código.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Raiz do subprojeto (insta-terra-gentil/) e do repositório do site.
export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAIZ_SITE = path.resolve(RAIZ, '..');

export const DADOS = path.join(RAIZ, 'dados');
export const EBOOKS_DIR = path.join(RAIZ_SITE, 'public', 'ebooks');

// Copiados de lib/constants.ts da raiz (o site é TypeScript; aqui é Node puro).
export const SITE_URL = 'https://terragentil.com.br';
export const INSTAGRAM_HANDLE = '@canalterragentil';
export const YOUTUBE_URL = 'https://www.youtube.com/@TerraGentil';
export const DOUTOR_URL = `${SITE_URL}/doutor`;

// Limites de todo arquivo .mjs desta pasta (ver AGENTS.md). Só podem diminuir.
export const LIMITES = Object.freeze({
  linhasPorArquivo: 160,
  caracteresPorArquivo: 6000,
  caracteresPorLinha: 100,
});

export const naRaiz = (...partes) => path.join(RAIZ, ...partes);
