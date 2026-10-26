// Openverse (banco reserva): fotos de iNaturalist, Flickr e outros, sem chave, só licença livre.
const API = 'https://api.openverse.org/v1/images/';
const AGENTE = 'TerraGentilPauta/0.1 (https://terragentil.com.br)';
const NOMES = { inaturalist: 'iNaturalist', flickr: 'Flickr', wikimedia: 'Wikimedia Commons' };
const TIPOS = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

// Openverse separa licença e versão ("by" + "4.0"). Vira o texto que vai no crédito.
export function licencaDe(licenca, versao) {
  const sigla = String(licenca ?? '').toLowerCase();
  if (sigla === 'cc0') return 'CC0';
  if (sigla === 'pdm') return 'Public domain';
  if (!/^by(-sa)?$/.test(sigla)) return null;
  return `CC ${sigla.toUpperCase()}${versao ? ` ${versao}` : ''}`;
}

export function candidatosDeOpenverse(resposta) {
  return (resposta?.results ?? [])
    .map((r) => ({
      provedor: 'openverse',
      fonte: NOMES[r.source] ?? r.source ?? 'Openverse',
      titulo: r.title ?? '',
      url: r.url,
      largura: r.width,
      altura: r.height,
      mime: TIPOS[String(r.filetype ?? '').toLowerCase()] ?? null,
      autor: r.creator?.trim() || null,
      licenca: licencaDe(r.license, r.license_version),
      compartilhaIgual: /sa/i.test(r.license ?? ''),
      paginaUrl: r.foreign_landing_url,
    }))
    .filter((c) => c.url && c.licenca && Number.isFinite(c.largura) && Number.isFinite(c.altura));
}

// A API anônima oscila de 0,1 s a 45 s na mesma consulta; é reserva de rotina diária, então 60 s.
export async function buscarOpenverse(termo, buscar = fetch, limiteMs = 60000) {
  const parametros = new URLSearchParams({
    q: termo,
    license: 'cc0,by,pdm',
    aspect_ratio: 'tall',
    size: 'large',
    extension: 'jpg',
    category: 'photograph',
    page_size: '20', // acima de 20 o modo anônimo responde 401
  });
  const resposta = await buscar(`${API}?${parametros}`, {
    headers: { 'user-agent': AGENTE },
    signal: AbortSignal.timeout(limiteMs),
  });
  if (!resposta.ok) throw new Error(`[openverse] HTTP ${resposta.status}`);
  return candidatosDeOpenverse(await resposta.json());
}
