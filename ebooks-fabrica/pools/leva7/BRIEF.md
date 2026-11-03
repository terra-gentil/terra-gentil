# Brief dos agentes: livros TG 071 a 086 (02/11/2026, leva 7)

Voce escreve 2 livros curtos da Colecao Terra Gentil (ebooks gratis de jardinagem do Andre Zimermann).
Tudo em PT-BR, tom caloroso e simples, NUNCA travessao (nem em-dash nem en-dash; use virgula ou ponto).

## Onde fica tudo
- Fabrica: `C:\Users\engan\Documents\Terra Gentil\ebooks\fabrica` (rode os comandos daqui).
- MODELO OBRIGATORIO: `curtos/tg070.mjs` (leia inteiro antes). Veja tambem `curtos/tg066.mjs` e `tg068.mjs`.
  19 paginas, na ordem fixa dos moldes de `gerar.mjs` (Main, Carta, Rapido, Sumario, Ficha, Abertura1,
  Tabela, Abertura, Passos, Texto, Erro, Abertura3, Precisar, Alerta, Galeria, Sinais, Sabia, Checklist, Fechamento).
  Mesma quantidade e ordem de textos (`t`) por pagina que o modelo, so muda o conteudo.
- Seus fatos: `pools/pool-<seus livros>.txt`. Use SO fatos desse arquivo (ids no campo `f` das paginas).
  Os "EXCLUSIVOS DO TG N" sao do tema de cada livro; os COMPARTILHADOS podem ir em qualquer dos seus dois.
  Nunca use fato de fora do seu pool (outros agentes estao usando os outros). Mire 25 a 35 fatos unicos por livro.
- Todo texto do livro tem que dizer so o que os fatos citados dizem. Nao invente numero, especie ou dica.
- Fotos provisorias do miolo e da capa: arquivos de `C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil\capas\banco`
  (confira que o nome existe; use coringa-* quando nao tiver a especie).


## Os 16 livros da leva 7 (titulo, PALAVRA da capa, prefixo das fotos)
| TG | Titulo | PALAVRA | Prefixo |
|---|---|---|---|
| 071 | Hibisco e Primavera | HIBISCO | hib |
| 072 | Flores que se Comem | CAPUCHINHA | fco |
| 073 | Plantas de Banheiro | AVENCA | ban |
| 074 | Espada-de-são-jorge | ESPADA | esp |
| 075 | Minhocário | MINHOCA | min |
| 076 | Maracujá e Uva | MARACUJÁ | mar |
| 077 | Cactos de Coleção | MANDACARU | ccl |
| 078 | Suculentas Coloridas | ECHEVERIA | scl |
| 079 | Pimentas do Mundo | HABANERO | pmm |
| 080 | Orquídea na Árvore | TRONCO | oar |
| 081 | Rosas Perfumadas | PERFUME | rpe |
| 082 | Alocásia e Filodendro | ALOCASIA | alo |
| 083 | Lírios de Jardim | LÍRIO | lir |
| 084 | Árvore na Calçada | IPÊ | ipe |
| 085 | Jardim de Borboleta | BORBOLETA | bor |
| 086 | Flores de Inverno | INVERNO | inv |
O TG 086 promete o TG 087 TOMATE CEREJA (palavra CEREJA). Na ultima pagina: "São N livros na coleção, todos de graça." com N = numero do proprio livro (TG 071 = 71, como o tg070.mjs usa 70).
Titulo do livro pode ajustar levemente se os fatos pedirem, mas mantenha a PALAVRA (o comentario do Instagram do livro anterior ja promete ela).
Tema do 075 (Minhocario): composteira com minhoca e composto em casa; o TG 022 Composteira em Casa ja existe, entao foque no minhocario e no uso do composto.
Tema do 079: pimentas de varios paises (jalapeno, habanero, tabasco...). TG 027 Pimenta no Vaso ja existe: nao repita o basico de vaso.
Tema do 080: orquidea de arvore, montada em tronco, Vanda, raiz no ar. TG 015 a 018 ja existem (florir, cattleya/dendrobium, doente, vaso).
Tema do 081: rosas perfumadas e a roseira no jardim (perfume, historia, variedades). TG 029 a 032 ja existem (vaso, doenca, poda, muda).

## Licoes da leva 6 (evite)
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
