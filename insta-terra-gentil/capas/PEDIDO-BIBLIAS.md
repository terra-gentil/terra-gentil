# Capas que faltam para os carrosséis das bíblias (29/10/2026)

Resumo: o estoque das bíblias (dados/biblia.json, 1.502 fatos) rende cerca de 290 carrosséis.
Cruzado com o banco (170 capas aprovadas, 46 entradas), faltam cerca de 66 capas e há 2 travas no
código que deixam 56 capas aprovadas sem uso. Novas entradas já estão em dados/capas.json: gerar
a fila com `node capas/fila-cli.mjs <slug>` e rodar na ferramenta "Capas TG" do Flow.

## Travas no código (capaDoDia procura só catalogo[post.especie])
1. Chave que não é "Gênero espécie" nunca casa, porque o post exige o nome científico completo:
   Phalaenopsis, Echeveria, Cactaceae, Begonia, Guzmania, Rosa e "Fragaria × ananassa" (o ×
   falha na regra). São orquídea, suculenta, cacto, begônia, bromélia, roseira e morango: 26 capas
   aprovadas paradas, e orquídea e suculenta são os 2 maiores temas do estoque.
   Conserto proposto: procurar também pelo gênero (1a palavra) e por uma lista de gêneros da
   família no cacto.
2. Coringa nunca é escolhido: o post sempre tem uma espécie. As 30 capas de coringa (praga,
   regar, adubar...) estão paradas. Conserto proposto: campo `tema` no post (praga, mato, solo,
   pet, luz, muda, regar, adubar, podar, trocar-vaso, compostagem, horta, gramado) e a capa sai
   do coringa do tema quando houver.

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
- Antes de gerar orquídea e suculenta, consertar a trava 1, senão as capas novas também ficam
  paradas.
