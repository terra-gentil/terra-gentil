# REF-RHS: estudo de design do RHS How to Grow Practically Everything (DK)

Complemento do `REFERENCIAS.md`. Estudo feito em 31/10/2026 sobre o PDF da edição DK (2010,
450 páginas, InDesign). Copiamos movimentos de design, nunca texto, foto ou ilustração do
livro. Nenhuma imagem ou trecho do livro foi salvo neste repositório; os renders de estudo
ficaram só na pasta temporária da sessão.

## Decisão do André: quem manda em cada parte do livro

O André achou a RHS a mais bonita das referências. A divisão da coleção fica assim:

| Parte do ebook | Referência principal | O que ela dá |
|---|---|---|
| Capa, gancho, abertura de capítulo, "você sabia", fechamento | **Guinness** | Número gigante, recorte, cor forte, selo |
| Miolo que ensina: página de corpo, ficha de planta, passo a passo, erro comum, tabela, checklist | **RHS (DK)** | Módulo fixo, ficha com rótulos, foto do gesto numerada, fio de cor da família, galeria com chave de ícones |
| Clima geral: respiro, margem, calma da foto, peso leve do título | **Kinfolk** | Só atmosfera; não define módulo nenhum |

Isso substitui a frase "Kinfolk e RHS por dentro" do `REFERENCIAS.md`: por dentro, quem
define a estrutura é a RHS; o Kinfolk só tempera.

## Método

PyMuPDF (`get_text('dict')`) em todas as 450 páginas: família, tamanho e cor de cada trecho,
contados por caractere. Cores de fundo e fios amostradas por pixel no render. Renders de cerca
de 40 páginas (capa, sumário, aberturas das 8 seções, projetos passo a passo, galerias
"Selections", calendário, pragas e doenças, cuidados, índice) vistos um a um.

- **Página:** 552,8 x 666,1 pt (cerca de 195 x 235 mm), proporção 1 : 1,205 (quase 5:6).
  Nossa página é 1 : 1,778. Uma página da DK cabe nos 68% de cima de uma página nossa; em
  conteúdo, uma página dupla da DK vira de 4 a 6 páginas nossas.
- **Escala:** se a página da DK fosse esticada para 1080 px de largura, 1 pt viraria 1,95 px.
  O corpo de 8,5 pt viraria 16,6 px. O nosso é 54 px: **3,25 vezes maior em relação à largura
  da página**. Por isso o que levamos da DK são as **proporções entre níveis** e os módulos,
  nunca os tamanhos absolutos.

## 1. Tipografia medida

Duas famílias só: **Dax Pro** (sans humanista, quase sempre no peso Light) para tudo, e **DIN
Pro** só para dados de ficha. A hierarquia vem do tamanho, não do peso: até o título de 69 pt
é Light. Caixa alta só em rótulo curto. Todo texto em `#1d1d1b`, nunca preto puro.

| Uso | Fonte e peso | pt | Proporção do corpo | Observação |
|---|---|---|---|---|
| Título da capa | Helvetica Neue Extra Black Condensed | 96 a 106 | 11,8x | Caixa alta, verde e azul; só na capa |
| Linha da capa ("100s of...") | Helvetica Neue Thin | 46 a 48 | 5,6x | Contraste de peso extremo com o título |
| Título de abertura de seção | Dax Light, cinza `#6f6f6e` | 69,2 | 8,1x | Duas linhas, caixa baixa, sobre cor pastel |
| Texto da abertura de seção | Dax Light | 13,0 | 1,5x | 6 a 8 linhas |
| Título de projeto ou de página | Dax Light | 34,1 | 4,0x | Caixa baixa, fio de cor da seção embaixo |
| Subtítulo dentro do projeto | Dax Light | 25,0 | 2,9x | Também com fio de cor |
| Linha fina (introdução do projeto) | Dax Light | 11,0 | 1,3x | 3 a 4 linhas, largura total |
| **Corpo** | **Dax Light** | **8,5** (9,0 nas páginas de base) | 1,0x | 281 mil caracteres; entrelinha 12 pt (1,41) |
| Título do passo | Dax Medium, caixa alta | 9,0 | 1,06x | 1 a 3 palavras ("LIFT THE TURF") |
| Intertítulo de corpo | Dax Medium, caixa alta | 9,0 | 1,06x | Mesmo estilo do título do passo |
| Número do passo | Numeral desenhado (imagem), cinza `#989897` a `#dadada` | cerca de 27 de altura | 3,2x | Não é texto; o parágrafo contorna o número |
| Rótulo da ficha ("WHEN TO START", "YOU WILL NEED") | DIN Medium, caixa alta | 8,0 a 8,2 | 0,95x | Com ícone à esquerda |
| Valor da ficha | DIN Light | 8,0 | 0,94x | Uma informação por linha |
| Nome científico na ficha | DIN Light Italic | 8,0 | 0,94x | |
| Rótulo da caixa "Top tip" | DIN Medium, caixa alta | 8,2 | 0,96x | Sobre faixa de cor clara |
| Legenda de foto | Dax Light Italic 7,5 com título em Dax Italic 7,5 | 7,5 | 0,88x | Seta ^ < > aponta a foto |
| Legenda numerada | Dax Light 8,0 com disco numerado (BulletFont 8) | 8,0 | 0,94x | Disco preto, número branco |
| Ícones de ficha da galeria | Fontes de ícone próprias (GardenPlant, RHSfont) | 8,0 | 0,94x | No meio da legenda, com chave no topo |
| Cabeçalho corrido | Dax Bold, caixa alta, mais chevrons Light 13,9 cinza `#9d9c9c` | 7,5 | 0,88x | "BEAUTIFUL BEDS 29" |
| Fólio | Dax Bold | 9,0 | 1,06x | |
| Aba lateral "SELECTIONS" | Dax Bold, branco sobre `#d8d8d8`, vertical | 22,0 | 2,6x | Marca toda galeria |
| Índice | Dax Light | 6,8 | 0,8x | 4 colunas |

