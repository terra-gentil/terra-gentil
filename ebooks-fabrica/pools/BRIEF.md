# Brief dos agentes: livros TG 087 a 100 (02/11/2026, leva 8)

Voce escreve 2 livros curtos da Colecao Terra Gentil (ebooks gratis de jardinagem do Andre Zimermann).
Tudo em PT-BR, tom caloroso e simples, NUNCA travessao (nem em-dash nem en-dash; use virgula ou ponto).

## Onde fica tudo
- Fabrica: `C:\Users\engan\Documents\Terra Gentil\ebooks\fabrica` (rode os comandos daqui).
- MODELO OBRIGATORIO: `curtos/tg086.mjs` (leia inteiro antes). Veja tambem `curtos/tg066.mjs` e `tg068.mjs`.
  19 paginas, na ordem fixa dos moldes de `gerar.mjs` (Main, Carta, Rapido, Sumario, Ficha, Abertura1,
  Tabela, Abertura, Passos, Texto, Erro, Abertura3, Precisar, Alerta, Galeria, Sinais, Sabia, Checklist, Fechamento).
  Mesma quantidade e ordem de textos (`t`) por pagina que o modelo, so muda o conteudo.
- Seus fatos: `pools/pool-<seus livros>.txt`. Use SO fatos desse arquivo (ids no campo `f` das paginas).
  Os "EXCLUSIVOS DO TG N" sao do tema de cada livro; os COMPARTILHADOS podem ir em qualquer dos seus dois.
  Nunca use fato de fora do seu pool (outros agentes estao usando os outros). Mire 25 a 35 fatos unicos por livro.
- Todo texto do livro tem que dizer so o que os fatos citados dizem. Nao invente numero, especie ou dica.
- Fotos provisorias do miolo e da capa: arquivos de `C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil\capas\banco`
  (confira que o nome existe; use coringa-* quando nao tiver a especie).


## Os 14 livros da leva 8 (titulo, PALAVRA da capa, prefixo das fotos)
| TG | Titulo | PALAVRA | Prefixo |
|---|---|---|---|
| 087 | Tomate Cereja | CEREJA | tcj |
| 088 | Batata e Inhame | BATATA | bat |
| 089 | Beterraba e Acelga | BETERRABA | bet |
| 090 | Ervilha e Feijão | ERVILHA | erv |
| 091 | Pepino e Berinjela | PEPINO | pep |
| 092 | Flores Cheirosas | JASMIM | jas |
| 093 | Flores de Semente | COSMOS | fsm |
| 094 | Alporquia e Estaca | ALPORQUIA | alp |
| 095 | Comedouro e Ninho | NINHO | nin |
| 096 | Roseira no Jardim | ROSEIRA | rjd |
| 097 | Substrato e Vaso | SUBSTRATO | sub |
| 098 | Rosa-do-deserto em Flor | FLORADA | rdf |
| 099 | Orquídea no Dia a Dia | ROTINA | odd |
| 100 | Jardim Gentil | GENTIL | gen |
O TG 100 promete o TG 101 PLANTAS CARNÍVORAS (palavra CARNÍVORA). Na ultima pagina: "São N livros na coleção, todos de graça." com N = numero do proprio livro (TG 087 = 87; TG 100 = 100).
MODELO: use os da leva 7 (`curtos/tg086.mjs`, `tg085.mjs`, `tg084.mjs`) alem do `tg070.mjs`.
TITULO HONESTO (licao da leva 7, regra principal): o titulo nao pode prometer o que os fatos nao dizem (a leva 7 teve "Plantas de Banheiro" sem nenhum fato de banheiro). Se os fatos nao sustentarem o titulo, ajuste o titulo mantendo a PALAVRA e AVISE na resposta. Nao invente nome popular que o fato nao diz (ex.: se o fato diz "cereus", nao escreva "mandacaru").
Notas por livro:
- 087 Tomate Cereja: so 3 fatos falam de cereja; ancore a capa, a carta e a abertura neles e use o resto dos fatos de tomate como cuidado geral. TG 013 Tomate no Vaso ja existe.
- 088: tuberculos e bulbos de comer (batata, batata-doce, inhame, taioba, cebola, alho, gengibre). Se o livro ficar muito alem de batata e inhame, ajuste o titulo e avise.
- 089: folhas e raizes de horta (beterraba, acelga, espinafre, aipo, aspargo). TG 068 Alface e Folhas e TG 065 Cenoura e Raizes ja existem.
- 091: poucos exclusivos (25); complete com os de horta dos compartilhados. TG 063 Abobora e Abobrinha ja existe.
- 092: flores de perfume (jasmins, gardenia, tuberosa, hoia). TG 081 Rosas Perfumadas ja existe: sem rosa.
- 093: flores anuais de semente (cosmos, zinia, cravo, boca-de-leao, celosia, petunia...). TG 025 Horta de Semente e TG 045 Guardar Semente ja existem.
- 094: alporquia e muda por estaca. TG 007 Mudas de Graça e TG 021 Enxerto e Muda ja existem: foque na alporquia.
- 095: atrair passarinho e bicho amigo (comedouro, ninho, agua). TG 026 Abelha e Passarinho ja existe.
- 096: roseira plantada no chao do jardim (canteiro, trepadeira, cerca). TG 029 a 032 e 081 ja existem (vaso, doenca, poda, muda, perfume).
- 097: substrato, drenagem, pH, troca de vaso, adubo. TG 003 Terra Viva, TG 057 Adubo Caseiro e TG 018 Vaso de Orquidea ja existem.
- 098: florada da rosa-do-deserto (flor, raiz, cuidado para florir). TG 011 Rosa-do-deserto ja existe.
- 099: cuidado de rotina da orquidea (rega, luz, adubo, Phalaenopsis). TG 001, 015 a 018 e 080 ja existem.
- 100 Jardim Gentil: livro de celebracao do 100o. Folhagens faceis de casa e dicas gerais; a carta pode lembrar que sao 100 livros, todos de graca, e "gentileza gera gentileza". Nada de numero inventado.

