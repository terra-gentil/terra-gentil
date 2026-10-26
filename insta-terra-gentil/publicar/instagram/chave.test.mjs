// Testa o botão: só "ligado" liga, qualquer outra coisa desliga.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publicacaoLigada } from './chave.mjs';

test('só "ligado" liga (ignora caixa e espaços)', () => {
  assert.equal(publicacaoLigada({ IG_PUBLICAR: 'ligado' }), true);
  assert.equal(publicacaoLigada({ IG_PUBLICAR: ' Ligado ' }), true);
});

test('ausente, vazio, "true", "1", "desligado" e lixo desligam', () => {
  for (const v of [undefined, '', 'true', '1', 'sim', 'desligado', 'ligado!']) {
    assert.equal(publicacaoLigada({ IG_PUBLICAR: v }), false, String(v));
  }
  assert.equal(publicacaoLigada({}), false);
});
