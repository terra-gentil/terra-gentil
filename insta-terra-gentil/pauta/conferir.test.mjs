// Testes da conferência de posts já gravados: pega arquivo editado à mão depois da rotina.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { carregarPalavras } from '../dm/palavras.mjs';
import { conferirTodos, gravarPost } from './gravar-post.mjs';

const palavras = carregarPalavras();
const bruto = () => lerJson(path.join(DADOS, 'bruto-exemplo.json'));

function comPost(alterar) {
  const pastaPosts = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-conf-'));
  const { arquivo } = gravarPost(bruto(), { dia: '2026-10-27', palavras, pastaPosts });
  if (alterar) {
    const post = lerJson(arquivo);
    alterar(post);
    fs.writeFileSync(arquivo, JSON.stringify(post));
  }
  const resultado = conferirTodos({ palavras, pastaPosts });
  fs.rmSync(pastaPosts, { recursive: true });
  return resultado;
}

test('post gravado pela CLI confere', () => {
  assert.deepEqual(comPost(), [{ nome: '2026-10-27-jiboia.json', problemas: [] }]);
});

test('pasta de posts vazia ou ausente não é problema', () => {
  assert.deepEqual(
    conferirTodos({ palavras, pastaPosts: path.join(os.tmpdir(), 'nao-existe-tg') }),
    [],
  );
});

test('pega trecho editado, fechamento trocado, travessão e fonte forjada', () => {
  const [trecho] = comPost(
    (p) => (p.fatos[0].trecho = 'A jiboia precisa de adubo todo mês sem falta'),
  );
  assert.match(trecho.problemas.join(), /não existe na página 12/);
  const [final] = comPost((p) => (p.slides[7].linha1 = 'Outra coisa'));
  assert.match(final.problemas.join(), /fechamento: "linha1"/);
  const [trav] = comPost((p) => (p.gancho = 'Rega — o erro'));
  assert.match(trav.problemas.join(), /travessão em "gancho"/);
  const [fonte] = comPost((p) => (p.fontes = ['Livro inventado, p. 1']));
  assert.match(fonte.problemas.join(), /"fontes" não bate/);
});

test('pega palavra desconhecida e nome de arquivo que não bate com o dia', () => {
  const [desconhecida] = comPost((p) => (p.palavra = 'XYZ'));
  assert.match(desconhecida.problemas.join(), /palavra desconhecida/);
  const [dia] = comPost((p) => (p.dia = '2026-11-01'));
  assert.match(dia.problemas.join(), /nome do arquivo deveria ser 2026-11-01-jiboia\.json/);
});
