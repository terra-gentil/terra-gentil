# PROGRESSO Terra Gentil

## HANDOFF (27/10/2026, tarde): capas com o Andre, orquidea testada, falta o lote

**Onde paramos:** codigo e ferramenta prontos, teste da orquidea feito e vistoriado. NADA de imagem no banco ainda (`capas/banco/` vazio, de proposito: o banco recebe so o 2K aprovado). Gerar imagem nao gasta credito no plano Pro (saldo 1.050 antes e depois, conferido no historico do Google One).

**Codigo (commit a1657e6, 171 testes verdes):** `insta-terra-gentil/capas/`. Slide 1 do carrossel usa a capa do banco quando a especie tem; rodizio pela contagem de `dados/posts`. `dados/capas.json`: 36 especies x 5 cenarios (A segurando, B cuidando, C ambiente, D ensinando, E regando) + 10 coringas x 3 = 210 imagens. Camiseta OFICIAL Terra Gentil (cinza escuro, logo laranja no peito, decisao do Andre): para a logo nao sair "TIRRA", o prompt traz o texto entre aspas, planos medios e manda copiar de uma foto de referencia so da logo, `capas/referencias/andre-camiseta-logo.jpg` (recorte da chroma-3, fora do git). O Agente do Flow confirmou que isso melhora muito; se ainda errar, corrigir por edicao de imagem ("Fix the spelling on the logo to read TERRA GENTIL"). CLIs: `node capas/fila-cli.mjs <slug>` (gera `saida/fila-capas.json`) e `node capas/importar-cli.mjs <pasta>` (corta para 1080x1350 e poe no banco; nome do arquivo = `<slug>-<A..E>-<n>.jpg`).

**Ferramenta "Capas TG" no Flow (conta eng.andrehz, projeto 57852232):** Elenco, fila JSON, geracao 1 por vez, conferencia rigida pelo Gemini com ate 2 refacoes automaticas, salva a imagem no painel com o id no nome (`orquidea-B-1`). Cabeca/topo ocupado agora so INFORMA (tag "TOPO OCUPADO"), nao reprova; `bone_correto` so reprova logo visivel e errada. Sempre editar em rodadas curtas ("Keep everything as it is..."), campo achado por `find`, enviar com a seta se Enter nao enviar.

**Ferramenta, ajustes de hoje:** a conferencia da camiseta agora e `camiseta_logo_correta` (verdadeira se a logo nao aparece ou le TERRA GENTIL; falsa so se visivel e errada), e as miniaturas abrem um visualizador grande (setas, Esc, tentativas), tambem durante a geracao.

**Vistoria da orquidea (4 imagens vistas em 1K, ainda com camiseta LISA, antes da troca):** B-1, D-1, E-1 aprovadas (rosto fiel, folhas saudaveis, logo do bone ok). C-1: aprovada com ressalva (linha "GENTIL" do bone cortada pela aba). A-1 nova ainda NAO vista. Como a camiseta mudou para a oficial, REFAZER a orquidea inteira no proximo teste. O painel mostra cada imagem duas vezes (a ferramenta salva em duplicado): baixar so uma de cada nome.

**Fotos 2K:** o SDK da ferramenta NAO baixa 2K. So no painel "Todas as midias": menu da imagem > "Fazer o download" > 2K (aprimorada); 4K exige upgrade. A ferramenta baixa 1K (896x1200). Plano: gerar tudo, vistoriar, baixar no 2K pelo painel, renomear para `<id>.jpg`, importar, commitar.

**Atalhos aprendidos:** copiar o JSON da fila com `Set-Clipboard` e colar com ctrl+v no campo (digitar 6 KB e lento). Elenco perde-se ao recarregar: "Do Projeto" + ctrl+clique nas 5 fotos `andre-*` (chroma-3, chroma-1, rua-1, rua-2, bone-logo), ou "Carregar elenco" com `capas/referencias/elenco-capas.json` (fora do git). Ler `Minhas criacoes` do Flow nao e preciso.

**Pedidos do Andre ainda abertos:** (1) FEITO: miniatura abre a imagem grande; (2) gerar sozinho, sem pedir confirmacao a cada geracao (memoria `feedback-gerar-sozinho`); (3) lotes de 5 em 5 (uma especie por lote), vistoria minha antes de baixar.

**Achado (27/10):** o `media_id` que a ferramenta mostra abre direto a pagina da imagem: `https://flow.google.com/project/57852232-f318-4573-9547-901651781160/edit/<media_id>` (titulo = id, botao de download no topo, menu 1K/2K). Use isso para baixar o 2K da imagem certa sem confundir as copias duplicadas do painel. Ideia aberta: rodada no Criador para por link "Abrir no Flow" por linha; e ver, com read_network_requests, se o clique em 2K usa uma URL direta reaproveitavel.

