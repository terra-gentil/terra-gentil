// Valida o ramo que a rotina empurrou antes do merge: quem commitou e quais arquivos o diff toca.
// O repositório é público: só a conta "claude" (e-mail verificado da Anthropic) e só dados de post.

export const PREFIXO_RAMO = 'claude/insta-routine-';
export const LOGINS_PERMITIDOS = Object.freeze(['claude', 'terra-gentil']);
export const PASTAS_PERMITIDAS = Object.freeze([
  'insta-terra-gentil/dados/posts/',
  'insta-terra-gentil/dados/rotina-log/',
]);
const MAX_ARQUIVOS = 10;

const recusa = (motivo) => ({ ok: false, motivo });

// commits = [{ sha, login }] (login do committer segundo a API do GitHub), arquivos = diff vs main.
export function validarRamo({ ramo, commits, arquivos }) {
  if (typeof ramo !== 'string' || !ramo.startsWith(PREFIXO_RAMO) || ramo.includes('..')) {
    return recusa(`ramo fora do padrão ${PREFIXO_RAMO}*`);
  }
  if (!commits?.length) return recusa('ramo sem commits novos');
  for (const { sha, login } of commits) {
    if (!LOGINS_PERMITIDOS.includes(login)) {
      return recusa(
        `commit ${String(sha).slice(0, 7)} de "${login ?? 'sem login'}" não é permitido`,
      );
    }
  }
  if (!arquivos?.length) return recusa('diff vazio');
  if (arquivos.length > MAX_ARQUIVOS)
    return recusa(`${arquivos.length} arquivos (máximo ${MAX_ARQUIVOS})`);
  const fora = arquivos.filter((arquivo) => {
    const limpo = !arquivo.includes('..') && !arquivo.includes('\\') && arquivo.endsWith('.json');
    return !limpo || !PASTAS_PERMITIDAS.some((pasta) => arquivo.startsWith(pasta));
  });
  if (fora.length) return recusa(`arquivo fora do permitido: ${fora.slice(0, 3).join(', ')}`);
  return { ok: true };
}
