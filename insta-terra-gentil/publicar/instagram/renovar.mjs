// Renova o token de longa duração do Instagram (mais 60 dias). O token novo nunca entra em erro.
import { ErroInstagram } from './graph.mjs';

const BASE_RENOVAR = 'https://graph.instagram.com';

export async function renovarToken({ token, base = BASE_RENOVAR, http = fetch }) {
  if (!token) throw new Error('[ig] falta IG_ACCESS_TOKEN para renovar');
  const url = new URL(`${base}/refresh_access_token`);
  url.search = new URLSearchParams({
    grant_type: 'ig_refresh_token', access_token: token,
  }).toString();
  const resposta = await http(url, { method: 'GET', signal: AbortSignal.timeout(30000) });
  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok || json.error || !json.access_token) {
    const e = json.error ?? {};
    throw new ErroInstagram({
      caminho: '/refresh_access_token', status: resposta.status, codigo: e.code,
      subcodigo: e.error_subcode, mensagem: e.message, trace: e.fbtrace_id,
    });
  }
  return { token: json.access_token, diasDeValidade: Math.floor(json.expires_in / 86400) };
}
