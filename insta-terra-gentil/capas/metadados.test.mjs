// Nenhuma capa do banco carrega o selo C2PA do Flow (o Instagram lê e etiqueta "Informações de IA").
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { naRaiz } from '../lib/config.mjs';

// Marcas achadas no jpg cru do Flow em 30/10/2026; o importar-cli regrava o arquivo sem elas.
const MARCAS = ['c2pa', 'jumb', 'trainedAlgorithmicMedia'];

test('capas do banco saem sem metadado de IA', () => {
  const pasta = naRaiz('capas', 'banco');
  const comSelo = fs.readdirSync(pasta, { recursive: true })
    .filter((f) => String(f).endsWith('.jpg'))
    .filter((f) => {
      const bytes = fs.readFileSync(path.join(pasta, String(f))).toString('latin1');
      return MARCAS.some((m) => bytes.includes(m));
    });
  assert.deepEqual(comSelo, []);
});
