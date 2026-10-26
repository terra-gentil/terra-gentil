// Publica o carrossel do dia no Instagram. Com o botão IG_PUBLICAR desligado, confere tudo
// (pacote, imagens no ar) e para antes de qualquer chamada que poste.
import fs from 'node:fs';
import path from 'node:path';
import { ESTRUTURA } from '../../carrossel/estrutura.mjs';
import { lerJson } from '../../lib/json.mjs';
import { conferirCota, publicarCarrossel } from './carrossel.mjs';
import { publicacaoLigada } from './chave.mjs';
import { criarApi } from './graph.mjs';
import { gravarRegistro, lerRegistro } from './registro.mjs';

// Pasta do dia: 01.jpg a 08.jpg, legenda.txt e ficha.json (feitos pela prévia do workflow).
export function lerPacote(pasta) {
  const nomes = ESTRUTURA.map((_, i) => `${String(i + 1).padStart(2, '0')}.jpg`);
  const faltam = nomes.filter((n) => !fs.existsSync(path.join(pasta, n)));
  if (faltam.length) throw new Error(`[ig] faltam imagens em ${pasta}: ${faltam.join(', ')}`);
  const legenda = fs.readFileSync(path.join(pasta, 'legenda.txt'), 'utf8').trim();
  const ficha = lerJson(path.join(pasta, 'ficha.json'));
  if (ficha.avisos?.length) throw new Error('[ig] a ficha tem avisos de texto fora do slide');
  return { nomes, legenda, ficha };
}

export async function conferirUrls(urls, http = fetch) {
  const ruins = [];
  for (const url of urls) {
    const r = await http(url, { method: 'HEAD' }).catch(() => null);
    const tipo = r?.headers.get('content-type') ?? '';
    if (!r?.ok || !tipo.startsWith('image/jpeg')) ruins.push(url);
  }
  if (ruins.length) throw new Error(`[ig] imagem fora do ar ou não é JPEG: ${ruins.join(', ')}`);
}

export async function publicarDia(opcoes) {
  const { dia, pasta, baseUrl, env, soToken, http = fetch, espera, base } = opcoes;
  if (lerRegistro(dia, base)) return { acao: 'ja-publicado' };
  const { nomes, legenda } = lerPacote(pasta);
  const urls = nomes.map((n) => `${baseUrl}/${dia}/${n}`);
  await conferirUrls(urls, http);
  if (!publicacaoLigada(env)) return { acao: 'desligado', urls, legenda };
  if (!env.IG_USER_ID || !env.IG_ACCESS_TOKEN) {
    throw new Error('[ig] faltam os secrets IG_USER_ID e IG_ACCESS_TOKEN');
  }
  const api = criarApi({
    igUserId: env.IG_USER_ID, token: env.IG_ACCESS_TOKEN, base: env.IG_API_BASE, http,
  });
  const { username } = await api.perfil();
  if (soToken) return { acao: 'token-ok', conta: username };
  await conferirCota(api);
  const r = await publicarCarrossel(api, { urls, legenda, espera });
  gravarRegistro(dia, { postId: r.id, conta: username, recuperado: r.recuperado }, base);
  return { acao: r.recuperado ? 'recuperado' : 'publicado', postId: r.id, conta: username };
}
