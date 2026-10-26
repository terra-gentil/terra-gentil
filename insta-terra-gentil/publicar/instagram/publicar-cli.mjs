// Linha de comando: node publicar/instagram/publicar-cli.mjs --dia AAAA-MM-DD --pasta <dir>
// Opção --so-token: só valida o token e a conta, não publica.
// Resultado em GITHUB_OUTPUT (acao) e em GITHUB_STEP_SUMMARY. Erro derruba o job.
import fs from 'node:fs';
import { diaBrasilia } from '../../carrossel/rotacao.mjs';
import { publicarDia } from './publicar-dia.mjs';

const BASE_PADRAO = 'https://raw.githubusercontent.com/terra-gentil/terra-gentil/ig-slides';
const args = process.argv.slice(2);
const valor = (nome) => args[args.indexOf(nome) + 1];
const dia = args.includes('--dia') ? valor('--dia') : diaBrasilia();
const pasta = valor('--pasta');
if (!pasta) {
  console.error('uso: publicar-cli.mjs --dia AAAA-MM-DD --pasta <dir> [--so-token]');
  process.exit(1);
}

const resumo = (...linhas) => {
  const texto = linhas.filter(Boolean).join('\n');
  console.log(texto);
  const arquivo = process.env.GITHUB_STEP_SUMMARY;
  if (arquivo) fs.appendFileSync(arquivo, `${texto}\n`);
};

const TITULOS = {
  desligado: 'DESLIGADO, nada foi publicado',
  publicado: 'publicado',
  recuperado: 'publicado (recuperado após erro)',
  'token-ok': 'token e conta conferidos, nada publicado',
  'ja-publicado': 'já estava publicado, nada a fazer',
};

try {
  const baseUrl = process.env.IG_SLIDES_BASE ?? BASE_PADRAO;
  const soToken = args.includes('--so-token');
  const r = await publicarDia({ dia, pasta, baseUrl, env: process.env, soToken });
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `acao=${r.acao}\n`);
  resumo(`## Instagram ${dia}: ${TITULOS[r.acao]}`, r.conta && `Conta: ${r.conta}`);
  if (r.acao === 'desligado') resumo(`Imagens no ar: ${r.urls.length}. Ligar: IG_PUBLICAR=ligado`);
} catch (erro) {
  resumo(`## Instagram ${dia}: FALHOU`, erro.message);
  process.exit(1);
}