## 2. Paleta medida

| Papel | Hex | Contraste | Nota |
|---|---|---|---|
| Texto (corpo, título, ficha) | `#1d1d1b` | 16,9:1 no branco | Preto quente; o nosso `#1A1714` no bege dá 15,2:1 |
| Fundo | `#ffffff` | | Branco puro em quase toda página |
| Título de abertura de seção | `#6f6f6e` | 2,6 a 3,2:1 nos pastéis | **Não passa** nem para texto grande AAA |
| Chevrons do cabeçalho | `#9d9c9c` | 2,7:1 | Decorativo |
| Número de passo | `#989897` com degradê a `#dadada` | 2,9:1 | Decorativo de propósito |
| Aba "Selections" | `#d8d8d8` com texto branco | 1,4:1 | Lido pela forma, não pela letra |
| Fundo do painel de ficha e do "Top tip" | `#ecf0d7` (Canteiros), `#f0ecec` (Frutas e hortaliças) | texto 14,5:1 | Tinta clara, cerca de 10% da cor da seção |

Cor por seção (fundo da abertura e fio sob os títulos):

| Seção | Fundo da abertura | Fio do título |
|---|---|---|
| Básico | `#9ccb9d` | `#8acb93` |
| Canteiros | `#c3d873` | `#bfd550` |
| Vasos | `#95d0d6` | turquesa no mesmo tom |
| Estrutura (árvores, cercas) | `#a9c8dc` | azul no mesmo tom |
| Frutas e hortaliças | `#c9b3c0` | `#bca0af` |
| Vida selvagem | `#fdd693` | âmbar no mesmo tom |
| Plantas de casa | `#d6c18c` | `#c4a873` |
| Cuidados | `#b8c283` | `#bcc783` |

Capa: verde `#8cbc20`, azul `#00a0d4`, laranja `#f8b01c`, lilás `#c498c8`, sobre branco.

Leitura: a DK usa cor **só como código**, sempre pastel e sempre fora do texto (fundo de
abertura, fio de 4 pt, tinta de painel). O texto é sempre o mesmo preto quente sobre branco
ou sobre tinta clara. É a mesma regra que o `REFERENCIAS.md` já tem (uma cor de família por
página), só que mais disciplinada.

## 3. Grade, margens e ritmo

- **Margens:** cerca de 45 pt nas laterais (8% da largura), 60 pt em cima até o conteúdo (o
  cabeçalho corrido fica a 33 pt), cerca de 25 pt embaixo. Margem de pé curta, foto chega
  quase na borda.
- **Grade:** 3 colunas de cerca de 145 pt com calha de 12 pt, subdivididas em 6. O painel de
  ficha ocupa sempre 1 coluna à esquerda; o "Top tip" sempre 1 coluna à direita; o passo ocupa
  1,5 colunas (texto) mais 1,5 (foto).
- **Fios:** fio cinza fino na largura total separa as linhas de passos; fio de cor da seção sob
  cada título. Nada de caixa com borda grossa, nada de sombra.
