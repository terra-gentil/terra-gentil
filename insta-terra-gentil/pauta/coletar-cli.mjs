// CLI da pauta de notícias. Sem argumento: coleta os feeds e atualiza dados/pauta-noticias.json.
// "usar <url>": tira o item da pauta e lembra o link (chamado quando um post nasce dele).
import fs from 'node:fs';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { carregarFontes } from './noticias.mjs';
import { coletar } from './coletar.mjs';
import {
  atualizarPauta,
  marcarUsado,
  estadoVazio,
  conteudoDaPauta,
} from './pauta-noticias.mjs';

const ARQUIVO = path.join(DADOS, 'pauta-noticias.json');
const lerEstado = () => (fs.existsSync(ARQUIVO) ? lerJson(ARQUIVO) : estadoVazio());
const gravar = (estado) =>
  fs.writeFileSync(ARQUIVO, `${JSON.stringify(estado, null, 2)}\n`, 'utf8');

function gravarSeMudou(antes, depois) {
  if (conteudoDaPauta(antes) === conteudoDaPauta(depois)) return false;
  gravar(depois);
  return true;
}

async function rodarColeta() {
  const fontes = carregarFontes();
  const antes = lerEstado();
  const coleta = await coletar(fontes);
  const comFeed = fontes.filter((f) => f.feed).length;
  for (const f of coleta.falhas) console.error(`[pauta] falha em ${f.fonte}: ${f.motivo}`);
  if (comFeed > 0 && coleta.falhas.length === comFeed) {
    throw new Error('[pauta] todas as fontes falharam, pauta anterior mantida');
  }
  const depois = atualizarPauta(antes, coleta, fontes);
  const mudou = gravarSeMudou(antes, depois);
  const situacao = mudou ? 'arquivo atualizado' : 'sem mudança';
  const resumo = `${depois.itens.length} na pauta, ${coleta.itens.length} coletados`;
  console.log(`[pauta] ${resumo}, ${situacao}`);
}

function usar(url) {
  if (!url) throw new Error('[pauta] uso: coletar-cli.mjs usar <url>');
  const antes = lerEstado();
  gravarSeMudou(antes, marcarUsado(antes, url));
  console.log(`[pauta] link marcado como usado: ${url}`);
}

try {
  const [comando, url] = process.argv.slice(2);
  if (comando === 'usar') usar(url);
  else await rodarColeta();
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}
