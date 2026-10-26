# PROGRESSO Terra Gentil

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

### Como o TriggerAll funciona (lido em C:Gitlab_hz	riggerall, 26/10)
- Gatilho = `{ name, type: "github_workflow", config: { owner, repo, workflow_id, ref, token_env, inputs }, schedule (cron UTC), on_success_trigger_id }`, cadastrado no painel (login com senha). Ele mesmo dispara o workflow no horario, por isso os workflows nao tem `schedule` no YAML.
- `POST /webhooks/github` (assinado com HMAC, segredo `GITHUB_WEBHOOK_SECRET` no Railway): em `push` na ref `refs/heads/claude/news-routine-*` dispara na hora o gatilho cujo `config.repo` = nome do repo e `config.workflow_id` = `publish-instagram.yml`. Isso esta FIXO no codigo (webhooks.js).
- Ao fim de um workflow (`workflow_run` completed) registra o resultado e encadeia `on_success_trigger_id`. Dedup de 3 min.
- Para o Terra Gentil funcionar: (a) o prefixo `claude/insta-routine-` precisa ser aceito (3 linhas em webhooks.js, hoje so `claude/news-routine-`); (b) webhook do GitHub no repo terra-gentil/terra-gentil apontando para o Railway, com o mesmo segredo; (c) um gatilho com `repo: "terra-gentil"` e `workflow_id: "publish-instagram.yml"`; (d) o PAT do Railway (`token_env`) precisa de acesso a Actions do repo da org terra-gentil (hoje e conta andrehz4).

### Estado atual
- Funcionam e estao testadas: pauta por RSS, busca/download de foto, `montar-dia` (roteiro de 8 slides vira PNGs + legenda), e agora o lado do repo da rotina (CLI, conferencia dos fatos, validador do ramo).
- NAO existe ainda: o workflow `publish-instagram.yml` (merge validado + render + previa + publicacao), a rotina criada no claude.ai, o webhook e o gatilho no TriggerAll.
- Licenca de foto: padrao aceita so CC0, dominio publico e CC BY. CC BY-SA fica FORA. Com 50 resultados sobram 2 a 6 fotos seguras por especie comum.

### Proximo passo
1. Andre decide o prefixo da branch: (A) ajustar o TriggerAll para aceitar `claude/insta-routine-` (recomendado) ou (B) usar `claude/news-routine-` sem mexer no TriggerAll.
2. Workflow `.github/workflows/publish-instagram.yml`, so `workflow_dispatch`: passo 1 valida e mescla o ramo (`validar.mjs` + `conferir`), passo 2 renderiza o post do dia (foto + `montar-dia`), passo 3 manda a previa no Telegram. Publicacao no Instagram depois.
3. Andre: webhook no repo, gatilho no TriggerAll, PAT com acesso ao repo da org, e criar a rotina no claude.ai com o prompt curto (horario a combinar, sugestao 04:00 BRT).
4. Andre decide a foto: lista curada por especie em `dados/fotos.json` (vazio hoje) ou automatico com conferencia na previa.
5. Noticias do RSS como segunda fonte de pauta (a rotina le `_pending` como no Pearl Jam).
6. Opcional: Pixabay ou Unsplash como segundo provedor quando houver chave.
ntil

## Sessao 2026-10-26 (tarde: pauta por RSS e banco de imagem)