- **Ritmo entre páginas:** cada projeto abre com foto em sangria ocupando 3/4 da página e o
  título embaixo (página da direita), seguido de 1 a 2 páginas de passos e fecha com um "Top
  tip". A cada 4 ou 5 projetos vem uma galeria "Selections" (página dupla com aba cinza). Cada
  seção abre com página dupla: foto inteira de um lado, campo de cor com título do outro. O
  leitor nunca vê duas páginas dupla iguais seguidas, mas reconhece cada módulo no ato.

## 4. Movimentos de design (15)

1. **Abertura de seção em duas faixas:** faixa vertical de foto em sangria (cerca de 30% da
   largura) e campo de cor chapada da seção com título enorme e leve e 6 a 8 linhas de texto.
   Muito vazio em cima; o título começa na metade da página.
2. **Projeto abre com foto heroica:** foto ambientada ocupando 3/4 da altura, em sangria, e
   embaixo título em caixa baixa com fio de cor e linha fina de 3 linhas. Uma foto, um título,
   uma promessa.
3. **Fio de cor sob todo título:** a seção é dita por um fio de 4 pt, não por página pintada.
   Código de cor que não atrapalha a leitura.
4. **Painel de ficha fixo do projeto:** "Quando começar", "No auge", "Tempo para fazer",
   "Você vai precisar" (lista, uma coisa por linha), "Plantas usadas" (nome científico em
   itálico). Fundo tinta clara, rótulo em caixa alta com ícone (chevron duplo, relógio, "i"),
   sempre no mesmo canto.
5. **Módulo de passo:** numeral grande cinza claro, título de 1 a 3 palavras em caixa alta,
   3 a 8 linhas de explicação e foto do gesto ao lado. Fio fino separa as linhas de módulos.
   São até 10 passos numa página dupla, sempre na mesma forma.
6. **Número do passo que organiza sem gritar:** o numeral é cinza, com o texto contornando;
   quem lidera é o título do passo. O olho pula de número em número sem cansar.
7. **Foto do gesto em close:** mão, ferramenta e terra enquadradas de perto; a foto mostra o
   que o texto manda fazer (cortar, firmar, regar). Quase nunca rosto.
8. **Foto numerada com disco e legenda agrupada:** disco preto com número branco no canto da
   foto, e todas as legendas juntas num bloco com os mesmos discos. Libera a foto de texto.
9. **Galeria "Selections":** uma foto grande da variedade 1 mais uma coluna de miniaturas
   numeradas; legenda compacta com nome popular, nome científico, altura (↕), largura (↔) e
   ícones; aba vertical fixa na borda.
10. **Chave de ícones no topo da galeria:** a legenda dos símbolos (resistência ao frio, sol,
    meia-sombra, sombra, solo drenado, úmido, encharcado) é repetida em toda galeria. Ícone
    sempre explicado na própria página.
11. **Escala de ícone por preenchimento:** sol cheio, meio sol, sol vazio; uma, duas ou três
    marcas para resistência; gota vazia, meia, cheia para umidade. Três estados, mesmo
    desenho.
12. **Caixa "Top tip":** rótulo em caixa alta sobre faixa de tinta, texto curto e uma foto,
    sempre na coluna da direita, no fim do projeto. Seção com nome fixo, reconhecível.
13. **Legenda com seta e título:** "^ Shower young plants" em itálico, depois uma frase. A seta
    diz qual foto é, sem número.
14. **Calendário em colunas de estação:** título leve grande por estação, subdivisão em início,
    fim e "toda a estação", lista com marcador e referência de página, e uma caixa "qualquer
    época do ano". Calendário é lista, não tabela.
15. **Problemas resolvidos por diagnóstico visual:** praga e doença viram "sinais de ataque"
    (foto numerada do sintoma), "como evitar" e solução em "Top tip". Não existe tabela de
    problema e solução; é sempre foto do sintoma mais texto curto.

Duas observações honestas:
- **Foto recortada em fundo branco quase não existe no miolo.** Só a capa usa objeto recortado
  (em quadrados de cor). No miolo tudo é foto retangular ambientada. A ideia de recorte para
  nós continua vindo do Guinness, não da DK.
- **Ficha por espécie com ícones grandes não existe.** A ficha da DK é do projeto (quando,
  tempo, material); a da planta é a linha de legenda com ícones pequenos na galeria. A nossa
  prancha de planta junta as duas coisas e cresce o ícone.

## 5. Tradução para os 12 tipos de página (1080 x 1920, celular)

