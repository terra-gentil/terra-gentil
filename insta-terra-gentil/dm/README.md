# dm: palavra-chave e direct com o PDF

**Fase 2.** Quem comenta a palavra do post recebe no direct o link do ebook e o do Doutor das
Plantas, e o comentário ganha uma resposta pública.

| Arquivo | O que faz |
|---|---|
| `palavras.mjs` | `carregarPalavras`, `comentarioPede`, `buscarPorPalavra`, `linkDoPdf` |
| `../dados/palavras.json` | Uma palavra por ebook (proposta inicial, o André aprova) |

Próximos:

- `mensagens.mjs`: texto do direct e frases da resposta pública (variando).
- `registro.mjs`: quem já recebeu qual PDF (não manda duas vezes).
- Servidor do webhook: decidir se roda aqui (Node) ou no backend do Railway
  (terra-gentil-app, Python). Precisa do app novo da Meta com permissão de mensagens.

Regras da Meta: uma resposta privada por comentário, até 7 dias depois dele; o PDF vai como
link; nunca exigir que a pessoa siga a conta.
