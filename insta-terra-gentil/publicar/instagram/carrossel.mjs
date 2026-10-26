// Publica um carrossel: um container por slide, um do carrossel, espera ficar pronto, publica.
// Se o media_publish der erro mas o post saiu mesmo assim, recupera em vez de duplicar.
const SEM_PAUSA = (ms) => new Promise((ok) => setTimeout(ok, ms));
const MARGEM_COTA = 2;
const VINTE_MIN = 20 * 60 * 1000;

// Quanto da cota de 24h já foi usada. Estourou, não adianta tentar.
export async function conferirCota(api) {
  const { data = [] } = await api.cota();
  const { quota_usage: usada = 0, config } = data[0] ?? {};
  const total = config?.quota_total ?? 100;
  if (usada >= total - MARGEM_COTA) {
    throw new Error(`[ig] cota de 24h quase cheia: ${usada}/${total}`);
  }
  return { usada, total };
}

async function aguardarPronto(api, id, { tentativas, intervaloMs, pausa }) {
  for (let i = 0; i < tentativas; i++) {
    const estado = await api.status(id);
    if (estado === 'FINISHED') return;
    if (estado === 'ERROR' || estado === 'EXPIRED') {
      throw new Error(`[ig] container ${id}: ${estado}`);
    }
    await pausa(intervaloMs);
  }
  throw new Error(`[ig] container ${id} não ficou pronto a tempo`);
}

const normalizar = (texto) => String(texto ?? '').replace(/\s+/g, ' ').trim();

// Procura nas mídias recentes um post com o começo da legenda e menos de 20 min.
async function postRecente(api, legenda, agora) {
  const alvo = normalizar(legenda).slice(0, 80);
  const recentes = await api.recentes(5);
  return recentes.find(
    (m) => normalizar(m.caption).startsWith(alvo) && agora - Date.parse(m.timestamp) < VINTE_MIN,
  );
}

export async function publicarCarrossel(api, { urls, legenda, espera = {}, agora = Date.now() }) {
  const pausa = espera.pausa ?? SEM_PAUSA;
  const { tentativas = 20, intervaloMs = 3000 } = espera;
  const opcoes = { tentativas, intervaloMs, pausa };
  const ids = [];
  for (const url of urls) {
    const id = await api.criarItem(url);
    await aguardarPronto(api, id, opcoes);
    ids.push(id);
  }
  const carrossel = await api.criarCarrossel(ids, legenda);
  await aguardarPronto(api, carrossel, opcoes);
  try {
    return { id: await api.publicar(carrossel), recuperado: false };
  } catch (erro) {
    const achado = await postRecente(api, legenda, agora).catch(() => null);
    if (achado) return { id: achado.id, recuperado: true, permalink: achado.permalink };
    throw erro;
  }
}