Base para todos: fundo bege `#F4ECDB` (não branco), texto `#1A1714`, corpo 54 px Atkinson,
título Fraunces, rótulo Montserrat. Proporções herdadas da DK aplicadas ao nosso corpo de 54
px: linha fina 1,2x (64 px), título de página 2,2 a 2,4x (120 a 132 px; a DK usa 4x, mas no
celular 216 px quebraria toda palavra), título de passo 1,0x em negrito, legenda e rótulo 0,75
a 0,8x (40 a 42 px, nunca abaixo de 38).

| # | Tipo | O que entra da RHS | Como fica em 1080 x 1920 |
|---|---|---|---|
| 1 | Capa | Pouco. Só a disciplina de cor por seção e a ideia de objeto recortado em quadrado de cor | Segue o Guinness do `REFERENCIAS.md`. Nada da capa da DK (10 fotos e 3 fontes) |
| 2 | Abertura com gancho | Nada estrutural | Guinness puro |
| 3 | Carta do André | O respiro da linha fina (texto curto, largura total, entrelinha generosa) | Foto 40% em cima, texto 54 px, 90 a 100 palavras, assinatura |
| 4 | Abertura de capítulo | **Movimento 1**: faixa de foto em sangria mais campo de cor da família, título começando na metade da página | Faixa de foto em cima (40% da altura, sangria) e campo de cor da família embaixo. Título Fraunces 120 px em preto ou bege conforme o contraste da família (nunca o cinza da DK), 2 a 3 linhas de contexto em 54 px. Energia Guinness entra pelo número gigante do capítulo |
| 5 | Página de corpo | **Movimentos 2, 3, 13**: título com fio de cor da família (8 px, 240 px de largura), linha fina, uma foto com legenda de seta | Intertítulo 72 px com fio de cor embaixo, até 110 palavras, uma foto alinhada à grade com legenda de 40 px iniciada por seta ("↑ Muda depois de 7 dias"). A página de pausa repete o movimento 2: foto 70% em sangria e uma frase |
| 6 | Ficha de planta (prancha) | **Movimentos 4, 10, 11**: painel fixo com tinta clara, rótulos com ícone, escala de 3 estados, chave explicada | Foto 45% em cima. Nome Fraunces 112 px, científico itálico 42 px. Grade 2 x 3 de blocos Bege 2, cada um com ícone 72 px, rótulo Montserrat 40 px e valor em 54 px (ex.: ícone de sol meio cheio, "LUZ", "Meia-sombra"). Altura ↕ e largura ↔ numa linha extra. Selo de pet obrigatório |
| 7 | Passo a passo | **Movimentos 5, 6, 7, 8**: módulo fixo número, título curto, explicação, foto do gesto; fio separando | Um módulo por página (ou 2 se curtos). Foto do gesto em close no topo (55% da altura) com disco numerado; número grande na cor escura da família à esquerda (aqui o número precisa de contraste, não o cinza da DK); título do passo em negrito 54 px com 2 a 5 palavras; 1 a 3 linhas de explicação. Fio fino de Grafite quente entre módulos quando houver 2 |
| 7b | "Você vai precisar" (início do passo a passo) | **Movimento 4**: painel com "Quando fazer", "Tempo", "Você vai precisar" | Página própria antes do passo 1: três blocos empilhados em Bege 2, com ícone e rótulo; lista de material com uma coisa por linha em 54 px, até 8 itens, com foto opcional do material junto. Vira também cartão para print |
| 8 | Erro comum | **Movimento 15** e 8: diagnóstico pela foto do sintoma, com disco numerado | Pergunta no topo (Fraunces 88 px), foto do sintoma 45% com disco, "O que parece" e "O que é" em 54 px, "Como resolver" em caixa Bege 2 com ícone de certo. Foto de sintoma só de banco com licença, nunca do Flow |
| 9 | Tabela | **Movimento 14**: quando é calendário, vira lista por estação, não grade | Até 3 colunas e 7 linhas, como já definido. Calendário: uma página por estação (primavera, verão, outono, inverno do hemisfério sul), título Fraunces 112 px, lista de 5 a 7 ações em 54 px, caixa "Qualquer época" no fim |
| 10 | Alerta | **Movimento 12**: caixa com nome fixo e lugar fixo | Mantém a caixa do `REFERENCIAS.md` (borda laranja). Ganha um irmão calmo, a caixa **"Dica do André"** no lugar do "Top tip": rótulo em faixa de tinta da família, até 40 palavras, foto opcional, sempre no fim do bloco |
| 11 | Checklist | **Movimento 4**: lista de uma coisa por linha, sem frase | Caixas de 56 px, até 8 itens, em Bege 2. Pode reaproveitar o painel "Você vai precisar" |
| 12 | Fechamento | **Movimento 9** em versão de coleção: grade de miniaturas numeradas | Grade da coleção com miniaturas numeradas por disco, como a coluna da galeria; resto segue o Guinness |
| extra | Galeria de variedades (livros com várias espécies) | **Movimentos 9, 10** | Página com 1 foto grande (50%) mais 2 a 3 fotos menores com disco; legenda de cada uma em 42 px com nome, ↕, ↔ e 3 ícones; chave de ícones no rodapé da própria página. No máximo 4 variedades por página |

