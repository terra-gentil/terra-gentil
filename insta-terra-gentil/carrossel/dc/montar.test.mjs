// Testes do conversor completo com um molde .dc.html de exemplo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { camposDoMolde, montarHtml } from './montar.mjs';

const props = {
  foto: { editor: 'text', default: '' },
  escurecimento: { editor: 'range', default: 40 },
  $preview: { width: 1080, height: 1350 },
};
const dataProps = JSON.stringify(props).replace(/&/g, '&amp;');
const molde = `<!doctype html><html><head><title>Teste &amp; molde</title></head><body>
<x-dc>
<helmet><style>body{margin:0}</style></helmet>
<div style="background: {{veu}}">
<sc-if value="{{temFoto}}" hint-placeholder-val="{{false}}"><img src="{{foto}}"></sc-if>
<sc-if value="{{semFoto}}" hint-placeholder-val="{{true}}"><i>sem foto</i></sc-if>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='${dataProps}'>
class Component extends DCLogic {
  renderVals() {
    const f = (this.props.foto ?? '').trim();
    const k = (this.props.escurecimento ?? 0) / 100;
    return { foto: f, temFoto: !!f, semFoto: !f, veu: 'rgba(0,0,0,' + k + ')' };
  }
}
</script></body></html>`;

test('sem foto: usa os padrões do molde e mostra o espaço marcado', () => {
  const html = montarHtml(molde);
  assert.match(html, /rgba\(0,0,0,0\.4\)/);
  assert.match(html, /<i>sem foto<\/i>/);
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /sc-if|\{\{|x-dc/);
});

test('com foto e escurecimento do dia: os dados vencem o padrão', () => {
  const html = montarHtml(molde, { foto: 'a b.jpg', escurecimento: 70 });
  assert.match(html, /<img src="a b\.jpg">/);
  assert.match(html, /rgba\(0,0,0,0\.7\)/);
  assert.doesNotMatch(html, /sem foto/);
});

test('a página sai completa: doctype, charset, título e estilo do molde', () => {
  const html = montarHtml(molde);
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<meta charset="utf-8"><title>Teste &amp; molde<\/title>/);
  assert.match(html, /<style>body\{margin:0\}<\/style>/);
});

test('lista os campos do molde, sem os do editor', () => {
  assert.deepEqual(camposDoMolde(molde), ['foto', 'escurecimento']);
});

test('molde fora do formato derruba a execução', () => {
  assert.throws(() => montarHtml('<html></html>'), /molde sem/);
  const semClasse = molde.replace('class Component extends DCLogic', 'class Outra extends DCLogic');
  assert.throws(() => montarHtml(semClasse), /class "Component"|Component/);
});