**Proximo passo exato:** (a) subir `capas/referencias/andre-camiseta-logo.jpg` no Elenco da ferramenta (sem rosto; limite de 6 fotos, hoje 5: ou trocar a rua-2 por ela) e gerar o teste novo da orquidea com os 5 cenarios (`node capas/fila-cli.mjs orquidea`, colar via clipboard); (b) vistoriar as 5 (eu olho cada uma antes de baixar; atencao a grafia TERRA GENTIL na camiseta e no bone), baixar no 2K pelo painel, importar, commitar `capas/banco/orquidea/`; (c) lotes das 15 principais restantes (`node capas/fila-cli.mjs jiboia` etc.), depois secundarias e coringas; (d) folha de prova por grupo para o Andre; (e) ligar coringas ao post (hoje `capaDoDia` busca por `post.especie`; coringa usa chave `coringa-regar` etc., falta o mapa tema para coringa); (f) opcional: o molde escolher titulo em cima/embaixo conforme a tag TOPO OCUPADO.

**Pendencias antigas ainda validas:** rascunho vazio "Miniaplicativo sem titulo" no Flow (so o Andre exclui); Chromium do Playwright falta neste PC (`npx playwright install chromium-headless-shell`) para render local; N6 do Search Console; IG_PUBLICAR segue `desligado`; testar `renovar-token-instagram.yml` a mao.

**Terminal:** `warning.confirmCloseAllTabs: true` ligado (so vale com 2+ abas). Retomar sessao fechada: `claude -c`.

**Comando:** `cd C:\Gitlab_hz\terra-gentil-site\terra-gentil && claude`

---

## AJUSTE (27/10/2026, manha): capa e titulo do carrossel

**Conferido no ar:** a rotina das 04:00 gerou o post de 28/10 (IMORTAL), mesclou, e a noticia `/noticias/espada-de-sao-jorge-como-regar-sem-afogar` esta no ar (200, index, JSON-LD, sitemap, feed). Instagram segue desligado. A noticia sai com data de amanha porque a rotina escreve o dia seguinte e o site publica ao mesclar.

**Corrigido:** (1) titulo longo ("espada-de-sao-jorge") nao quebra mais no hifen: `tratamento-texto.mjs` trava cada linha do h1 e encolhe todas pelo mesmo fator (`fatorDeEncolhimento`, com teste), mantendo a altura da linha; testado nos 7 moldes, sem aviso de estouro. (2) capa com desfoque e veu leves (`tratarFoto` com `capa`, ESCURECIMENTO_CAPA 30, veu do album) para a planta aparecer. (3) foto curada da espada-de-sao-jorge em `dados/fotos.json` (CC0, folhas nitidas, no lugar do mato com galhos); capa do site trocada. (4) legenda de exemplo "2 cm acima da gema" vazava no passo do molde album: agora "terra gentil".

**Risco aberto:** a foto automatica escolhe so por proporcao e licenca, nao por qualidade. Como a noticia vai ao site sozinha, curar a foto de cada especie ANTES da rotina escrever o post dela (`node insta-terra-gentil/imagem/curar-cli.mjs "Especie"`).

## ESTADO (26/10/2026, fim da noite): publicacao no Instagram montada, DESLIGADA

**Feito hoje:** nome cientifico em `especie` (corrige foto de cobra), desfoque/gradiente/sombra/realce de foto/titulo equilibrado nos moldes, enquadramento variado, retry do Chromium no CI. Publicacao no IG pronta e testada com IG falso: `insta-terra-gentil/publicar/instagram/` (cliente Graph API, carrossel, registro anti-duplicata). Teste de ponta a ponta no GitHub OK com o botao desligado (previa gera pacote na branch `ig-slides`, `postar-instagram.yml` confere e NAO posta).

**Noticias no site (N1 a N5 prontas, 26/10 noite):** o post ganhou o campo `materia` (texto de 600+ palavras com fatos por secao, FAQ), validado em `pauta/materia.mjs` e pedido no prompt da rotina. Site: `/noticias`, `/noticias/[slug]`, `/noticias/feed.xml`, JSON-LD Article/FAQ/Breadcrumb, sitemap, menu, rodape e home (tudo so aparece com ao menos 1 noticia; vazio = noindex). GA4: `NewsTracker` (news_view, news_read_75, cta_ebook_click, cta_instagram_click), doc em `docs/ANALYTICS.md`. Workflow: grava capa e credito em `public/noticias/<slug>/` e o link entra na legenda so se a pagina estiver no ar. **ATENCAO:** a noticia vai ao ar no site SOZINHA quando o post com `materia` e mesclado (o botao IG_PUBLICAR so controla o Instagram). A rotina das 04:00 de 27/10 ja deve gerar a primeira. Falta: N6 (Search Console, com o Andre: `docs/ETAPA-NOTICIAS-SITE.md`), ligar evento-chave e dimensoes no GA4 (`docs/ANALYTICS.md`), conferir a 1a noticia real (texto, fatos, capa).

**Foto:** curadoria pronta (`node insta-terra-gentil/imagem/curar-cli.mjs "Especie"`), automatico de reserva; falta curar as especies que importam.

**BOTAO:** variavel do repo `IG_PUBLICAR` (hoje `desligado`). So `ligado` posta. `gh variable set IG_PUBLICAR --body ligado`.

