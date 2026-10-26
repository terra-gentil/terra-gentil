// CLI da renovação: lê IG_ACCESS_TOKEN, grava o token novo no arquivo --saida (nunca no log).
import fs from 'node:fs';
import { renovarToken } from './renovar.mjs';

function argumento(nome) {
  const i = process.argv.indexOf(nome);
  return i === -1 ? undefined : process.argv[i + 1];
}

const saida = argumento('--saida');
if (!saida) {
  console.error('[ig] uso: renovar-cli.mjs --saida <arquivo>');
  process.exit(1);
}

try {
  const { token, diasDeValidade } = await renovarToken({ token: process.env.IG_ACCESS_TOKEN });
  console.log(`::add-mask::${token}`);
  fs.writeFileSync(saida, token, { mode: 0o600 });
  console.log(`[ig] token renovado, vale mais ${diasDeValidade} dias`);
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}
