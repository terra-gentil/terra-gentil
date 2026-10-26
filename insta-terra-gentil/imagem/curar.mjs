// Curadoria de foto: lista as melhores candidatas de uma espécie e grava a escolha em fotos.json.
import fs from 'node:fs';
import { PROVEDORES } from './banco.mjs';
import { nota, serve, creditoDe } from './escolher.mjs';

// Junta as candidatas seguras de todos os provedores, da melhor para a pior, sem repetir URL.
export async function candidatasPara(especie, { provedores = PROVEDORES, limite = 8 } = {}) {
  if (!especie) throw new Error('[curar] falta o nome científico da espécie');
  const vistas = new Set();
  const lista = [];
  const falhas = [];
  for (const { nome, buscar } of provedores) {
    try {
      for (const foto of await buscar(especie)) {
        if (vistas.has(foto.url) || !serve(foto)) continue;
        vistas.add(foto.url);
        lista.push({ ...foto, provedor: nome });
      }
    } catch (erro) {
      falhas.push(`${nome}: ${erro.message}`);
    }
  }
  lista.sort((a, b) => nota(b) - nota(a));
  return { candidatas: lista.slice(0, limite), falhas };
}

// O que vale guardar da foto: o bastante para baixar de novo e dar o crédito.
export function fotoCurada(foto) {
  const { url, titulo, licenca, autor, fonte, paginaUrl, largura, altura } = foto;
  const guardada = { url, titulo, licenca, autor, fonte, paginaUrl, largura, altura };
  return { foto: guardada, credito: creditoDe(foto), curadoEm: new Date().toISOString() };
}

// Grava (ou troca) a foto curada da espécie. Estado corrompido derruba, como no resto do projeto.
export function registrarCurada(caminho, especie, foto) {
  const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));
  dados.fotos = { ...dados.fotos, [especie]: fotoCurada(foto) };
  fs.writeFileSync(caminho, `${JSON.stringify(dados, null, 2)}\n`);
  return dados.fotos[especie];
}

export function descrever(foto, i) {
  const medida = `${foto.largura}x${foto.altura}`;
  const livre = foto.compartilhaIgual ? ' (compartilha igual)' : '';
  const dono = foto.autor ?? 'sem autor';
  return [
    `${i + 1}. [${foto.provedor}] ${medida} ${foto.licenca}${livre} | ${dono}`,
    `   ver: ${foto.paginaUrl ?? foto.url}`,
    `   url: ${foto.url}`,
  ].join('\n');
}
