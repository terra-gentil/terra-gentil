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

## Roteiro: o Claude escreve o post

`ideia.mjs` recebe uma pauta com `fatos` (texto + fonte, ex.: "Jiboia: A Planta que Perdoa Tudo,
p. 12") e devolve o post: gancho, resumo, 8 slides, `fatosUsados` e `fontes`. Exemplo de
entrada em `dados/pauta-exemplo.json`, de saída em `dados/post-exemplo.json`.

- `esquema.mjs`: JSON Schema da resposta (um objeto por slide). O fechamento da marca é fixo.
- `prompt.mjs`: a voz do André, as regras de fato e `validarFatos` (mínimo 3 fatos com fonte;
  toxicidade e pet só com ASPCA ou Sinitox).
- `ideia.mjs`: chama a API (SDK oficial, `claude-opus-5-5`, saída estruturada, fallback de recusa
  ligado) e valida o roteiro com `problemasDoRoteiro` (travessão, campo vazio, tamanho).
- `ideia-cli.mjs`: `node pauta/ideia-cli.mjs <pauta.json> [saida.json]`. Precisa de
  `ANTHROPIC_API_KEY` (ou `ant auth login`); sem credencial a parte fica desligada.

O texto sai do zero a partir dos fatos, nunca copiado. O André confere tudo na prévia antes de
publicar: o código barra o óbvio, mas não prova que uma frase é verdadeira.

Hoje: `series.mjs`, `noticias.mjs`, `feed.mjs`, `coletar.mjs`, `filtrar.mjs`, `esquema.mjs`,
`prompt.mjs`, `ideia.mjs`. Previstos: `extrair.mjs` (fatos por espécie), `fila.mjs` (grava a
pauta em `dados/pautas.json`).
