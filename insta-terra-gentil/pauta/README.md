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

Hoje: `series.mjs` (nomes das séries), `noticias.mjs`. Previstos: `extrair.mjs` (fatos por
espécie), `fila.mjs` (grava a pauta em `dados/pautas.json`).
