// Testes dos blocos <sc-if> e <sc-for> e do preenchimento de campos do conversor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buscar, escapar, preencher } from './campos.mjs';
import { renderizarCorpo } from './gabarito.mjs';

const abre = (nome) => `<sc-if value="{{${nome}}}" hint-placeholder-val="{{true}}">`;
const sc = (nome, dentro) => `${abre(nome)}${dentro}</sc-if>`;
const laco = (lista, dentro) =>
  `<sc-for list="{{${lista}}}" as="it" hint-placeholder-count="3">${dentro}</sc-for>`;

test('mantém o bloco verdadeiro e remove o falso', () => {
  const html = `a${sc('sim', 'B')}c${sc('nao', 'D')}e`;
  assert.equal(renderizarCorpo(html, { sim: true, nao: false }), 'aBce');
});

test('blocos aninhados: filho só aparece se o pai aparecer', () => {
  const html = sc('pai', `x${sc('filho', 'Y')}z`);
  assert.equal(renderizarCorpo(html, { pai: true, filho: true }), 'xYz');
  assert.equal(renderizarCorpo(html, { pai: true, filho: false }), 'xz');
  assert.equal(renderizarCorpo(html, { pai: false, filho: true }), '');
});

test('repete o bloco para cada item e entende caminho com ponto e $index', () => {
  const html = laco('itens', '<b w="{{it.w}}">{{$index}}</b>');
  const itens = [{ w: '10px' }, { w: '34px' }];
  assert.equal(renderizarCorpo(html, { itens }), '<b w="10px">0</b><b w="34px">1</b>');
  assert.equal(renderizarCorpo(html, { itens: [] }), '');
});

test('laço com condição dentro vê o item e o resto do escopo', () => {
  const html = laco('xs', sc('ligado', '{{it}}'));
  assert.equal(renderizarCorpo(html, { xs: ['a', 'b'], ligado: true }), 'ab');
  assert.equal(renderizarCorpo(html, { xs: ['a', 'b'], ligado: false }), '');
});

test('condição desconhecida, bloco mal fechado e lista inválida derrubam a execução', () => {
  assert.throws(() => renderizarCorpo(sc('x', 'a'), {}), /campo desconhecido: x/);
  const semFim = renderizarCorpo.bind(null, `${abre('a')}sem fim`, { a: true });
  assert.throws(semFim, /sem fechamento/);
  assert.throws(() => renderizarCorpo('sobrou</sc-if>', {}), /fora de lugar/);
  assert.throws(() => renderizarCorpo(laco('l', 'x'), { l: 'texto' }), /não é uma lista/);
});

test('preenche campos com segurança: escapa HTML e aspas', () => {
  const saida = preencher('<p>{{t}}</p>', { t: '<b>"oi" & tchau</b>' });
  assert.equal(saida, '<p>&lt;b&gt;&quot;oi&quot; &amp; tchau&lt;/b&gt;</p>');
  assert.equal(escapar(0), '0');
});

test('campo ou degrau desconhecido derruba a execução em vez de sair vazio', () => {
  assert.throws(() => preencher('{{falta}}', { outro: 1 }), /campo desconhecido: falta/);
  assert.throws(() => buscar({ a: { b: 1 } }, 'a.c'), /campo desconhecido: a\.c/);
  assert.equal(buscar({ a: { b: 0 } }, 'a.b'), 0);
});
