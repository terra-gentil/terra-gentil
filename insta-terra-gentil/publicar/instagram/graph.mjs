// Cliente mínimo da Graph API do Instagram (Instagram Login, graph.instagram.com).
// O token só viaja no corpo ou na query da chamada; nunca entra em mensagem de erro.
export const BASE_PADRAO = 'https://graph.instagram.com/v21.0';

export class ErroInstagram extends Error {
  constructor({ caminho, status, codigo, subcodigo, mensagem, trace }) {
    const meta = [codigo && `code=${codigo}`, subcodigo && `sub=${subcodigo}`];
    if (trace) meta.push(`fbtrace=${trace}`);
    super(`IG ${caminho}: ${mensagem ?? `HTTP ${status}`} [${meta.filter(Boolean).join(' ')}]`);
    Object.assign(this, { name: 'ErroInstagram', caminho, status, codigo, subcodigo });
  }
}

export function criarApi({ igUserId, token, base = BASE_PADRAO, http = fetch }) {
  async function chamar(metodo, caminho, params = {}) {
    const url = new URL(`${base}${caminho}`);
    const dados = new URLSearchParams({ ...params, access_token: token });
    const opcoes = { method: metodo, signal: AbortSignal.timeout(30000) };
    if (metodo === 'GET') url.search = dados.toString();
    else opcoes.body = dados;
    const resposta = await http(url, opcoes);
    const json = await resposta.json().catch(() => ({}));
    if (!resposta.ok || json.error) {
      const e = json.error ?? {};
      throw new ErroInstagram({
        caminho, status: resposta.status, codigo: e.code, subcodigo: e.error_subcode,
        mensagem: e.message, trace: e.fbtrace_id,
      });
    }
    return json;
  }
  const get = (caminho, params) => chamar('GET', caminho, params);
  const post = (caminho, params) => chamar('POST', caminho, params);
  const media = `/${igUserId}/media`;
  return {
    perfil: () => get('/me', { fields: 'user_id,username' }),
    cota: () => get(`/${igUserId}/content_publishing_limit`, { fields: 'quota_usage,config' }),
    criarItem: async (urlImagem) => {
      const item = { media_type: 'IMAGE', image_url: urlImagem, is_carousel_item: 'true' };
      return (await post(media, item)).id;
    },
    criarCarrossel: async (ids, legenda) => {
      const corpo = { media_type: 'CAROUSEL', children: ids.join(','), caption: legenda };
      return (await post(media, corpo)).id;
    },
    status: async (id) => (await get(`/${id}`, { fields: 'status_code' })).status_code,
    publicar: async (id) => (await post(`/${igUserId}/media_publish`, { creation_id: id })).id,
    recentes: async (limite = 5) => {
      const campos = { fields: 'id,caption,timestamp,permalink', limit: String(limite) };
      return (await get(media, campos)).data ?? [];
    },
  };
}
