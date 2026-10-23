// Leitura estrita de JSON de estado: arquivo faltando ou corrompido derruba a execução.
import fs from 'node:fs';

// Nunca devolve vazio em caso de erro: estado perdido em silêncio é pior que parar.
export function lerJson(caminho) {
  let texto;
  try {
    texto = fs.readFileSync(caminho, 'utf8');
  } catch (erro) {
    throw new Error(`[json] não consegui ler ${caminho}: ${erro.message}`);
  }
  try {
    return JSON.parse(texto);
  } catch (erro) {
    throw new Error(`[json] ${caminho} está corrompido: ${erro.message}`);
  }
}