## Licoes das levas 6 e 7 (evite)
- Fatos contraditorios entre si (ex.: germinacao em tempos diferentes): escolha um e nao cite o outro.
- Pagina 17 (Sabia): palavra grande com ate 5 letras (ANOS, DIAS, MIL, CM, KM). Palavra longa estoura a largura.
- Mire 25 a 35 fatos unicos por livro, nao 40.
- Se a PALAVRA da capa (p1) estourar a largura no `estouro.mjs`, avise na resposta (nao troque a palavra).

## Regras de layout
- Carta (p2): linhas curtas, ate uns 50 caracteres, senao estoura.
- Palavra grande da capa (p1, 2o texto) = PALAVRA do livro. Pagina 17 (Sabia): numero grande + unidade curta,
  fiel ao fato (se o fato diz "mais de mil", nao escreva 1.000 seco: escolha outro fato).
- Ultima pagina: como no modelo, com os 5 numeros seguintes, "Sao N livros na colecao, todos de graca.",
  "PROXIMO: TG <n+1> <TITULO EM CAIXA ALTA>" e "Comente <PALAVRA do proximo> no @canalterragentil e ele chega no seu direct, de graca."
- Cada livro: `serie` com cor hex escura diferente das que voce ve nos ultimos curtos.

## Fotos novas (8 por livro, para o Google Flow)
Ids com o prefixo do livro: `<pre>-gesto-1..3` (maos do Andre fazendo o passo da p9), `<pre>-sintoma-1`
(o problema da p11), `<pre>-var-<nome>` x4 (as 4 plantas/itens da p15). Use esses ids nas paginas, como no modelo,
e liste todos no campo `provisorias` apontando para uma foto do banco.
Escreva a fila `C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil\gama-ebooks\fila-fotos-tg<NNN>.json`
no MESMO formato de `fila-fotos-tg070.json` (leia ele): estilo igual, cena em ingles, gesto e sintoma 9:16, var 3:4,
`elenco: true` so nos gesto. Gesto comeca com "Close-up of a man's hands ...".
EXATAMENTE 2 fotos com `mascote: true`, com "the small mascot figurine" e o LUGAR dito na cena
(ex.: "sits on the rim of the pot", "stands on the garden path next to it"), lugar diferente nas duas.

## Como fechar cada livro
1. Escreva `curtos/tg<NNN>.mjs`.
2. `node fazer.mjs curtos/tg<NNN>.mjs` ate dar "nenhuma pagina estourada" (se estourar, encurte o texto da pagina citada).
3. `node validar.mjs` e confira que o seu `tg<NNN>.json` deu ok.
4. Escreva a fila de fotos.
NAO faca git (commit/add/push). NAO mexa em arquivos de outros livros.

## Resposta final (curta)
Por livro: titulo, palavra, n de fatos unicos, estouro ok, validar ok, fila escrita, e qualquer duvida para o Andre decidir.
