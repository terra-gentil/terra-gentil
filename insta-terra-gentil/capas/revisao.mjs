// Revisão do banco: capa só vale se foi aprovada e o arquivo não mudou desde a revisão.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { lerJson } from '../lib/json.mjs';

export const STATUS = Object.freeze(['aprovada', 'reprovada', 'duvida', 'pendente']);
const SOBRE = 'Veredito de cada capa do banco. Só "aprovada" com o mesmo sha256 é usada.';
const arquivoDe = (pastaBanco) => path.join(pastaBanco, 'revisao.json');

export function hashDoArquivo(caminho) {
  return crypto.createHash('sha256').update(fs.readFileSync(caminho)).digest('hex');
}

export function lerRevisao(pastaBanco) {
  const arquivo = arquivoDe(pastaBanco);
  return fs.existsSync(arquivo) ? lerJson(arquivo).capas : {};
}

export function gravarRevisao(pastaBanco, capas) {
  const ordem = ([a], [b]) => a.localeCompare(b);
  const ordenado = Object.fromEntries(Object.entries(capas).sort(ordem));
  const json = JSON.stringify({ _sobre: SOBRE, capas: ordenado }, null, 2);
  fs.writeFileSync(arquivoDe(pastaBanco), `${json}\n`);
}

// Registra o veredito de uma capa junto com o hash do arquivo revisado.
export function marcar(capas, id, status, hash, extra = {}) {
  if (!STATUS.includes(status)) throw new Error(`[revisao] status inválido: ${status}`);
  return { ...capas, [id]: { status, sha256: hash, ...extra } };
}

// true só se aprovada e com exatamente o mesmo conteúdo da revisão.
export function vale(capas, id, hash) {
  const r = capas[id];
  return r?.status === 'aprovada' && r.sha256 === hash;
}

// Problemas do banco frente à revisão (lista vazia = banco limpo). arquivos = [{ id, caminho }].
export function problemasDoBanco(arquivos, capas, hashDe = hashDoArquivo) {
  const problemas = [];
  for (const { id, caminho } of arquivos) {
    const r = capas[id];
    if (!r) problemas.push(`${id}: sem revisão`);
    else if (r.sha256 !== hashDe(caminho)) problemas.push(`${id}: mudou depois da revisão`);
    else if (r.status === 'reprovada') problemas.push(`${id}: reprovada, tirar do banco`);
  }
  return problemas;
}
