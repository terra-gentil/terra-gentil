// Testes dos moldes reais: contrato de campos, conversão e ligação com a rotação.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TIPOS, problemasDoContrato } from './contrato.mjs';
import { camposDoMolde } from './dc/montar.mjs';
import { MOLDES } from './rotacao.mjs';
import { lerMolde, listarMoldes, montarSlide } from './moldes.mjs';

const PIXEL = 'data:image/png;base64,iVBORw0KGgo=';

test('a rotação e a pasta moldes/ têm exatamente os mesmos moldes', () => {
  assert.deepEqual([...MOLDES].sort(), listarMoldes());
});

test('todo molde tem os 4 tipos de slide e segue o contrato de campos', () => {
  for (const molde of listarMoldes()) {
    for (const tipo of TIPOS) {
      const problemas = problemasDoContrato(tipo, camposDoMolde(lerMolde(molde, tipo)));
      assert.deepEqual(problemas, [], `${molde}/${tipo}`);
    }
  }
});

test('todo slide converte com o padrão e com foto, textos e mascote do dia', () => {
  const imagens = { foto: PIXEL, fotoAndre: PIXEL, mascote: PIXEL };
  const dia = { ...imagens, mostrarMascote: true, tarja: 'Teste' };
  for (const molde of listarMoldes()) {
    for (const tipo of TIPOS) {
      for (const dados of [{}, dia]) {
        const html = montarSlide(molde, tipo, dados);
        assert.doesNotMatch(html, /sc-if|sc-for|\{\{|x-dc/, `${molde}/${tipo}`);
      }
    }
  }
});

test('o texto do dia entra no slide e a foto troca o espaço marcado', () => {
  const html = montarSlide('manchete', 'capa', { linha1: 'Regar sem afogar', foto: PIXEL });
  assert.match(html, /Regar sem afogar/);
  assert.ok(html.includes(`src="${PIXEL}"`));
  assert.doesNotMatch(html, /Foto: /);
});

test('molde ou tipo que não existe derruba a execução', () => {
  assert.throws(() => lerMolde('inexistente', 'capa'), /não achei/);
  assert.throws(() => lerMolde('manchete', 'bonus'), /tipo de slide desconhecido/);
});

test('o contrato reprova campo faltando e campo de fora', () => {
  const final = problemasDoContrato('final', ['foto']);
  assert.ok(final.includes('falta o campo "ctaSite"'));
  const capa = problemasDoContrato('capa', ['inventado']);
  assert.equal(capa.at(-1), 'campo "inventado" fora do contrato');
});
