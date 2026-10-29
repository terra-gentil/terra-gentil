# Capas que faltam para os carrosséis das bíblias (29/10/2026)

Resumo: o estoque das bíblias (dados/biblia.json, 1.502 fatos) rende cerca de 290 carrosséis.
Cruzado com o banco (170 capas aprovadas), faltam cerca de 66 capas. As 2 travas que deixavam 56
capas aprovadas sem uso foram consertadas em 29/10. Novas entradas já estão em dados/capas.json: gerar
a fila com `node capas/fila-cli.mjs <slug>` e rodar na ferramenta "Capas TG" do Flow.

## Travas no código: CONSERTADAS em 29/10
1. Espécie pelo gênero (capas/catalogo.mjs): chave de uma palavra (Phalaenopsis, Echeveria,
   Begonia, Guzmania, Rosa) ou lista "generos" na entrada (cacto, morango, bromélias, orquídeas
   novas, lírio, haworthia). Só quando é seguro: "Solanum tuberosum" não pega o tomate e gênero
   em duas entradas (Dracaena) não escolhe. Provado no banco real: orquídea, suculenta, cacto,
   begônia, bromélia, roseira e morango voltaram a sair (26 capas).
2. Campo `tema` no post (regar, praga, mato, solo, pet...): a capa do coringa vem antes da planta;
   sem capa do tema, cai na planta. As 30 capas de coringa voltaram a sair.
3. Rodízio por capa: posts de espécies do mesmo gênero e do mesmo tema somam juntos.

## O que gerar, por prioridade (carrosséis do estoque > capas)
| # | Slug | Tema no estoque | Carrosséis | Tem | Gerar |
|---|---|---|---|---|---|
| 1 | coringa-mato | mato, capim, tiririca, terreno (é o serviço do canal) | 14 | 0 | 5 |
| 2 | orquidea | Phalaenopsis e orquídea em geral | 52 | 4 | 4 |
| 3 | suculenta | Echeveria e suculenta em geral | 38 | 2 | 6 |
| 4 | coringa-praga | pulgão, fungo, mosca, cochonilha, ácaro, lesma | 19 | 3 | 2 |
| 5 | coringa-solo | solo, cobertura de folha seca (Primavesi) | 10 | 0 | 4 |
| 6 | coringa-pet | planta tóxica e pet (154 fatos com fonte) | 12 | 0 | 4 |
| 7 | catleia | Cattleya | 4 | 0 | 3 |
| 8 | kalanchoe | kalanchoe (também pet) | 3 | 0 | 3 |
| 9 | agave | agave | 3 | 0 | 3 |
| 10 | jade | planta-jade (também pet) | 2 | 0 | 3 |
| 11 | lirio | lírio, que mata gato | 3 | 0 | 3 |
| 12 | coringa-luz | luz, sol e sombra | 10 | 0 | 3 |
| 13 | coringa-muda | semente e muda | 5 | 0 | 3 |
| 14 | rosa-do-deserto | Adenium | 22 | 4 | 2 |
| 15 | jiboia | jiboia (já tem ebook e posts) | contínuo | 1 | 2 |
| 16 | dendrobium | Dendrobium | 2 | 0 | 3 |
| 17 | vanda, chuva-de-ouro, sapatinho | outras orquídeas | 1 a 2 cada | 0 | 2 cada |
| 18 | colar-de-perolas, haworthia | suculentas pequenas | 1 a 2 cada | 0 | 2 cada |
| 19 | coringa-horta, coringa-regar, coringa-gramado | já existem | 11, 9, 5 | 2 cada | 1 cada |

Conta: 1 capa para cada 4 carrosséis do tema, mínimo 3 por planta nova. Com 84% de aprovação
(lote de 27/10: 69 de 82), pedir cerca de 80 no Flow.

## Observações
- coringa-mato: dá para usar quadro real dos vídeos do canal no lugar de IA (o André roçando de
  verdade). É o tema que mais liga o insta ao YouTube.
- coringa-praga: a capa mostra o André olhando a folha, sem bicho na imagem (EVITAR proíbe
  praga e folha comida, e IA desenha praga errado).
- coringa-pet: cão e gato entram na cena; "other people" continua proibido.
