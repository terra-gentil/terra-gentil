# publicar: fila e Instagram

**Fase 1.** Publica carrossel e reel pela Graph API e marca `postedAt` na `dados/fila.json`.

Base: `scripts/publish/ig/` e `fila/` do setlists-pj-ev (inclui a recuperação do falso erro de
publicação). Desligado sem `IG_TOKEN` e `IG_USER_ID`. Validar sempre num IG falso local antes.

Previstos: `graph.mjs` (HTTP), `carrossel.mjs`, `reel.mjs`, `fila.mjs`, `mock/` (IG falso).
