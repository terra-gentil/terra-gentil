# Brief dos agentes: livros TG 055 a 070 (02/11/2026)

Voce escreve 2 livros curtos da Colecao Terra Gentil (ebooks gratis de jardinagem do Andre Zimermann).
Tudo em PT-BR, tom caloroso e simples, NUNCA travessao (nem em-dash nem en-dash; use virgula ou ponto).

## Onde fica tudo
- Fabrica: `C:\Users\engan\Documents\Terra Gentil\ebooks\fabrica` (rode os comandos daqui).
- MODELO OBRIGATORIO: `curtos/tg054.mjs` (leia inteiro antes). Veja tambem `curtos/tg050.mjs` e `tg052.mjs`.
  19 paginas, na ordem fixa dos moldes de `gerar.mjs` (Main, Carta, Rapido, Sumario, Ficha, Abertura1,
  Tabela, Abertura, Passos, Texto, Erro, Abertura3, Precisar, Alerta, Galeria, Sinais, Sabia, Checklist, Fechamento).
  Mesma quantidade e ordem de textos (`t`) por pagina que o modelo, so muda o conteudo.
- Seus fatos: `pools/pool-<seus livros>.txt`. Use SO fatos desse arquivo (ids no campo `f` das paginas).
  Os "EXCLUSIVOS DO TG N" sao do tema de cada livro; os COMPARTILHADOS podem ir em qualquer dos seus dois.
  Nunca use fato de fora do seu pool (outros agentes estao usando os outros). Mire 25 a 35 fatos unicos por livro.
- Todo texto do livro tem que dizer so o que os fatos citados dizem. Nao invente numero, especie ou dica.
- Fotos provisorias do miolo e da capa: arquivos de `C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil\capas\banco`
  (confira que o nome existe; use coringa-* quando nao tiver a especie).

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
no MESMO formato de `fila-fotos-tg054.json` (leia ele): estilo igual, cena em ingles, gesto e sintoma 9:16, var 3:4,
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
