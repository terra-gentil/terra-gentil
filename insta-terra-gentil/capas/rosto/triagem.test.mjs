// Testes da triagem de rosto: o que chega ao André e o que é barrado antes.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { naRaiz } from '../../lib/config.mjs';
import { LIMITE_ROSTO } from '../rosto.mjs';
import { triarPorNota } from './triagem.mjs';

// Notas reais de 29/10/2026: as 4 que o André reprovou por rosto ficaram entre 0,07 e 0,22.
const NOTAS_REAIS = {
  'lirio-da-paz-B-1.jpg': { nota: 0.074, rostos: 1 },
  'pimenta-E-1.jpg': { nota: 0.12, rostos: 1 },
  'jiboia-B-1.jpg': { nota: 0.166, rostos: 2 },
  'samambaia-D-1.jpg': { nota: 0.22, rostos: 1 },
  'maranta-E-1.jpg': { nota: 0.452, rostos: 1 },
  'jiboia-C-1.jpg': { nota: 0.734, rostos: 1 },
};

test('barra as capas de rosto diferente que o André já reprovou à mão', () => {
  const { seguem, barradas } = triarPorNota(NOTAS_REAIS);
  assert.deepEqual(barradas.map((b) => b.arquivo).sort(), [
    'jiboia-B-1.jpg', 'lirio-da-paz-B-1.jpg', 'pimenta-E-1.jpg', 'samambaia-D-1.jpg',
  ]);
  assert.deepEqual(seguem, ['jiboia-C-1.jpg', 'maranta-E-1.jpg']);
});

test('sem rosto detectado também é barrada, com o motivo certo', () => {
  const { seguem, barradas } = triarPorNota({ 'a.jpg': { nota: null, rostos: 0 } });
  assert.deepEqual(seguem, []);
  assert.deepEqual(barradas, [{ arquivo: 'a.jpg', motivo: 'sem rosto' }]);
});

test('nota exatamente no limiar passa; um centésimo abaixo é barrada', () => {
  const { seguem, barradas } = triarPorNota({
    'no-limiar.jpg': { nota: LIMITE_ROSTO, rostos: 1 },
    'abaixo.jpg': { nota: LIMITE_ROSTO - 0.01, rostos: 1 },
  });
  assert.deepEqual(seguem, ['no-limiar.jpg']);
  assert.equal(barradas[0].arquivo, 'abaixo.jpg');
});

test('triagem usa o mesmo limiar do portão do banco, sem número solto no Python', () => {
  assert.equal(LIMITE_ROSTO, 0.363);
  const py = fs.readFileSync(naRaiz('capas', 'rosto', 'notas_pasta.py'), 'utf8');
  assert.equal(/0\.3\d\d/.test(py), false, 'o limiar fica só em rosto.mjs');
});

// A nota do banco é por id; capa reprovada com o mesmo id da nova sobrescreve a nota (29/10/2026).
test('nenhuma reprovada antiga repete o id de uma capa do banco', () => {
  const ids = (pasta) => fs.readdirSync(pasta, { recursive: true })
    .filter((f) => String(f).endsWith('.jpg'))
    .map((f) => String(f).split(/[\/]/).pop().replace('.jpg', ''));
  const banco = new Set(ids(naRaiz('capas', 'banco')));
  const repetidas = ids(naRaiz('capas', 'reprovadas')).filter((id) => banco.has(id));
  assert.deepEqual(repetidas, []);
});
