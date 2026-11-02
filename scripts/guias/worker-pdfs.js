// Worker "terra-gentil-pdfs" (Cloudflare, plano gratuito). Copia do codigo publicado no painel.
// Entrega os PDFs dos livros guardados no bucket R2 PRIVADO "terra-gentil-pdfs" (binding PDFS).
// Travas contra custo e abuso:
// - O bucket nao tem acesso publico: so este Worker le.
// - So GET e HEAD; so nomes no formato TGNNN.pdf (nada de listar, escrever ou apagar).
// - Plano gratuito de Workers: no maximo 100 mil requisicoes por dia; acima disso a Cloudflare
//   recusa em vez de cobrar. 100 mil/dia (~3 mi/mes) fica abaixo das 10 mi leituras gratis do R2.
// - Cache no navegador por 1 dia reduz pedidos repetidos.
const NOME = /^TG\d{3}\.pdf$/;

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Metodo nao permitido', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const nome = new URL(request.url).pathname.slice(1);
    if (!NOME.test(nome)) return new Response('Nao encontrado', { status: 404 });

    const obj = request.method === 'HEAD' ? await env.PDFS.head(nome) : await env.PDFS.get(nome);
    if (!obj) return new Response('Nao encontrado', { status: 404 });

    const h = new Headers();
    h.set('Content-Type', 'application/pdf');
    h.set('Content-Length', String(obj.size));
    h.set('Content-Disposition', `attachment; filename="${nome}"`);
    h.set('Cache-Control', 'public, max-age=86400');
    h.set('ETag', obj.httpEtag);
    h.set('X-Content-Type-Options', 'nosniff');
    return new Response(request.method === 'HEAD' ? null : obj.body, { headers: h });
  },
};
