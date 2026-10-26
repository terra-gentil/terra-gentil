// Testes do ideia.mjs com um cliente da API simulado (sem rede, sem custo).
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { ESTRUTURA } from '../carrossel/estrutura.mjs';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { chaveDoSlide, esquemaDoRoteiro } from './esquema.mjs';
import { MODELO, gerarRoteiro } from './ideia.mjs';
import { SISTEMA } from './prompt.mjs';

const pauta = () => lerJson(path.join(DADOS, 'pauta-exemplo.json'));
const post = () => lerJson(path.join(DADOS, 'post-exemplo.json'));

// O que o modelo devolve: um objeto por slide, e no fechamento só o texto.
function respostaDoModelo(extra = {}) {
  const p = post();
  const dados = { gancho: p.gancho, resumo: p.resumo, fatosUsados: [0, 1, 4] };
  p.slides.forEach((slide, i) => {
    dados[chaveDoSlide(i)] = ESTRUTURA[i] === 'final' ? { texto: slide.texto } : { ...slide };
  });
  return {
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: JSON.stringify({ ...dados, ...extra }) }],
  };
}

function clienteQueResponde(resposta) {
  const chamadas = [];
  const cliente = {
    beta: { messages: { create: async (pedido) => (chamadas.push(pedido), resposta) } },
  };
  return { cliente, chamadas };
}

test('o esquema tem gancho, resumo, fatosUsados e um objeto por slide, sem campo solto', () => {
  const e = esquemaDoRoteiro();
  assert.equal(e.additionalProperties, false);
  assert.equal(e.required.length, 3 + ESTRUTURA.length);
  assert.deepEqual(Object.keys(e.properties.slide8_final.properties), ['texto']);
  assert.ok(e.properties.slide1_capa.properties.linha3);
  assert.ok(!e.properties.slide5_passo.properties.tarja);
  assert.ok(JSON.stringify(e).indexOf('maxLength') === -1);
});

test('monta o post: slides na ordem, fechamento fixo, fontes só dos fatos usados', async () => {
  const { cliente } = clienteQueResponde(respostaDoModelo());
  const r = await gerarRoteiro(pauta(), { cliente });
  assert.equal(r.slides.length, 8);
  assert.equal(r.slides[0].linha1, 'O erro que mais');
  assert.deepEqual(
    [r.slides[7].linha1, r.slides[7].destaque, r.slides[7].linha2, r.slides[7].tarja],
    ['Gentileza', 'gera', 'gentileza', 'Para levar'],
  );
  assert.deepEqual(r.fontes, [
    'Jiboia: A Planta que Perdoa Tudo, p. 12',
    'Jiboia: A Planta que Perdoa Tudo, p. 9',
  ]);
  assert.equal(r.palavra, 'JIBOIA');
  assert.equal(r.especie, 'Epipremnum aureum');
});

test('chama a API: Opus 5.5, schema, fallback, sem parâmetros removidos', async () => {
  const { cliente, chamadas } = clienteQueResponde(respostaDoModelo());
  await gerarRoteiro(pauta(), { cliente });
  const [c] = chamadas;
  assert.equal(c.model, MODELO);
  assert.equal(MODELO, 'claude-opus-5-5');
  assert.equal(c.output_config.format.type, 'json_schema');
  assert.equal(c.output_config.effort, 'high');
  assert.equal(c.fallbacks, 'default');
  assert.deepEqual(c.betas, ['server-side-fallback-2026-07-01']);
  assert.deepEqual(c.thinking, { type: 'adaptive' });
  for (const removido of ['temperature', 'top_p', 'top_k', 'tool_choice']) {
    assert.equal(removido in c, false, removido);
  }
  assert.equal(c.system, SISTEMA);
  assert.match(c.messages[0].content, /\[0\] Regar todo dia/);
  assert.match(c.messages[0].content, /fonte: Jiboia: A Planta que Perdoa Tudo, p\. 12/);
});

test('recusa de segurança, resposta cortada e JSON quebrado viram erro claro', async () => {
  const recusa = { stop_reason: 'refusal', stop_details: { category: 'cyber' }, content: [] };
  await assert.rejects(
    gerarRoteiro(pauta(), { cliente: clienteQueResponde(recusa).cliente }),
    /recusou o pedido \(cyber\)/,
  );
  const cortada = { stop_reason: 'max_tokens', content: [{ type: 'text', text: '{' }] };
  await assert.rejects(
    gerarRoteiro(pauta(), { cliente: clienteQueResponde(cortada).cliente }),
    /max_tokens/,
  );
  const quebrada = { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"gancho":' }] };
  await assert.rejects(
    gerarRoteiro(pauta(), { cliente: clienteQueResponde(quebrada).cliente }),
    /JSON inválido/,
  );
});

test('barra travessão, campo grande demais e fato inexistente', async () => {
  const ruim = respostaDoModelo({
    slide2_problema: { ...post().slides[1], nota: 'Calma — não é culpa sua.' },
    slide3_problema: { ...post().slides[2], linha1: 'Uma linha de título longa demais' },
    fatosUsados: [0, 99],
  });
  await assert.rejects(
    gerarRoteiro(pauta(), { cliente: clienteQueResponde(ruim).cliente }),
    (e) => {
      assert.match(e.message, /travessão em "nota"/);
      assert.match(e.message, /"linha1" com 32 caracteres/);
      assert.match(e.message, /fatosUsados/);
      return true;
    },
  );
});
