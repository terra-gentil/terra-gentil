// Botão de publicar: só "ligado" liga. Vazio, ausente ou qualquer outro valor desliga.
// Vive na variável IG_PUBLICAR do repositório (Settings > Variables), nunca no código.
export function publicacaoLigada(env = process.env) {
  return String(env.IG_PUBLICAR ?? '').trim().toLowerCase() === 'ligado';
}
