# publicar: fila e Instagram

**Fase 1.** Publica carrossel e reel pela Graph API e marca `postedAt` na `dados/fila.json`.

Base: `scripts/publish/ig/` e `fila/` do setlists-pj-ev (inclui a recuperação do falso erro de
publicação). Desligado sem `IG_TOKEN` e `IG_USER_ID`. Validar sempre num IG falso local antes.

Previstos: `graph.mjs` (HTTP), `carrossel.mjs`, `reel.mjs`, `fila.mjs`, `mock/` (IG falso).

## Rotina e merge automático

`rotina/validar.mjs` decide se a branch da rotina pode ser mesclada sozinha (repositório público):
prefixo `claude/insta-routine-`, só commit da conta `claude` (ou `terra-gentil`), só arquivos
`.json` em `insta-terra-gentil/dados/posts/` e `dados/rotina-log/`, no máximo 10. Depois do merge
o workflow roda `node pauta/rotina-cli.mjs conferir` (refaz a checagem de fatos).

Ligação com o TriggerAll (lido em `C:/Gitlab_hz/triggerall`): o webhook `push` do GitHub avisa o
Railway, que dispara o workflow `publish-instagram.yml` do repositório. Hoje o TriggerAll só reconhece
o prefixo `claude/news-routine-`. Falta o workflow, o webhook e o gatilho (ver PROGRESSO.md).
