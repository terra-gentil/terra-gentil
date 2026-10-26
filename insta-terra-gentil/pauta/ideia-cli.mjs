// Linha de comando: node pauta/ideia-cli.mjs <pauta.json> [saida.json]. Escreve o post (roteiro).
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { buscarPorPalavra, carregarPalavras } from '../dm/palavras.mjs';
import { lerJson } from '../lib/json.mjs';
import { MODELO, gerarRoteiro } from './ideia.mjs';

const [arquivo, saida] = process.argv.slice(2);
if (!arquivo) {
  console.error('uso: node pauta/ideia-cli.mjs <pauta.json> [saida.json]');
  process.exit(1);
}
const pauta = lerJson(path.resolve(arquivo));
const ebook = pauta.palavra ? buscarPorPalavra(carregarPalavras(), pauta.palavra) : null;

try {
  const post = await gerarRoteiro(pauta, { cliente: new Anthropic(), ebook });
  const destino = path.resolve(saida ?? arquivo.replace(/\.json$/, '-post.json'));
  fs.writeFileSync(destino, `${JSON.stringify(post, null, 2)}\n`);
  console.log(`roteiro de ${post.especie} escrito por ${MODELO} em ${destino}`);
  console.log(`fontes usadas: ${post.fontes.join(' | ')}`);
} catch (erro) {
  if (erro instanceof Anthropic.AuthenticationError || /authentication/i.test(erro.message)) {
    console.error('ideia desligada: falta ANTHROPIC_API_KEY (ou `ant auth login`).');
  } else if (erro instanceof Anthropic.RateLimitError) {
    console.error('limite de uso da API atingido, tente de novo em alguns minutos.');
  } else if (erro instanceof Anthropic.APIError) {
    console.error(`erro da API ${erro.status}: ${erro.message}`);
  } else {
    console.error(erro.message);
  }
  process.exit(1);
}
