# capas: o André com a planta na capa do carrossel

**O que faz.** Dá identidade ao carrossel: o slide 1 mostra o André (boné e camiseta Terra Gentil)
com a planta do dia, em foto realista feita no Google Flow (Nano Banana Pro). Os slides 2 a 8
seguem com a foto real da planta (`imagem/`). Espécie sem capa no banco: tudo como antes.

**Entrada.** `dados/capas.json` (espécies, slug, descrição em inglês, ambiente do cenário C) e as
fotos reais do André em `capas/referencias/` (fora do git, repo público).

**Saída.** `capas/banco/<slug>/<slug>-<A|B|C>-<n>.jpg` em 1080x1350, commitado.

**Cenários.** A = segurando o vaso; B = agachado cuidando, três quartos; C = no ambiente da planta.
Todo prompt leva o mesmo bloco de foto realista (`ESTILO`), o quadro 4:5 com o terço de cima livre
para o título (`QUADRO`) e a lista do que evitar.

**Qual capa.** `catalogo.mjs`: se o post tem `tema` (praga, mato, solo...), a capa do coringa do
tema; senão a da espécie, exata ou pelo gênero quando é seguro (chave de uma palavra ou lista
`generos`). **Rodízio.** A n-ésima vez que a capa aparece em `dados/posts` usa a foto n do banco.
Sem estado novo: a conta vem dos posts já commitados. Falta capa: ver `PEDIDO-BIBLIAS.md`.

**Meta do banco.** 16 espécies hoje, 3 capas cada (48). Depois: 15 principais com 5 capas e mais
20 espécies com 3, mais 10 coringas, cerca de 145 imagens.

| Arquivo | Faz |
|---|---|
| `prompts.mjs` | Monta o prompt de cada capa e a fila (puro) |
| `catalogo.mjs` | Acha a entrada do post: tema, espécie exata ou gênero |
| `banco.mjs` | Lista as capas, conta posts anteriores, escolhe a da vez |
| `fila-cli.mjs` | Gera `saida/fila-capas.json` para a ferramenta do Flow |
| `importar-cli.mjs` | Leva os downloads do Flow para o banco em 1080x1350 |
| `FERRAMENTA-FLOW.md` | Pedido da ferramenta "Capas TG" no Flow e o passo a passo |

**Fase.** 1 (carrossel). Ligado em `carrossel/cli.mjs` (`obterCapa`).
