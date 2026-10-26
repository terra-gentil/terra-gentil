// Testes das condições <sc-if> e do preenchimento de campos do conversor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aplicarCondicoes, escapar, preencher } from './gabarito.mjs';

const abre = (nome) => `<sc-if value="{{${nome}}}" hint-placeholder-val="{{true}}">`;
const sc = (nome, dentro) => `${abre(nome)}${dentro}</sc-if>`;

test('mantém o bloco verdadeiro e remove o falso', () => {
  const html = `a${sc('sim', 'B')}c${sc('nao', 'D')}e`;
  assert.equal(aplicarCondicoes(html, { sim: true, nao: false }), 'aBce');
});

test('blocos aninhados: filho só aparece se o pai aparecer', () => {
  const html = sc('pai', `x${sc('filho', 'Y')}z`);
  assert.equal(aplicarCondicoes(html, { pai: true, filho: true }), 'xYz');
  assert.equal(aplicarCondicoes(html, { pai: true, filho: false }), 'xz');
  assert.equal(aplicarCondicoes(html, { pai: false, filho: true }), '');
});

test('condição desconhecida e bloco mal fechado derrubam a execução', () => {
  assert.throws(() => aplicarCondicoes(sc('x', 'a'), {}), /condição desconhecida: x/);
  const semFim = aplicarCondicoes.bind(null, `${abre('a')}sem fim`, { a: true });
  assert.throws(semFim, /sem fechamento/);
  assert.throws(() => aplicarCondicoes('sobrou</sc-if>', {}), /sem abertura/);
});

test('preenche campos com ponto de segurança: escapa HTML e aspas', () => {
  const saida = preencher('<p>{{t}}</p>', { t: '<b>"oi" & tchau</b>' });
  assert.equal(saida, '<p>&lt;b&gt;&quot;oi&quot; &amp; tchau&lt;/b&gt;</p>');
  assert.equal(escapar(0), '0');
});

test('campo desconhecido derruba a execução em vez de sair vazio', () => {
  assert.throws(() => preencher('{{falta}}', { outro: 1 }), /campo desconhecido: falta/);
});
