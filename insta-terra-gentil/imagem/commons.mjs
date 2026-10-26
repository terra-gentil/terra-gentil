// Wikimedia Commons: busca fotos pelo nome da espécie e devolve candidatos com licença e autor.
const API = 'https://commons.wikimedia.org/w/api.php';
const AGENTE = 'TerraGentilPauta/0.1 (https://terragentil.com.br)';
const LARGURA_BAIXADA = 1600;
const ENTIDADES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };

// O campo Artist vem em HTML (link para a página do usuário): fica só o texto.
export function textoPuro(html) {
  if (!html) return null;
  const texto = html
    .replace(/<span[^>]*display:\s*none[^>]*>[\s\S]*?<\/span>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&(?:amp|lt|gt|quot|apos);/g, (e) => ENTIDADES[e])
    .replace(/\s+/g, ' ')
    .trim();
  return texto && !/^unknown author$/i.test(texto) ? texto : null;
}

export function candidatosDe(resposta) {
  const paginas = resposta?.query?.pages ?? [];
  return paginas
    .filter((p) => p.imageinfo?.[0])
    .map((p) => {
      const info = p.imageinfo[0];
      const meta = info.extmetadata ?? {};
      const licenca = meta.LicenseShortName?.value ?? null;
      return {
        provedor: 'commons',
        fonte: 'Wikimedia Commons',
        titulo: p.title.replace(/^File:/, ''),
        url: info.width > LARGURA_BAIXADA && info.thumburl ? info.thumburl : info.url,
        largura: info.width,
        altura: info.height,
        mime: info.mime,
        autor: textoPuro(meta.Artist?.value),
        licenca,
        compartilhaIgual: /\bSA\b|GFDL/i.test(licenca ?? ''),
        paginaUrl: info.descriptionurl,
      };
    });
}

export async function buscarCommons(termo, buscar = fetch, limiteMs = 20000) {
  const parametros = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${termo}`,
    gsrnamespace: '6',
    gsrlimit: '50',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: String(LARGURA_BAIXADA),
    iiextmetadatafilter: 'LicenseShortName|Artist',
    format: 'json',
    formatversion: '2',
  });
  const resposta = await buscar(`${API}?${parametros}`, {
    headers: { 'user-agent': AGENTE },
    signal: AbortSignal.timeout(limiteMs),
  });
  if (!resposta.ok) throw new Error(`[commons] HTTP ${resposta.status}`);
  return candidatosDe(await resposta.json());
}
