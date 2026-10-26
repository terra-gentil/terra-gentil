// Testes da validação do ramo da rotina (o que pode ser mesclado sozinho num repositório público).
import test from 'node:test';
import assert from 'node:assert/strict';
import { PREFIXO_RAMO, validarRamo } from './validar.mjs';

const bom = () => ({
  ramo: `${PREFIXO_RAMO}20261026-0400`,
  commits: [{ sha: 'abcdef1234', login: 'claude' }],
  arquivos: [
    'insta-terra-gentil/dados/posts/2026-10-27-jiboia.json',
    'insta-terra-gentil/dados/rotina-log/20261026-0400.json',
  ],
});

test('aceita o ramo normal da rotina: conta claude, post e log', () => {
  assert.deepEqual(validarRamo(bom()), { ok: true });
});

test('recusa ramo com outro nome ou tentando sair da pasta', () => {
  assert.equal(validarRamo({ ...bom(), ramo: 'claude/news-routine-1' }).ok, false);
  assert.equal(validarRamo({ ...bom(), ramo: 'main' }).ok, false);
  assert.equal(validarRamo({ ...bom(), ramo: `${PREFIXO_RAMO}../main` }).ok, false);
});

test('recusa commit de quem não está na lista, mesmo com um commit bom junto', () => {
  const commits = [...bom().commits, { sha: 'ffff000', login: 'alguem-de-fora' }];
  const r = validarRamo({ ...bom(), commits });
  assert.equal(r.ok, false);
  assert.match(r.motivo, /alguem-de-fora/);
  assert.equal(validarRamo({ ...bom(), commits: [{ sha: 'a', login: null }] }).ok, false);
  assert.equal(validarRamo({ ...bom(), commits: [] }).ok, false);
});

test('recusa arquivo fora de posts e rotina-log: código, dados de apoio e workflows', () => {
  for (const arquivo of [
    'insta-terra-gentil/pauta/ideia.mjs',
    'insta-terra-gentil/dados/palavras.json',
    'insta-terra-gentil/dados/livros/1-O-Codigo-Secreto-das-Plantas.txt',
    '.github/workflows/ci.yml',
    'insta-terra-gentil/dados/posts/../palavras.json',
    'insta-terra-gentil/dados/posts/nao-json.mjs',
  ]) {
    const r = validarRamo({ ...bom(), arquivos: [...bom().arquivos, arquivo] });
    assert.equal(r.ok, false, arquivo);
    assert.match(r.motivo, /fora do permitido/);
  }
});

test('recusa diff vazio e diff grande demais', () => {
  assert.equal(validarRamo({ ...bom(), arquivos: [] }).ok, false);
  const muitos = Array.from(
    { length: 11 },
    (_, i) => `insta-terra-gentil/dados/posts/2026-10-${i}.json`,
  );
  assert.match(validarRamo({ ...bom(), arquivos: muitos }).motivo, /11 arquivos/);
});