### O que foi feito
1. Pexels: a emissao de chave nova da API esta PAUSADA ("New API key issuance is currently paused"). Trocamos por Wikimedia Commons (sem chave).
2. `pauta/feed.mjs`, `coletar.mjs`, `filtrar.mjs`: le o RSS das fontes e filtra (14 dias, sem repetir, so dominio da lista). Guarda so titulo, link, data e categorias, nunca o texto. Testado na rede: 80 itens, 60 apos o filtro. 4 das 7 fontes tem feed (campo `feed` em `dados/fontes-noticias.json`). RHS e Gardenary dao 404; Backyard Gardener esta atras de Cloudflare (nao contornar).
3. `imagem/commons.mjs`, `escolher.mjs`, `banco.mjs` (+ README): `buscarFoto(especie)` devolve a melhor foto vertical 1080+ com credito. Provedor e uma funcao `(termo) => candidatos`, entao Pixabay/Unsplash entram depois sem mexer no resto.
4. Banco reserva: `imagem/openverse.mjs` (Openverse, sem chave, mais iNaturalist e Flickr). `banco.mjs` tenta Commons primeiro e so cai no reserva se nao achar foto segura. Credito agora cita a fonte real. Limites do Openverse anonimo: page_size ate 20, 20/min, 200/dia, latencia de 0,1 a 45 s (prazo de 60 s).
5. `imagem/baixar.mjs` (baixa a foto e grava o credito) e filtro de titulo/categoria contra flor, fruto e ilustracao. Renderizadas 5 capas de exemplo com fotos reais nos moldes: 2 boas (jiboia, espada-de-sao-jorge), 3 fracas (folha seca de monstera, lirio-da-paz so com o espadice, manjericao no mato).
6. Descoberta: nome de espécie longo (espada-de-sao-jorge) quebra em 3 linhas no molde jornal e empurra o rodape para fora do slide. Tratar no montar-dia.
7. `carrossel/montar-dia.mjs` + `cli.mjs`, `estrutura.mjs`, `foto-do-dia.mjs`, `legenda.mjs`, `estouro.mjs`: de um roteiro de 8 slides sai o carrossel inteiro (PNG 1080x1350, legenda, ficha) em 10 s. Rodado de verdade com foto da rede: `node carrossel/cli.mjs dados/post-exemplo.json 2026-10-26`. A checagem de estouro pegou o rodape cortado do molde jornal com "espada-de-sao-jorge". Estrutura assumida: capa, problema x3, passo x2, problema, final (constante em `estrutura.mjs`).
8. `pauta/ideia.mjs` (+ `esquema.mjs`, `prompt.mjs`, `ideia-cli.mjs`): o Claude escreve o roteiro de 8 slides, o gancho e o resumo a partir de FATOS com fonte. SDK oficial `@anthropic-ai/sdk`, modelo `claude-opus-5-5`, saida estruturada em JSON Schema, fallback automatico de recusa (`fallbacks: "default"`, beta server-side-fallback-2026-07-01) ligado por padrao. Regras no codigo: so os fatos numerados, toxicidade/pet so com fonte ASPCA ou Sinitox, travessao proibido, limite de caracteres por campo (`LIMITES_TEXTO`), fechamento "Gentileza gera gentileza" fixo no codigo, `fatosUsados` rastreia a fonte. Sem chave, a CLI desliga com mensagem. NAO rodado com o modelo de verdade: falta `ANTHROPIC_API_KEY` (testado com cliente simulado).
9. `dados/pauta-exemplo.json`: 8 fatos REAIS do ebook da jiboia, com pagina (extraidos com pdftotext). `dados/post-exemplo.json` reescrito so com esses fatos (o antigo tinha conselho que nao estava no livro). Renderizado nos moldes manchete, jornal e lambe sem estouro.
10. 95 testes em `npm --prefix insta-terra-gentil test`.

### Estado atual
- Pauta por RSS e busca de foto funcionam, ainda nao ligadas entre si nem ao `montar-dia.mjs`.
- Licenca: padrao aceita so CC0, dominio publico e CC BY. CC BY-SA fica FORA (escurecer e por texto na foto e adaptacao, a licenca exigiria publicar o slide em BY-SA). Com 50 resultados sobram 2 a 6 fotos seguras por especie comum (jiboia 6, lirio-da-paz 6, monstera 4, manjericao 2). Com BY-SA seriam 24 a 34.
- Falta baixar a foto para disco (hoje so devolve a URL de 1600 px).

### Proximo passo
1. Andre decide: manter so CC0/CC BY (mais seguro, menos fotos) ou aceitar CC BY-SA e publicar o credito com a licenca.
2. Escolha de foto: lista curada por especie (as 19 dos ebooks) em `dados/fotos.json` (hoje vazio, o `montar-dia` ja le), banco automatico so como reserva, ou 3 candidatas na previa. Decisao do Andre.
3. `pauta/ideia.mjs`: Claude escreve o roteiro de 8 slides do zero (formato de `dados/post-exemplo.json`) a partir da pauta, so com fato que tenha fonte.
4. Previa no Telegram (`aprovacao/`), fila e publicacao (`publicar/`).
6. Opcional: Pixabay ou Unsplash como segundo provedor quando houver chave.

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
