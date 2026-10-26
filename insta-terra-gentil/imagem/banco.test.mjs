// Testes da interface única do banco de imagens.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buscarFoto } from './banco.mjs';

const foto = (url) => ({
  url,
  largura: 1600,
  altura: 2000,
  mime: 'image/jpeg',
  autor: 'Maria',
  licenca: 'CC BY 4.0',
  compartilhaIgual: false,
  fonte: 'iNaturalist',
});

test('usa o principal e nem consulta o reserva quando acha foto', async () => {
  let chamouReserva = false;
  const provedores = [
    { nome: 'principal', buscar: async () => [foto('https://u/a.jpg')] },
    {
      nome: 'reserva',
      buscar: async () => {
        chamouReserva = true;
        return [];
      },
    },
  ];
  const r = await buscarFoto('Monstera deliciosa', { provedores });
  assert.equal(r.provedor, 'principal');
  assert.equal(r.escolhida.foto.url, 'https://u/a.jpg');
  assert.equal(chamouReserva, false);
});

test('cai no reserva quando o principal falha, e registra a falha', async () => {
  const provedores = [
    {
      nome: 'principal',
      buscar: async () => {
        throw new Error('fora do ar');
      },
    },
    { nome: 'reserva', buscar: async () => [foto('https://u/b.jpg')] },
  ];
  const r = await buscarFoto('Monstera deliciosa', { provedores });
  assert.equal(r.provedor, 'reserva');
  assert.deepEqual(r.falhas, ['principal: fora do ar']);
  assert.equal(r.escolhida.credito, 'Foto: Maria / iNaturalist (CC BY 4.0)');
});

test('cai no reserva quando o principal só tem foto que não serve', async () => {
  const pequena = { ...foto('https://u/p.jpg'), largura: 500 };
  const provedores = [
    { nome: 'principal', buscar: async () => [pequena] },
    { nome: 'reserva', buscar: async () => [foto('https://u/b.jpg')] },
  ];
  const r = await buscarFoto('Ocimum basilicum', { provedores });
  assert.equal(r.provedor, 'reserva');
  assert.equal(r.candidatos, 2);
});

test('ninguém serve: devolve null sem quebrar', async () => {
  const r = await buscarFoto('X y', { provedores: [{ nome: 'a', buscar: async () => [] }] });
  assert.equal(r.escolhida, null);
  assert.equal(r.provedor, null);
});

test('exige o nome da espécie', async () => {
  await assert.rejects(() => buscarFoto(''), /falta o nome/);
});
