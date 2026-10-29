# carrossel: slides do feed

**Fase 1.** Recebe uma pauta e gera os slides 1080x1350 e a legenda.

1. Capa com o gancho. 2. Um ponto por slide, com "Dica do André" quando couber. 3. Último slide
com a chamada do dia (palavra-chave, salvar, Doutor).

Arte: verde e âmbar, Archivo Black e Inter, o Brotinho, foto real da espécie certa no fundo
(banco gratuito, com escurecimento para o texto vencer). Largura do texto medida de verdade
(lição do PJ).

## Moldes e rotação

Os moldes saem do Claude Design (canvas "Terra Gentil Carrosséis Livre"), sempre lá e nunca no
Canva. São 7, um por dia da semana: `manchete` (seg), `faixas` (ter), `album` (qua), `duotom`
(qui), `jornal` (sex), `galeria` (sáb) e `lambe` (dom). `rotacao.mjs` escolhe o do dia no fuso
de Brasília, sem repetir o de ontem: `moldeDoDia('2026-10-26')`. Molde novo = acrescentar o nome
em `MOLDES` e o arquivo em `moldes/`; o ciclo se ajusta sozinho. Todo molde segue o mesmo
contrato de campos (foto, escurecimento, zoom, foco, textos), para o código trocar de molde sem
quebrar.

## Do molde ao PNG

O molde é o `.dc.html` do Claude Design (HTML com CSS, não SVG). `dc/montar.mjs` converte um
molde mais os dados do dia em HTML puro: `dc/extrair.mjs` separa as peças, `dc/valores.mjs`
roda o `renderVals` numa caixa isolada, `dc/gabarito.mjs` aplica `<sc-if>` e `{{campos}}`
(campo desconhecido derruba a execução) e `dc/imagens.mjs` põe a foto local como data URI.
`render.mjs` abre o HTML num Chrome sem janela e salva o PNG 1080x1350, vários slides numa
abertura só. Local: `TG_CHROME_CANAL=chrome` usa o Chrome instalado. No CI: Chromium do
Playwright (`npx playwright-core install chromium`).

## Moldes e contrato

`moldes/<molde>/{capa,problema,passo,final}.dc.html`: 7 moldes x 4 tipos de slide, copiados do
canvas do Claude Design já com os textos como campos. Os slides 3, 4 e 7 usam o tipo
`problema` e o 6 usa `passo`. `contrato.mjs` lista, por tipo, os campos obrigatórios e os
opcionais; `moldes.test.mjs` reprova molde que falte campo, tenha campo de fora, não converta
ou que não bata com a lista de `rotacao.mjs`. Para o código do dia basta
`montarSlide('manchete', 'capa', { linha1: '...', foto })` e depois `renderizar`.

Novo molde: criar a pasta com os 4 `.dc.html` no mesmo contrato e acrescentar o nome em
`MOLDES`. O teste diz o que faltar. Se o desenho da IA usar um construto novo que o
conversor não conhece, ele derruba a execução com o nome do campo, nunca sai slide torto.

Hoje: `rotacao.mjs`, `contrato.mjs`, `moldes.mjs`, `dc/`, `render.mjs`. Previstos:
`legenda.mjs` e o `montar-dia.mjs` que liga pauta, foto, molde do dia e render.

## Montar o dia

`node carrossel/cli.mjs <post.json> [AAAA-MM-DD]` gera em `saida/<dia>/` os 8 PNGs, a
`<dia>-legenda.txt` e a `<dia>-ficha.json` (molde, foto, crédito, avisos). Exemplo de roteiro em
`dados/post-exemplo.json` (texto de teste, não publicar).

- `estrutura.mjs`: ordem dos 8 slides (capa, problema x3, passo x2, problema, final) e validação do
  roteiro: campos obrigatórios por tipo e travessão proibido. Passo ganha "Passo N" e "0N" sozinho.
- `foto-do-dia.mjs`: foto curada da espécie (`dados/fotos.json`) ou, sem ela, o banco gratuito.
- `cta.mjs`: chamada do slide 8 (comente a PALAVRA, siga, app grátis). Com ebook, o slide 8 troca o
  mascote pela capa do ebook (`capaEbook`, de `dados/palavras.json`), cartão de foto 9:16 no canto.
- `legenda.mjs`: gancho, resumo, chamada da palavra-chave do ebook, Doutor, crédito e hashtags.
  Máximo de 2200 caracteres, sem travessão.
- `montar-dia.mjs`: junta tudo. Molde pela rotação, foto em data URI, mascote (pose por slide) e
  foto do André só onde o contrato pede, contador N/8. Dependências injetáveis (teste sem rede).
- `estouro.mjs`: depois de renderizar, mede no Chrome os textos que passam da borda do slide
  (rodapé cortado, por exemplo) e devolve em `avisos`. Não derruba a montagem, o Telegram mostra.
