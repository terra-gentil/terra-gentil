// Baixa a foto escolhida para o disco, junto com um .json de crédito. Nunca comita a foto.
import fs from 'node:fs';
import path from 'node:path';

const AGENTE = 'TerraGentilPauta/0.1 (https://terragentil.com.br)';
const TAMANHO_MAX = 15 * 1024 * 1024;

// "Monstera deliciosa" -> "monstera-deliciosa"
export function nomeDeArquivo(especie) {
  const nome = especie
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!nome) throw new Error(`[baixar] nome de espécie inválido: ${especie}`);
  return nome;
}

export async function baixarFoto({ foto, credito }, especie, pasta, buscar = fetch) {
  const resposta = await buscar(foto.url, {
    headers: { 'user-agent': AGENTE },
    signal: AbortSignal.timeout(60000),
  });
  if (!resposta.ok) throw new Error(`[baixar] HTTP ${resposta.status} em ${foto.url}`);
  const tipo = resposta.headers.get('content-type') ?? '';
  if (!tipo.startsWith('image/jpeg')) throw new Error(`[baixar] não é JPEG (${tipo})`);
  const bytes = Buffer.from(await resposta.arrayBuffer());
  if (bytes.length > TAMANHO_MAX) throw new Error(`[baixar] grande demais: ${bytes.length}`);
  const base = path.join(pasta, nomeDeArquivo(especie));
  fs.mkdirSync(pasta, { recursive: true });
  fs.writeFileSync(`${base}.jpg`, bytes);
  const { licenca, autor, url, paginaUrl: pagina } = foto;
  const ficha = { especie, credito, licenca, autor, url, pagina };
  fs.writeFileSync(`${base}.json`, `${JSON.stringify(ficha, null, 2)}\n`);
  return { caminho: `${base}.jpg`, credito };
}