## 6. Proposta de ícones de ficha Terra Gentil

Regras herdadas da DK e ajustadas ao público: ícone **sempre com palavra**, 72 px na ficha
(nunca 8 pt de linha de legenda), traço grosso de 6 px, cor escura da família, um desenho por
conceito com **3 estados por preenchimento**, e chave de ícones na contracapa e em toda
galeria.

| Ícone | Rótulo | Estados (desenho mais palavra) |
|---|---|---|
| Sol | LUZ | Sol cheio "Sol pleno"; sol metade "Meia-sombra"; sol vazio "Sombra" ou "Luz indireta" |
| Gota | ÁGUA | 1, 2 ou 3 gotas: "Pouca", "Média", "Muita"; mais a frase do teste do dedo |
| Torrão | SOLO | Torrão com pontos "Drenado"; torrão liso "Úmido"; torrão com areia "Arenoso" |
| Termômetro | CLIMA | Faixa de temperatura em °C, e "Não gosta de geada" quando for o caso |
| Folha | DIFICULDADE | 1, 2 ou 3 folhas: "Fácil", "Média", "Exige atenção" |
| Patinha | PET | Círculo "Seguro", triângulo "Cuidado", octógono "Tóxico"; forma diferente, não só cor, e fonte citada (ASPCA, CIATox) |
| Calendário | QUANDO PLANTAR | Meses ou estação do hemisfério sul |
| Relógio | TEMPO PARA FAZER | "30 min", "1 tarde" |
| Cesto | COLHEITA OU FLOR | Quando colhe ou quando floresce ("No auge") |
| Setas ↕ e ↔ | TAMANHO | Altura e largura em cm |
| Vaso | VASO | Tamanho mínimo em litros ou cm de boca |
| Sacola de ferramentas | VOCÊ VAI PRECISAR | Abre a lista de material |

A ficha de planta usa sempre os 6 primeiros, nesta ordem. Os outros entram no painel de
projeto (passo a passo) e na galeria. Desenho próprio, sem copiar as fontes de ícone da DK.

## 7. O que NÃO adaptar

1. **Corpo de 8,5 pt e a densidade de 10 passos por página dupla.** No celular viraria 16 px.
   Um passo por página (no máximo 2).
2. **Título Light cinza `#6f6f6e` sobre pastel** (2,6 a 3,2:1). Nosso título é Fraunces 600 em
   preto ou bege, com 7:1 nos títulos da ficha e do miolo.
3. **Número de passo cinza claro** (2,9:1). No celular, com vista cansada, ele some; o nosso vai
   na cor escura da família.
4. **Aba lateral cinza com letra branca** (1,4:1) e texto vertical. Nosso sinal de família é a
   lombada de 24 px, sem texto.
5. **Legenda itálica de 7,5 pt e itálico em bloco.** Legenda em 40 a 42 px, regular; itálico só
   no nome científico.
6. **Ícones minúsculos no meio da linha de legenda**, decifrados só pela chave do topo. Ícone
   grande e com palavra.
7. **Página dupla e referência cruzada "see p. 14".** Página única 9:16; se precisar remeter,
   link interno clicável com o nome da página.
8. **Fundo branco puro.** Ficamos no bege `#F4ECDB`, que já é a marca.
9. **Capa da DK** (caixa alta condensada, 10 fotos em grade, 3 fontes). A capa é do Guinness e
   da Penguin.
10. **Conteúdo e contexto inglês:** unidades imperiais, estações do hemisfério norte, plantas de
    clima temperado, jardim inglês grande. Nossas fotos são do quintal real do André.
11. **"Continued..." no pé da página** e passo que atravessa página. Cada passo fecha na página.
12. **Peso Light no corpo.** A Dax Light funciona no papel; na tela pequena o traço fino some.
    Corpo em Atkinson 400.

## 8. Carol Costa, "Minhas Plantas"

Procurado em `C:\Users\engan\Documents` e subpastas: o PDF não foi encontrado. A seção sobre a
referência brasileira de tom fica pendente até alguém indicar onde está o arquivo.
