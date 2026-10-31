# A fórmula dos ebooks do Gamma (engenharia reversa)

Estudo do livro "Guia Gentil: Plantas, Cães e Gatos" (gamma.app/docs/zcaxj12wu3699mq), 30/10/2026.
Atualizar a cada livro novo feito no Gamma.

## Como os livros de 2025 foram gerados (menu "Ver prompt de origem")

- Modo **"Criar a partir do modelo" (Remix)**: o modelo é o gamma "00 - Jardim Terapêutico"
  (cerca de 28 cards), que dá a estrutura e o tema. O conteúdo novo entra como prompt.
- O prompt é o **livro inteiro já escrito**: título, subtítulo, autor, e cada card separado por
  `---` (INTRODUÇÃO, CAPÍTULO 1 a 5, CONCLUSÃO). Tabela colada como texto corrido.
- No fim do prompt vão as instruções: apagar todas as imagens menos as logos do Terra Gentil,
  trocar por imagens no contexto, foto genérica no lugar do André e do mascote, deixar os links
  clicáveis e pôr botões (YouTube e Instagram).
- Configuração: texto em modo "Redução" (o Gamma resume e expande em cards), imagens de IA em
  automático (8 créditos por imagem), cerca de 28 slides. Prompt de 2.228 caracteres.
- Lição: o texto curto (5 capítulos) era inflado pelo Gamma para 28 cards; por isso há cards de
  enchimento (benefícios repetidos, "Plantas Amigas" genéricas). No nosso motor, o roteiro já
  deve vir card a card, sem o Gamma inventar texto.

## O que o Gamma de 2026 faz (Agent, renovação da cópia do livro dos Pets, 30/10/2026)

Cópia: gamma.app/docs/77h85743t91bwt0 (o original segue intacto). O Agent fez 26 alterações em
etapas: formato, tema e estilo de imagem, depois card por card.
- Formato vertical (16:9 em pé) para celular; tema "Flax" (editorial); letra base maior,
  parágrafos curtos, mais respiro.
- Estilo de imagem descrito por texto (fotografia editorial, luz natural, terroso e verde-sálvia)
  aplicado ao livro todo; regera todas as imagens de IA.
- Etiqueta de capítulo ("Capítulo 3") e subtítulo nos cards.
- Caixas de destaque coloridas por tipo: dica, dica extra, aviso de ação imediata.
- Smart layouts como infográfico: caixas numeradas com círculo no topo e campos (Onde fica,
  Risco, Sintomas), caixas de alerta sólidas, linha lateral com ícone, passos com ícone (Diário e
  Semanal), ícone por cômodo, citação em destaque.
- Limites: não revisa visualmente o que fez (o próprio Agent avisa) e não corrige fato errado
  (hortelã e orégano seguiram como seguros para pets).
- Edição por card: Melhorar a escrita, Corrigir ortografia, Traduzir, Mais longo, Mais curto,
  Simplificar, Mais específico, Mais visual, Adicionar imagem, Adicionar gráfico,
  Experimentar novo layout.

## Tema "Terra Gentil" (tema personalizado do workspace)

| Peça | Valor |
|---|---|
| Título h1 | Montserrat 700, 45 px, entrelinha 1,25, quase preto (#020202) |
| Título h2 / h3 | Montserrat 700, 36 px / 27 px |
| Corpo | Source Sans 3, 400, 18 px, entrelinha 1,6, cinza #383838 |
| Fundo | Branco |
| Destaque | Laranja da logo: faixa vertical na margem do card, borda esquerda das caixas |
| Citação | Borda esquerda cinza claro (#DFDFE0), sem itálico |
| Logo | Terra Gentil (flor laranja, "TERRA" bege, "GENTIL" laranja) em fundo preto arredondado |

## Estrutura (30 cards)

1. Capa: logo grande, título com emoji, subtítulo, "Por André Zimermann - Terra Gentil"; imagem de destaque na lateral (ilustração flat laranja e verde).
2. Carta do André ("Quando o Jardim Vira Abraço"), com 3 fotos.
3. Introdução sem culpa ("Você não é um dono irresponsável"), só texto.
4 a 8. Capítulos: "CAPÍTULO N: título + emoji", imagem de destaque no topo ou na lateral; usam tabela, citação, lista numerada e caixa de destaque com ícone.
9 a 14. Cards de item numerados ("Plantas Amigas #1: A Resistente"), com grade de mini-cartões (smart layout) e caixa lateral.
15 a 22. Cards de apoio: identificação rápida, estratégias, sinais de alerta, rotina em colunas.
Final: checklist "comece essa semana" e fechamento com YouTube e Instagram.

## Blocos que o Gamma usa

- Imagem de destaque (accent): topo com corte ondulado ou lateral meia página.
- Smart layout: grade de 2 a 3 mini-cartões, borda arredondada, filete laranja à esquerda.
- Callout (`gml-callout`): ícone + texto, para "Sabedoria Terra Gentil".
- Tabela simples, citação, listas, colunas.

## Imagens

Mistura de foto do André (camiseta e boné), ilustração flat e banco de imagens. Nos 6 livros
novos: nossas capas do banco, banco de imagens e capa do Google Flow.