**Meta (feito 26/10 noite):** app `Terra Gentil Publicador` (ID 1671676171195897, modo desenvolvimento, portfolio Terra Gentil, e-mail canalterragentil@gmail.com). Permissoes `instagram_business_basic` e `instagram_business_content_publish`. @canalterragentil e Testador do Instagram (convite aceito). IG_USER_ID 17841474413071263. Secrets `IG_USER_ID` e `IG_ACCESS_TOKEN` cadastrados e VALIDADOS (run 40413778021, `so_token`, "token e conta conferidos, nada publicado"). Publicacao real ainda NAO testada (decisao: ajustar na hora de postar). Token vale 60 dias (gerado 26/10, vence ~25/12). Cadastrar secret: `gh secret set` com `!` grava VAZIO (sem stdin); usar `powershell -NoProfile -Command "Get-Clipboard" | gh secret set NOME --repo terra-gentil/terra-gentil`.

**Falta para postar de verdade (Fase B/C):** (3) cadastrar gatilho no TriggerAll para `postar-instagram.yml` no horario de postar; (4) renovacao do token: workflow `renovar-token-instagram.yml` PRONTO (dias 1 e 15), secret `GH_PAT_SEGREDOS` CADASTRADO 26/10 (PAT fine-grained, Secrets read/write, so este repo, vence 25/10/2027, renovar ate la). FALTA testar: rodar o workflow a mao a partir de 27/10 (Meta exige token com mais de 24h) e conferir que a data do secret IG_ACCESS_TOKEN muda; (5) previa e aprovacao no Telegram antes de ligar; (6) CI do site vermelho por lint em app/app/page.tsx e app/jogo/page.tsx (nao relacionado).

---

## HANDOFF (26/10/2026, noite): colar no inicio da proxima sessao

