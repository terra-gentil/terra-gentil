// Testes do merge da rotina com git e gh simulados.
import test from 'node:test';
import assert from 'node:assert/strict';
import { PREFIXO_RAMO } from './validar.mjs';
import { mesclarRamos, resumoDosResultados } from './mesclar.mjs';

const bom = `${PREFIXO_RAMO}20261026-0400`;
const info = (extra = {}) => ({
  commits: [{ sha: 'abc1234', login: 'claude' }],
  arquivos: ['insta-terra-gentil/dados/posts/2026-10-27-jiboia.json'],
  ...extra,
});

function io(infos, falhaAoAplicar = []) {
  const aplicados = [];
  return {
    aplicados,
    obterInfo: async (ramo) => infos[ramo],
    aplicar: async (ramo) => {
      if (falhaAoAplicar.includes(ramo)) throw new Error('conferir falhou');
      aplicados.push(ramo);
    },
  };
}

test('mescla o ramo válido e não aplica nada quando a validação recusa', async () => {
  const ruim = `${PREFIXO_RAMO}20261026-0500`;
  const fake = io({
    [bom]: info(),
    [ruim]: info({ commits: [{ sha: 'fff0000', login: 'estranho' }] }),
  });
  const r = await mesclarRamos([bom, ruim], fake);
  assert.deepEqual(fake.aplicados, [bom]);
  assert.equal(r[0].ok, true);
  assert.equal(r[1].ok, false);
  assert.match(r[1].motivo, /estranho/);
});

test('ramo que falha ao aplicar vira recusado e não derruba os outros', async () => {
  const outro = `${PREFIXO_RAMO}20261027-0400`;
  const fake = io({ [bom]: info(), [outro]: info() }, [bom]);
  const r = await mesclarRamos([bom, outro], fake);
  assert.deepEqual(
    r.map((x) => x.ok),
    [false, true],
  );
  assert.match(r[0].motivo, /conferir falhou/);
  assert.deepEqual(fake.aplicados, [outro]);
});

test('o resumo diz o que foi mesclado e o que foi recusado', () => {
  assert.equal(resumoDosResultados([]), 'nenhuma branch da rotina para mesclar');
  const texto = resumoDosResultados([
    { ramo: 'a', ok: true },
    { ramo: 'b', ok: false, motivo: 'x' },
  ]);
  assert.equal(texto, 'mesclada: a\nRECUSADA: b (x)');
});
