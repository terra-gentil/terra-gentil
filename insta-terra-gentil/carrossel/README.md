# carrossel: slides do feed

**Fase 1.** Recebe uma pauta e gera os slides 1080x1350 e a legenda.

1. Capa com o gancho. 2. Um ponto por slide, com "Dica do André" quando couber. 3. Último slide
com a chamada do dia (palavra-chave, salvar, Doutor).

Arte: verde e âmbar, Archivo Black e Inter, o Brotinho, foto real da espécie certa no fundo
(banco gratuito, com escurecimento para o texto vencer). Largura do texto medida de verdade
(lição do PJ).

## Moldes e rotação

Os moldes saem do Claude Design (canvas "Terra Gentil Carrosséis Livre"), sempre lá e nunca no
Canva. São 3, `creme`, `noite` e `canteiro`, e `rotacao.mjs` escolhe um por dia no fuso de
Brasília, em ciclo, sem repetir o de ontem: `moldeDoDia('2026-10-26')`. Os nomes em `MOLDES`
precisam bater com os arquivos de `moldes/` quando eles existirem.

Hoje: `rotacao.mjs`. Previstos: `moldes/` (um arquivo por molde), `texto.mjs` (quebra e
medida), `legenda.mjs`, `render.mjs` (SVG para PNG). Base: `scripts/publish/slide/` do
setlists-pj-ev.
