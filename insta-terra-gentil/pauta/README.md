# pauta: gerador de pauta

**Fase 1** (só os 19 ebooks) e **fase 5** (livros de referência).

Lê o material por espécie e gera pautas para a fila `dados/pautas.json`: série (5 cuidados,
3 erros, Socorro, Mito ou verdade, Você sabia?, X ou Y?, Pode ter com pet?, O que plantar no
mês, PANC, Antes e depois), espécie, gancho, pontos, palavra-chave e a fonte de cada fato.

Regras: fato só com fonte (livro e página); toxicidade só com ASPCA ou Sinitox; texto do post
escrito do zero, nunca copiado. Os PDFs de livros ficam fora do git (pasta privada).

## Fonte de pauta: notícias de jardinagem

`noticias.mjs` transforma uma notícia (link, título, série, espécie, gancho) em rascunho de pauta.
A notícia é só o ponto de partida: entram o tema e o link, nunca a tradução nem o resumo do texto.
Os `pontos` ficam vazios até serem escritos do zero. Link só vale se o domínio estiver em
`dados/fontes-noticias.json` (lista inicial do PDF Terra Gentil News Pipeline, o André aprova).
Saída: `{ origem: "noticia", serie, especie, gancho, pontos: [], palavra: null, fontes, status }`.
Buscar as notícias na rede (scraper) ainda não existe.

## Roteiro: uma rotina agendada do Claude escreve o post

Não há chamada de API. Uma rotina do Claude (claude.ai/code/routines, mesmo desenho do site do
Pearl Jam) roda de madrugada, lê um ebook e escreve o roteiro de véspera. O prompt dela mora aqui:
`routine-prompt.md` (editar o arquivo já vale, a rotina só tem um prompt curto mandando segui-lo) e
`prompts/voz-terra-gentil.md` (voz do André e regras). Um teste impede os dois de divergirem do código.

Fluxo: `rotina-cli proximo` (livro do rodízio e dia) -> `ler <PALAVRA>` (livro com marcador de
página) -> a rotina escreve `/tmp/bruto.json` (formato de `dados/bruto-exemplo.json`) ->
`gravar` confere e grava em `dados/posts/<dia>-<palavra>.json` -> branch `claude/insta-routine-*`.

| Arquivo | O que faz |
|---|---|
| `livros.mjs` | PDF vira texto por página (`dados/livros/`); confere se um trecho existe na página |
| `fatos.mjs` | Cada fato leva página e trecho literal do livro; toxicidade e pet são recusados |
| `esquema.mjs` | Formato do bruto: um objeto por slide; fechamento da marca fixo |
| `roteiro.mjs` | `montarPost` e `conferirPost` (travessão, tamanhos, série, fechamento, fontes) |
| `proxima.mjs` | Rodízio justo dos 19 livros; o dia padrão é amanhã (Brasília) |
| `gravar-post.mjs` | Grava um post por dia; `conferirTodos` refaz a checagem de tudo |
| `rotina-cli.mjs` | `proximo`, `ler`, `gravar`, `conferir`, `livros` |

Por que o trecho literal: o repositório é público e o post vai ao ar sozinho. O código confere que
cada fato existe mesmo na página citada, então fato inventado não passa. Ele não prova que uma frase
nova seja verdadeira: a previa do André continua sendo a última conferência.

Hoje também: `series.mjs`, `noticias.mjs`, `feed.mjs`, `coletar.mjs`, `filtrar.mjs` (notícias por RSS,
segunda fonte de pauta, ainda não ligada à rotina). Previsto: `fila.mjs`.

- `materia.mjs`: confere a matéria do site (campo `materia` do post): 3 a 5 seções com fatos, FAQ, mínimo de 600 palavras, sem travessão nem toxicidade. Post antigo, sem matéria, segue válido.
