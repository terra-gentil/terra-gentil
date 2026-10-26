// Testes do prompt e da validação dos fatos (as regras de conteúdo do post).
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { SISTEMA, pedidoDe, validarFatos } from './prompt.mjs';

const pauta = () => lerJson(path.join(DADOS, 'pauta-exemplo.json'));
const fato = (texto, fonte = 'ebook, p. 1') => ({ texto, fonte });

test('validarFatos exige 3 fatos com fonte', () => {
  assert.throws(() => validarFatos([fato('a'), fato('b')]), /pelo menos 3/);
  const semFonte = [fato('a'), fato('b'), fato('c', '')];
  assert.throws(() => validarFatos(semFonte), /sem texto ou sem fonte/);
  assert.equal(validarFatos(pauta().fatos).length, 8);
});

test('toxicidade e pet só com fonte ASPCA ou Sinitox', () => {
  const pet = fato('A jiboia é tóxica para gatos.');
  assert.throws(() => validarFatos([fato('a'), fato('b'), pet]), /ASPCA\/Sinitox/);
  const comFonte = fato('A jiboia é tóxica para gatos.', 'ASPCA');
  assert.equal(validarFatos([fato('a'), fato('b'), comFonte]).length, 3);
});

test('o pedido leva série, planta, ebook e os fatos numerados', () => {
  const p = pauta();
  const ebook = { titulo: 'Jiboia: A Planta que Perdoa Tudo', palavra: 'JIBOIA' };
  const pedido = pedidoDe(p, p.fatos, ebook);
  assert.match(pedido, /Série: 3 erros/);
  assert.match(pedido, /Planta: jiboia \(Epipremnum aureum\)/);
  assert.match(pedido, /palavra JIBOIA/);
  assert.match(pedido, /\[7\] A jiboia aguenta o tranco/);
});

test('o prompt do sistema não tem travessão e traz o limite de cada campo', () => {
  assert.equal(/[—–]/.test(SISTEMA), false);
  assert.match(SISTEMA, /destaque até 16/);
  assert.match(SISTEMA, /SOMENTE os fatos numerados/);
});
