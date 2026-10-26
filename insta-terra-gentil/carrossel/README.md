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

Hoje: `rotacao.mjs`, `dc/`, `render.mjs`. Previstos: `moldes/` (os `.dc.html` aprovados, um
por direção), `legenda.mjs`, e o `contrato.mjs` que confere se todo molde tem os mesmos campos.
