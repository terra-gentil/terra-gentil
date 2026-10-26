// Ideia: o Claude escreve o roteiro de 8 slides, o gancho e o resumo a partir dos fatos da pauta.
import { ESTRUTURA, problemasDoRoteiro } from '../carrossel/estrutura.mjs';
import { FINAL_FIXO, chaveDoSlide, esquemaDoRoteiro } from './esquema.mjs';
import { SISTEMA, pedidoDe, validarFatos } from './prompt.mjs';

export const MODELO = 'claude-opus-5-5';
// Recusa de segurança do classificador: a API refaz o pedido num modelo substituto sozinha.
const BETA_FALLBACK = 'server-side-fallback-2026-07-01';

function textoDa(resposta) {
  if (resposta.stop_reason === 'refusal') {
    const categoria = resposta.stop_details?.category ?? 'sem categoria';
    throw new Error(`[ideia] o modelo recusou o pedido (${categoria})`);
  }
  if (resposta.stop_reason === 'max_tokens')
    throw new Error('[ideia] resposta cortada (max_tokens)');
  const bloco = resposta.content.find((b) => b.type === 'text');
  if (!bloco) throw new Error('[ideia] a resposta veio sem texto');
  return bloco.text;
}

// A resposta é um objeto por slide; vira a lista na ordem da estrutura, com o fechamento fixo.
export function roteiroDe(resposta, pauta, fatos, ebook) {
  let dados;
  try {
    dados = JSON.parse(textoDa(resposta));
  } catch (erro) {
    if (erro instanceof SyntaxError) throw new Error(`[ideia] JSON inválido: ${erro.message}`);
    throw erro;
  }
  const slides = ESTRUTURA.map((tipo, i) => {
    const slide = dados[chaveDoSlide(i)] ?? {};
    return tipo === 'final' ? { ...slide, ...FINAL_FIXO } : slide;
  });
  const problemas = problemasDoRoteiro(slides);
  const usados = dados.fatosUsados ?? [];
  if (!usados.length || usados.some((n) => !Number.isInteger(n) || !fatos[n])) {
    problemas.push('"fatosUsados" vazio ou com número que não existe nos fatos');
  }
  if (!dados.gancho?.trim()) problemas.push('falta o gancho');
  if (problemas.length) throw new Error(`[ideia] roteiro inválido:\n- ${problemas.join('\n- ')}`);
  const fontes = [...new Set(usados.map((n) => fatos[n].fonte))];
  const { especie, nome = null, serie = null } = pauta;
  const palavra = pauta.palavra ?? ebook?.palavra ?? null;
  const { gancho, resumo } = dados;
  return { especie, nome, serie, gancho, resumo, palavra, slides, fatosUsados: usados, fontes };
}

// cliente = new Anthropic() (injetável para teste). Sem credencial, a chamada falha com
// Anthropic.AuthenticationError ou erro de autenticação: quem chama decide desligar a parte.
export async function gerarRoteiro(pauta, { cliente, modelo = MODELO, ebook } = {}) {
  const fatos = validarFatos(pauta.fatos);
  const resposta = await cliente.beta.messages.create({
    model: modelo,
    max_tokens: 16000,
    betas: [BETA_FALLBACK],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: { type: 'json_schema', schema: esquemaDoRoteiro() } },
    system: SISTEMA,
    messages: [{ role: 'user', content: pedidoDe(pauta, fatos, ebook) }],
  });
  return roteiroDe(resposta, pauta, fatos, ebook);
}