**Onde paramos:** o pipeline do Instagram do Terra Gentil funciona de ponta a ponta, SEM publicar no Instagram. Teste real feito: a rotina (`trig_01BH4izGfvqgUA9V7hmgMPVR`, 04:00 BRT) escreveu o post de 27/10 (livro CODIGO, serie Socorro, 6 fatos com pagina), empurrou a branch `claude/insta-routine-20261026-1913`, o webhook acionou o TriggerAll (gatilho #014), que disparou o `publish-instagram.yml` (run 40384815084): validou, mesclou na main (commit e0181cf, bot do GitHub) e gerou a previa (artefato `carrossel-2026-10-27`, 8 MB). A Vercel aceitou o commit do bot (risco da etapa de noticias nao se confirmou).

**Decisoes:** sem API paga, texto por rotina agendada do Claude (como no Pearl Jam); fato so com pagina e trecho literal conferido no livro; foto so CC0/CC BY; repo publico, entao o validador do ramo so aceita a conta claude e so `dados/posts` e `dados/rotina-log`; prefixo `claude/insta-routine-` (TriggerAll ajustado, 1c61803).

**Proximo passo exato:** (1) Andre confere a previa (baixar o artefato do run 40384815084) e o texto de `dados/posts/2026-10-27-codigo.json`; o campo `nome` saiu generico ("planta"), ajustar `pauta/routine-prompt.md` para exigir o nome popular da planta se quiser; (2) decidir a foto (lista curada em `dados/fotos.json` ou automatico); (3) etapa de noticias no site com SEO e GA4, comecando pela N1 (campo `materia`), plano em `docs/ETAPA-NOTICIAS-SITE.md`; (4) previa no Telegram e publicacao pela Graph API (nao existe hoje).

**Arquivos chave:** `insta-terra-gentil/pauta/routine-prompt.md` e `pauta/prompts/voz-terra-gentil.md` (prompt da rotina), `pauta/rotina-cli.mjs`, `publicar/rotina/mesclar-cli.mjs`, `.github/workflows/publish-instagram.yml`, `C:/Gitlab_hz/triggerall/backend/src/routes/webhooks.js`.

**Comando:** `cd C:Gitlab_hz	erra-gentil-site	erra-gentil && claude`

---

## Sessao 2026-10-26 (tarde: pauta por RSS e banco de imagem)

### O que foi feito
1. Pexels: a emissao de chave nova da API esta PAUSADA ("New API key issuance is currently paused"). Trocamos por Wikimedia Commons (sem chave).
2. `pauta/feed.mjs`, `coletar.mjs`, `filtrar.mjs`: le o RSS das fontes e filtra (14 dias, sem repetir, so dominio da lista). Guarda so titulo, link, data e categorias, nunca o texto. Testado na rede: 80 itens, 60 apos o filtro. 4 das 7 fontes tem feed (campo `feed` em `dados/fontes-noticias.json`). RHS e Gardenary dao 404; Backyard Gardener esta atras de Cloudflare (nao contornar).
3. `imagem/commons.mjs`, `escolher.mjs`, `banco.mjs` (+ README): `buscarFoto(especie)` devolve a melhor foto vertical 1080+ com credito. Provedor e uma funcao `(termo) => candidatos`, entao Pixabay/Unsplash entram depois sem mexer no resto.
4. Banco reserva: `imagem/openverse.mjs` (Openverse, sem chave, mais iNaturalist e Flickr). `banco.mjs` tenta Commons primeiro e so cai no reserva se nao achar foto segura. Credito agora cita a fonte real. Limites do Openverse anonimo: page_size ate 20, 20/min, 200/dia, latencia de 0,1 a 45 s (prazo de 60 s).
5. `imagem/baixar.mjs` (baixa a foto e grava o credito) e filtro de titulo/categoria contra flor, fruto e ilustracao. Renderizadas 5 capas de exemplo com fotos reais nos moldes: 2 boas (jiboia, espada-de-sao-jorge), 3 fracas (folha seca de monstera, lirio-da-paz so com o espadice, manjericao no mato).
6. Descoberta: nome de espécie longo (espada-de-sao-jorge) quebra em 3 linhas no molde jornal e empurra o rodape para fora do slide. Tratar no montar-dia.
7. `carrossel/montar-dia.mjs` + `cli.mjs`, `estrutura.mjs`, `foto-do-dia.mjs`, `legenda.mjs`, `estouro.mjs`: de um roteiro de 8 slides sai o carrossel inteiro (PNG 1080x1350, legenda, ficha) em 10 s. Rodado de verdade com foto da rede: `node carrossel/cli.mjs dados/post-exemplo.json 2026-10-26`. A checagem de estouro pegou o rodape cortado do molde jornal com "espada-de-sao-jorge". Estrutura assumida: capa, problema x3, passo x2, problema, final (constante em `estrutura.mjs`).
8. DECISAO: NADA de API paga do Claude. O texto e escrito por uma ROTINA AGENDADA do Claude (claude.ai/code/routines), igual ao site do Pearl Jam (setlists-pj-ev). Removi o SDK e o ideia.mjs por API. Desenho copiado do Pearl Jam: a rotina na nuvem so escreve TEXTO (JSON) numa branch `claude/insta-routine-AAAAMMDD-HHMM` (sandbox sem segredos e com rede restrita, push em main bloqueado); o GitHub avisa o TriggerAll (webhook), que dispara o workflow que valida e mescla; foto, render e publicacao rodam no GitHub Actions. O prompt da rotina mora no repo: `pauta/routine-prompt.md` (editar o arquivo ja muda a rotina; a rotina so precisa de um prompt curto mandando segui-lo). Voz em `pauta/prompts/voz-terra-gentil.md`.
9. Os 19 ebooks viraram texto por pagina em `dados/livros/*.txt` (620 KB, pdftotext), porque o sandbox nao le PDF de 15 MB. Cada fato do post leva `pagina` + `trecho` literal do livro, e o CODIGO confere se o trecho existe naquela pagina (`pauta/livros.mjs`, `fatos.mjs`). Isso barra fato inventado de forma mecanica. Toxicidade/pet recusados ate haver fonte ASPCA/Sinitox verificavel.
10. `pauta/rotina-cli.mjs` (comandos da rotina): `proximo` (livro do rodizio + dia, `jaTem`), `ler <PALAVRA>` (livro com marcador de pagina), `gravar <bruto.json> --dia` (confere e grava em `dados/posts/`), `conferir` (refaz a checagem de todos os posts, pega arquivo editado a mao), `livros` (extrai PDFs). `roteiro.mjs` (`conferirPost`, `montarPost`), `proxima.mjs` (rodizio justo, dia = amanha BRT). Testado num clone limpo sem node_modules (a rotina roda Node puro).
11. `publicar/rotina/validar.mjs`: validacao do ramo da rotina, repo PUBLICO: so commit da conta `claude` (e `terra-gentil`), so arquivos .json em `dados/posts/` e `dados/rotina-log/`, ate 10 arquivos. Funcao pura testada. O workflow que usa isso ainda NAO existe.
12. `dados/bruto-exemplo.json` (formato do que a rotina escreve, 7 fatos reais do ebook da jiboia com pagina e trecho) e `dados/post-exemplo.json`.
13. 110 testes em `npm --prefix insta-terra-gentil test`, incluindo um que impede o prompt da rotina e o guia de voz de divergirem do codigo (limites, series, prefixo de branch, pastas).

### Como o TriggerAll funciona (lido em C:/Gitlab_hz/triggerall, 26/10)
- Gatilho = `{ name, type: "github_workflow", config: { owner, repo, workflow_id, ref, token_env, inputs }, schedule (cron UTC), on_success_trigger_id }`, cadastrado no painel (login com senha). Ele mesmo dispara o workflow no horario, por isso os workflows nao tem `schedule` no YAML.
- `POST /webhooks/github` (assinado com HMAC, segredo `GITHUB_WEBHOOK_SECRET` no Railway): em `push` na ref `refs/heads/claude/news-routine-*` dispara na hora o gatilho cujo `config.repo` = nome do repo e `config.workflow_id` = `publish-instagram.yml`. Isso esta FIXO no codigo (webhooks.js).
- Ao fim de um workflow (`workflow_run` completed) registra o resultado e encadeia `on_success_trigger_id`. Dedup de 3 min.
- Para o Terra Gentil funcionar: (a) o prefixo `claude/insta-routine-` precisa ser aceito (3 linhas em webhooks.js, hoje so `claude/news-routine-`); (b) webhook do GitHub no repo terra-gentil/terra-gentil apontando para o Railway, com o mesmo segredo; (c) um gatilho com `repo: "terra-gentil"` e `workflow_id: "publish-instagram.yml"`; (d) o PAT do Railway (`token_env`) precisa de acesso a Actions do repo da org terra-gentil (hoje e conta andrehz4).

### Estado atual (fim de 26/10)
- Funcionam e estao testadas: pauta por RSS, busca/download de foto, `montar-dia`, e o lado do repo da rotina (CLI, conferencia dos fatos contra o livro, validador do ramo, orquestracao do merge).
- Merge da rotina testado de ponta a ponta com git de verdade num remoto local (so o `gh` simulado): ramo bom entra e a branch e apagada; commit de outra conta, diff que mexe em codigo e post adulterado sao RECUSADOS e a main fica intacta.
- `.github/workflows/publish-instagram.yml` criado (so `workflow_dispatch`): job 1 valida e mescla, job 2 renderiza o post do dia e guarda os 8 PNGs e a legenda como artefato. YAML validado, mas NAO executado no GitHub ainda. Publicacao no Instagram ainda nao existe.
- Ligacao fechada: webhook + gatilho #014 + token funcionando (ver Proximo passo 1). Falta so a rotina rodar de verdade (primeira 27/10 04:08 BRT, ou rodar agora para testar tudo).
- TriggerAll (repo terra-gentil/triggerall): `webhooks.js` agora aceita `claude/insta-routine-*` alem de `claude/news-routine-*`, 2 testes novos, 9/9 passando, push feito (1c61803). Railway deve redeployar sozinho.
- ROTINA CRIADA no claude.ai: `trig_01BH4izGfvqgUA9V7hmgMPVR` (https://claude.ai/code/routines/trig_01BH4izGfvqgUA9V7hmgMPVR), todo dia 07:00 UTC = 04:00 BRT, claude-sonnet-5-5, so o repo terra-gentil/terra-gentil, SEM conectores (o servidor anexou Gmail, Drive e Docs sozinho; removi). Primeira execucao: 27/10 as 04:08 BRT. Ela empurra uma branch `claude/insta-routine-*`; enquanto o webhook e o gatilho do TriggerAll nao existirem, a branch fica esperando (o workflow pode ser disparado a mao: `gh workflow run publish-instagram.yml`).
- Licenca de foto: padrao aceita so CC0, dominio publico e CC BY. CC BY-SA fica FORA.

### Proximo passo
1. (FEITO em 26/10, junto com o Andre) Webhook no repo terra-gentil/terra-gentil apontando para `https://triggerall-production.up.railway.app/api/webhooks/github`, eventos push e workflow_run, mesmo segredo do Railway: "Last delivery was successful". Gatilho #014 "Terra Gentil: Publish Instagram" criado no painel (https://triggerall.vercel.app), owner/repo terra-gentil, workflow `publish-instagram.yml`, ref main, token pela variavel `GITHUB_ACTION` (o token ja tem acesso ao repo da org). Teste real: "Disparar agora" no painel dispara o workflow no GitHub e o run 40384341133 terminou em sucesso (mesclar ok; previa pulou a instalacao do Chromium por nao haver post).
2. (feito) Rotina criada. Opcional: rodar agora para testar tudo de ponta a ponta (rotina, branch, workflow, merge) sem esperar as 04:00.
3. ETAPA NOVA, pedida pelo Andre: noticias no site com SEO e GA4, no mesmo momento do Instagram. Plano completo em `docs/ETAPA-NOTICIAS-SITE.md` (N1 a N6). Risco principal: Vercel pode bloquear o deploy do commit do bot.
4. Andre decide a foto: lista curada por especie em `dados/fotos.json` (vazio hoje) ou automatico com conferencia na previa.
5. Previa no Telegram e publicacao na Graph API (depois do workflow rodar de verdade).
6. Noticias do RSS como segunda fonte de pauta (a rotina le `_pending` como no Pearl Jam).
7. Opcional: Pixabay ou Unsplash como segundo provedor quando houver chave.

## Sessao 2026-10-26 (insta-terra-gentil: carrossel a partir de noticias)

### O que foi feito
1. Merge da branch `claude/terra-gentil-spec-ftbfjs` (Fase 0 do `insta-terra-gentil/`) e pull dos commits de SEO. Handle oficial do Instagram: `@canalterragentil`.
2. Noticias de jardinagem como fonte de pauta (`pauta/noticias.mjs`, `dados/fontes-noticias.json`, 7 sites do PDF News Pipeline). Notícia só dá tema e link, o texto do post é escrito do zero. Scraper ainda NAO existe.
3. 7 moldes de carrossel feitos no Claude Design (nunca no Canva), um por dia da semana: manchete (seg), faixas, album, duotom, jornal, galeria, lambe (dom). Canvas: https://claude.ai/artifact/FJXw7ec78smT31KsoGf9sm. Fundo = foto real da planta de banco gratuito com escurecimento. Mascote fora das capas.
4. Código em `carrossel/`: `rotacao.mjs` (molde do dia, fuso de Brasília), `contrato.mjs` (campos por tipo de slide), `moldes.mjs` + `moldes/<molde>/{capa,problema,passo,final}.dc.html`, `dc/` (conversor do .dc.html em HTML, estrito, com sc-if e sc-for), `render.mjs` (Playwright, PNG 1080x1350). 41 testes em `npm run test:insta`.
5. Render conferido nos 28 slides (30 s): texto por campos, foto em tela cheia, mascote em círculo, bolinhas do Álbum.

### Estado atual
- main em dia com o remoto. Moldes, conversor e render prontos e testados. Ainda não há foto de planta de verdade, nem pauta real, nem prévia.
- Local: `TG_CHROME_CANAL=chrome` usa o Chrome instalado no render. No CI nenhum teste importa o Playwright.

### Proximo passo
1. `PEXELS_API_KEY` no `.env` (o André cria em pexels.com/api) e `imagem/banco.mjs` + `imagem/escolher.mjs` (busca por espécie, vertical, 1080+ de largura, crédito do autor).
2. `montar-dia.mjs`: pauta + foto + molde do dia + render dos 8 slides (slides 3, 4 e 7 usam o tipo `problema`, o 6 usa `passo`) + `legenda.mjs`.
3. Prévia no Telegram (`aprovacao/`), fila e publicação (`publicar/`).
4. Scraper/RSS das 7 fontes (`pauta/coletar.mjs`, `feed.mjs`, `filtrar.mjs`) e `pauta/ideia.mjs` (Claude escreve os pontos do zero).

### Decisoes e pendencias
- Italico: nas direcoes F e G a palavra em italico saiu verde e creme, nas outras 5 e ambar como no site. Decidir se padroniza em ambar.
- O clone `pearljam/setlists-pj-ev` está divergente (841 locais x 4935 remotos, 287 arquivos staged): NÃO foi feito pull. Li tudo de `origin/main`.
- Canvas antigo https://claude.ai/artifact/MSoufTRqN6oUQbMMdnzfAZ (meus primeiros moldes) pode ser apagado.
- Grade semanal tem carrossel só em 4 dias, os 7 moldes podem servir também ao reel. Decidir.

## Sessao 2026-09-30 (SEO, a partir do playbook do setlists-pj-ev)

### O que foi feito
1. Diagnostico: site Next.js na Vercel, HTML completo no servidor, sitemap (27 URLs), robots, GA4 (G-4BZ68B16BK). Faltava: canonical, og:image padrao, JSON-LD na home, redirect www. Nenhuma das 4 contas do Chrome tinha o site no Search Console.
2. canonical em todas as paginas (alternates.canonical) e no post do blog.
3. Redirect 301 www.terragentil.com.br -> terragentil.com.br (next.config.ts, por host).
4. JSON-LD Organization + WebSite na home (sameAs com as constantes de YouTube, Instagram, TikTok).
5. app/opengraph-image.jpg e twitter-image.jpg (1200x630, foto do topo do site) com alt.
6. og:url fixo removido do layout (toda pagina se apresentava como a home).
7. Bug do antes e depois: arquivos transformacao-1-antes/depois trocados (o "antes" mostrava a calcada limpa).
8. Search Console: propriedade https://terragentil.com.br/ criada na conta terragentil.oficial@gmail.com; verificacao por arquivo public/google17079c3e8874a86a.html (NAO remover).

### Vistoria e correcoes A+B (30/09, tarde). Relatorio: docs/VISTORIA-SEO-2026-09-30.md
- Velocidade: gtag com lazyOnload (antes baixava 173 KB junto com a imagem principal); fontes mono e Caveat sem preload; `priority` (deprecado no Next 16) trocado por `preload`; mascote da home com fetchPriority high; miniatura do video do post com preload.
- Molde lib/seo.ts (pageMetadata): title, description, canonical, og e twitter proprios por pagina, com imagem padrao explicita.
- BreadcrumbList (components/seo/BreadcrumbJsonLd.tsx) em todas as paginas internas e posts; WebSite com alternateName.
- Titulos padronizados "Pagina · Terra Gentil"; post com mais de 60 caracteres sai sem o sufixo.
- NAO feito por decisao do Andre (visual de referencia ate o lancamento): textos vencidos, cidades inventadas, caso 2 da galeria, H1 slogans, alt das imagens, Sobre no menu.

### Search Console (lido em 30/09, conta terragentil.oficial, acessar por https://search.google.com/u/3/search-console)
- O site ja estava cadastrado em outra conta (dona do token antigo). Sitemap enviado em 08/05/2026, processado, 27 paginas.
- 16 meses: 66 cliques, 774 impressoes, CTR 8,5%, posicao 5,5. Consultas quase so de marca ("terra gentil", "resgate gentil").
- Indexadas: 8. Nao indexadas: 26 (15 rastreadas e descartadas, 6 com 404, 5 redirecionamentos).
- Posts do blog descartados tem 250 a 350 palavras: conteudo fino. Paginas de historia precisam de 800+ palavras.
- Inspecao de URL: o link direto /inspect da 404 e a busca do topo nao abriu nesta sessao. Pedir indexacao no lancamento.

### Pendencias
- Caso 2 de /transformacoes: as duas fotos sao de lugares diferentes (nao e antes e depois). Andre decide.
- CITIES e duracao em app/transformacoes/page.tsx sao inventadas pelo codigo (Sao Paulo, Recife...). Trocar por dado real ou remover.
- Hero da home diz "Ao vivo no YouTube, novo video toda semana"; canal parado desde 02/2026.
- og:title/description das paginas internas herdam os da home (so afeta previa social).
- Lint ja falhava antes desta sessao: aspas sem escape em app/app/page.tsx e variaveis sem uso em app/jogo/page.tsx.
- Trocar YOUTUBE_URL/YOUTUBE_CHANNEL_ID para o canal novo quando o @TerraGentil migrar (~12/10).
- Etapa 3: paginas por historia (/historias/<slug>) junto com o lancamento dos videos novos.

## Sessao 2026-05-16

### O que foi feito

1. **Upgrade visual completo /app e /jogo** a partir de bundle Claude Design (sessao anterior + continuacao)

   **Pagina /app (reescrita total):**
   - Hero fundo claro (PAPER), mascote pose-1.jpg, blobs decorativos, stats 21 campos/600+ especies/19 ebooks
   - Secao "3 passos" com cards numerados (01 Aponta, 02 Gemini, 03 Diagnostico)
   - Diagnostico real: phone frame inline com Dieffenbachia + grid de 21 campos do schema
   - 9 features em grid 3 colunas + banner "100% gratis pra sempre"
   - Phone interativo via `AppPhoneClient.tsx` (client component): 4 telas (Home, Diagnose, Community, Profile) + TabBar com 5 abas e FAB camera
   - Secao Pixel Garden: swatches de cor + botoes chunky estilo Duolingo
   - Stack + Sprints: 3 cards (Backend/Mobile/Lancamento) + historico de sprints com indicador atual
   - CTA newsletter: card verde escuro com mascote gift.jpg

   **Pagina /jogo (reescrita total):**
   - Hero: titulo "Cortar. Resgatar. Repetir.", image title_bg.png, stats 10 fases/50 ranking/0 anuncios
   - Gameplay preview dark: `GamePreviewClient` (grade 20x11 tiles, sprite animado, HUD, D-Pad), legenda dos 4 tiles, cards do personagem e barril
   - 6 features: 10 fases progressivas, Ranking global, Modo pratica, Modo olhos cansados, SFX Web Audio, Roda em qualquer lugar
   - Ranking mock: tabela 7 jogadores com medalhas, anti-cheat card
   - Creditos: Shiru + Lawn Mower NES + tabela de creditos
   - CTA final: gradiente verde, tile_tall.png como pattern de fundo, "Bora jogar?"

   **Novos arquivos:**
   - `app/app/AppPhoneClient.tsx` (client component, ~460 linhas)
   - `app/jogo/GamePreviewClient.tsx` (client component, ~110 linhas)
   - `public/images/game/`: fuel_barrel.png, gentileza.png, tile_cut/tall/flowers/stone.png, title_bg.png
   - `public/images/mascot/gift.jpg`, `analyzing.jpg`
   - `public/images/app-icon.png`

   **Ajustes:**
   - `@keyframes gentileza-walk` e `fadeUp` adicionados no globals.css
   - Tipo `SPRINTS` corrigido para `current?: boolean` (TypeScript fix)
   - Build limpo: 35 paginas geradas, 0 erros de tipo

   Commit: `cae7401`, push em producao.

### Estado atual

Site live em https://terragentil.com.br com /app e /jogo completamente redesenhados.
/app e /jogo estao estaticas (SSG), build limpo.

### Proximo passo (PENDENTE, nao iniciado)

**Varredura mobile de TODAS as paginas.** /instagram foi auditada na sessao anterior.
O resto (home, /doutor, /guias, /videos, /transformacoes, /manifesto, /app (nova), /jogo (nova),
/sobre, /blog, /equipamentos) precisa da auditoria de layout mobile:
overflow, fonte estourando, espacamento, blobs decorativos, grids colapsando.
As novas secoes de /app e /jogo usam inline-style grids sem media queries, prioridade alta.

### Blockers / lembretes

- Token Instagram expira ~2026-07-14. Rotina de refresh agendada em 2026-07-10.
- Grids inline-style das novas paginas (/app e /jogo) precisam de media query mobile (ainda sem `@media`).
- `app/jogo/JogoMockClient.tsx` esta obsoleto (substituido por `GamePreviewClient`), pode ser removido depois.

### Arquivos chave

- `app/app/page.tsx` + `app/app/AppPhoneClient.tsx` (nova pagina /app)
- `app/jogo/page.tsx` + `app/jogo/GamePreviewClient.tsx` (nova pagina /jogo)
- `app/globals.css` (animacoes gentileza-walk, fadeUp no fim)
- `public/images/game/` (assets do jogo)
- `lib/instagram.ts`, `components/sections/instagram/` (contexto sessao anterior)

---

## Sessao 2026-05-15

### O que foi feito (em ordem)

1. **Instagram ao vivo via Graph API** (pendencia #4 do backlog, FEITA)
   - `INSTAGRAM_ACCESS_TOKEN` (long-lived 60d, app `terragentilleitura-IG`,
     Instagram app ID `2059886428073049`, conta `canalterragentil`) setado em
     Production na Vercel, Encrypted/Sensitive.
   - `INSTAGRAM_APP_TOKEN` (app secret) tinha sido criado por engano, Andre
     removeu. O site nunca usa client_secret em runtime, nao recriar.
   - Validado em prod: feed real do @canalterragentil, 0 fallback.
   - Commit `4832021` (doc).

2. **Redesign da /instagram** a partir de bundle do Claude Design
   - Novo modulo `components/sections/instagram/`: `patterns.tsx` (13 SVGs
     botanicos, fallback), `data.ts` (tons/KINDS/helpers + mapeamento pra
     `IgTile`), `InstagramTile.tsx` (client, `<img>` real do CDN com fallback
     pro pattern no onError), `InstagramExperience.tsx` (client, header de
     perfil + filtro por tipo + grid mosaico + load more + CTA + marquee).
   - `app/instagram/page.tsx` virou server component: `fetchInstagramMedia(24)`
     + novo `fetchInstagramProfile()` em `lib/instagram.ts` (followers/media/
     follows + avatar reais, so o que a API da, zero metrica fake).
   - Home (`components/sections/Instagram.tsx`) harmonizada com o mesmo tile.
   - CSS namespaced em `.igx` no fim do `globals.css`.
   - Decisoes do Andre: foto real + link pro post, so metrica real, escopo
     /instagram + home, accent ambar travado, sem painel de tweaks.
   - Stories (destaques) removido a pedido do Andre.
   - Commits `382bd4c` (redesign) e `f63c837` (fix do gap apos remover Stories).

3. **Fase 1, scroll-to-content** (commit `de5703e`)
   - Cada secao da home com "ver mais" aponta pra `/pagina#conteudo`.
   - 8 paginas internas (/doutor, /videos, /guias, /app, /jogo, /manifesto,
     /transformacoes, /instagram) ganharam ancora `#conteudo` logo apos o
     heroi, com classe `.jump-anchor` (`scroll-margin-top: 88px`).
   - Salto nativo instantaneo, sem JS. Home nao afetada (decisao do Andre).

4. **Fase 2, fixes de layout mobile na /instagram** (commit `3962cdb`)
   - `overflow-x: clip` no `.igx` (blobs do hero nao geram mais scroll
     horizontal no mobile).
   - `.igx-title` com clamp menor abaixo de 600px (nao estoura a borda).
   - Botoes do perfil empilham em coluna no celular.

5. **Rotina agendada de refresh do token** criada (claude.ai routines)
   - ID `trig_01Crw16WQ4TepNBozy7wHHuV`, execucao unica
     **2026-07-10 12:00 UTC** (09:00 BRT).
   - Faz lembrete + diagnostico de prod (detecta se feed esta ao vivo ou caiu
     no fallback) + passo-a-passo do refresh. NAO faz o refresh sozinho
     (sandbox sem token/Vercel).
   - Painel: https://claude.ai/code/routines/trig_01Crw16WQ4TepNBozy7wHHuV

### Estado atual

Tudo acima esta em producao e validado (type-check, lint, build limpos em
cada passo; deploys automaticos via push na main). Site live em
https://terragentil.com.br.

### Proximo passo (PENDENTE, nao iniciado)

**Fase 2 completa: varredura mobile de TODAS as paginas.** Nesta sessao so a
/instagram foi auditada (codigo mais novo). O resto (`home`, `/doutor`,
`/guias`, `/videos`, `/transformacoes`, `/manifesto`, `/app`, `/jogo`,
`/sobre`, `/blog`, `/equipamentos`) precisa da mesma auditoria de layout
mobile (overflow, fonte estourando, espacamento, blobs decorativos), no
mesmo modelo do que foi feito (achar e arrumar). Limitacao: auditoria e
via CSS/markup, sem render de device real.

### Blockers / lembretes

- **Token Instagram expira ~2026-07-14.** A rotina agendada dispara em
  2026-07-10 como lembrete. Se passar disso sem refresh, o site cai no
  fallback de patterns silenciosamente (loga `instagram_token_expired`).
  Comando de refresh com token ainda valido:
  `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=TOKEN_ATUAL`
- Sem outros blockers. CI verde, prod estavel.

### Arquivos chave

- `lib/instagram.ts` (fetchInstagramMedia + fetchInstagramProfile)
- `components/sections/instagram/` (modulo novo do redesign)
- `app/instagram/page.tsx`, `components/sections/Instagram.tsx`
- `app/globals.css` (bloco `.igx` no fim + `.jump-anchor`)
- 8 paginas com ancora `#conteudo`; 9 links da home com `#conteudo`
- `HANDOFF.md` (contexto historico completo, pendencia #4)

---

## HANDOFF (colar no inicio da proxima sessao)

Onde paramos: redesign da /instagram + scroll-to-content + fixes mobile da
/instagram estao em prod e validados. Rotina de refresh do token agendada.

Decisoes desta sessao: Stories fora; foto real + link; so metrica real da
API; accent ambar; scroll-to-content so nos "ver mais" da home com salto
nativo; auditoria mobile via CSS/markup (sem device).

Proximo passo exato: auditoria de layout mobile das paginas que faltam
(home, /doutor, /guias, /videos, /transformacoes, /manifesto, /app, /jogo,
/sobre, /blog, /equipamentos), achar e arrumar no mesmo padrao da
/instagram (overflow, fonte, espacamento). /instagram ja feita.

Arquivos chave: `app/globals.css` (media queries por pagina),
`components/sections/*`, `app/*/page.tsx`. Contexto em `PROGRESSO.md` e
`HANDOFF.md` (pendencia #4 = Instagram).

Comando pra continuar:
`cd C:\Gitlab_hz\terra-gentil-site\terra-gentil && claude`
Depois: "le o PROGRESSO.md e continua a varredura mobile das paginas
restantes".

