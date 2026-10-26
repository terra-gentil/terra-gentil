// Linha de comando da curadoria. Lista: curar-cli.mjs "Gênero espécie". Grava: ... --url <url>.
import path from 'node:path';
import { DADOS } from '../lib/config.mjs';
import { candidatasPara, descrever, registrarCurada } from './curar.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--url');
const url = i === -1 ? null : args[i + 1];
const especie = args.find((a, n) => !a.startsWith('--') && args[n - 1] !== '--url');
if (!especie) {
  console.error('uso: node imagem/curar-cli.mjs "Epipremnum aureum" [--url <url da foto>]');
  process.exit(1);
}

const { candidatas, falhas } = await candidatasPara(especie);
falhas.forEach((f) => console.warn(`AVISO ${f}`));
if (!candidatas.length) {
  console.error(`nenhuma foto segura para ${especie}`);
  process.exit(1);
}

if (!url) {
  console.log(`${candidatas.length} candidatas para ${especie}, da melhor para a pior:\n`);
  candidatas.forEach((foto, n) => console.log(`${descrever(foto, n)}\n`));
  console.log('Para fixar uma: repita o comando com --url <url da foto escolhida>');
} else {
  const escolhida = candidatas.find((foto) => foto.url === url);
  if (!escolhida) {
    console.error('essa url não está entre as candidatas seguras; rode de novo sem --url');
    process.exit(1);
  }
  const { credito } = registrarCurada(path.join(DADOS, 'fotos.json'), especie, escolhida);
  console.log(`curada: ${especie}\n${credito}`);
}
