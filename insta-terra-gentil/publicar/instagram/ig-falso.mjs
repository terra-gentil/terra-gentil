// Instagram falso dos testes: um fetch que imita a Graph API e as imagens hospedadas.
const resposta = (corpo, status = 200, tipo = 'application/json') =>
  new Response(JSON.stringify(corpo), { status, headers: { 'content-type': tipo } });

export function criarIgFalso(opcoes = {}) {
  const { statusDoContainer = 'FINISHED', publishQuebra = false, jpeg = true } = opcoes;
  const { siteNoAr = true } = opcoes;
  const chamadas = [];
  const midias = [];
  let n = 0;
  const http = async (url, opcoes = {}) => {
    const u = new URL(url);
    if (u.hostname === 'site.test') return new Response('', { status: siteNoAr ? 200 : 404 });
    if (u.hostname === 'raw.test') return resposta({}, 200, jpeg ? 'image/jpeg' : 'image/png');
    const origem = opcoes.body ?? u.searchParams;
    const corpo = Object.fromEntries(origem);
    const { pathname: caminho } = u;
    chamadas.push({ metodo: opcoes.method, caminho, corpo });
    if (caminho.endsWith('/me')) return resposta({ user_id: '1', username: 'canalterragentil' });
    if (caminho.endsWith('/content_publishing_limit')) {
      return resposta({ data: [{ quota_usage: 1, config: { quota_total: 100 } }] });
    }
    if (caminho.endsWith('/media_publish')) {
      if (publishQuebra) return resposta({ error: { message: 'erro falso', code: 2 } }, 500);
      return resposta({ id: 'post-1' });
    }
    if (caminho.endsWith('/media') && opcoes.method === 'POST') {
      // O post "sai" ao criar o carrossel; o publish que quebra ainda assim deixa ele na conta.
      if (corpo.caption && publishQuebra) {
        midias.push({ id: 'post-1', caption: corpo.caption, timestamp: new Date().toISOString() });
      }
      return resposta({ id: `c${++n}` });
    }
    if (caminho.endsWith('/media')) return resposta({ data: midias });
    return resposta({ status_code: statusDoContainer });
  };
  return { http, chamadas };
}
