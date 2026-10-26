// Escolhe o livro e o dia do próximo post: rodízio justo, sem repetir livro antes de passar todos.
import { diaBrasilia, diasDesdeEpoca } from '../carrossel/rotacao.mjs';

// O livro que nunca virou post (na ordem do palavras.json); senão o de post mais antigo.
export function proximoLivro(palavras, posts) {
  const ultimo = new Map();
  for (const { palavra, dia } of posts) {
    if (!ultimo.has(palavra) || dia > ultimo.get(palavra)) ultimo.set(palavra, dia);
  }
  const nunca = palavras.find((livro) => !ultimo.has(livro.palavra));
  if (nunca) return nunca;
  return [...palavras].sort((a, b) =>
    ultimo.get(a.palavra).localeCompare(ultimo.get(b.palavra)),
  )[0];
}

// O post é escrito de véspera: o dia padrão é amanhã, no fuso de Brasília.
export function diaDoPost(agora = new Date()) {
  const amanha = (diasDesdeEpoca(diaBrasilia(agora)) + 1) * 86_400_000;
  return new Date(amanha).toISOString().slice(0, 10);
}
