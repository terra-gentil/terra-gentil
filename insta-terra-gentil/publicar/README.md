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

## Publicar no Instagram (`instagram/`)

Cliente da Graph API (Instagram Login, `graph.instagram.com` v21.0), testado contra um Instagram
falso (`ig-falso.mjs`). Fluxo: um container por slide, um do carrossel, espera `status_code`
`FINISHED`, `media_publish`. Se o `media_publish` falhar mas o post já estiver na conta, recupera
em vez de duplicar. Confere a cota de 24h antes. `registro.mjs` grava `dados/publicados/<dia>.json`
e barra postar o mesmo dia duas vezes.

**BOTAO DE PUBLICAR:** variável do repositório `IG_PUBLICAR` (GitHub, Settings > Secrets and
variables > Actions > Variables). Só o valor `ligado` posta. Vazio, ausente ou qualquer outro valor
só confere o pacote e as imagens e NÃO posta. Pelo terminal:
`gh variable set IG_PUBLICAR --body ligado` (e `--body desligado` para desligar).

Fluxo dos workflows:
1. `publish-instagram.yml` (rotina, 04:00 BRT): mescla o post, renderiza PNG e JPEG e guarda o
   pacote (`01.jpg` a `08.jpg`, `legenda.txt`, `ficha.json`) na branch `ig-slides`. As imagens
   saem por `raw.githubusercontent.com/terra-gentil/terra-gentil/ig-slides/<dia>/NN.jpg`.
2. `postar-instagram.yml` (no horário de postar, gatilho do TriggerAll ainda a cadastrar): lê o
   pacote do dia e posta, ou só confere se o botão estiver desligado. `so_token` valida o token.

Secrets necessários para postar: `IG_USER_ID` e `IG_ACCESS_TOKEN` (token do Instagram Login,
dura 60 dias; falta o workflow mensal de renovação). Permissões: `instagram_business_basic` e
`instagram_business_content_publish`. Conta profissional.

## Site e Instagram juntos (notícia)

Quando o post tem `materia`, ele vira uma página em `/noticias/<slug>` e o carrossel leva o link na
legenda ("Leia a matéria completa: ..."). A ordem, no `publish-instagram.yml` e no
`postar-instagram.yml`:

1. Mescla o post na main: a Vercel publica a página da notícia.
2. A prévia grava a capa e o crédito da foto em `public/noticias/<slug>/` (commit do bot na main).
3. Na hora de postar, o `postar-instagram.yml` espera a página responder (até 10 minutos). Se ela
   não subir, o post sai SEM a linha do link: link quebrado no Instagram é pior que nenhum. O
   resumo do run diz "FORA DO AR (o post sai sem o link)".

Post antigo, sem `materia`, não tem página nem link, e continua funcionando como antes.
