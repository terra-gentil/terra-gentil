# Handoff Terra Gentil - 2026-05-09 (atualizado pos-DoctorScanner + ebooks locais)

## Estado atual

Site LIVE em https://terragentil.com.br substituindo o WordPress velho do Hostinger.

### Sessao 2026-05-15 (Instagram feed ao vivo)

Ativado o feed real do Instagram via Graph API (pendencia #4 do backlog). Era so
setar `INSTAGRAM_ACCESS_TOKEN` na Vercel (long-lived 60d, app `terragentilleitura-IG`)
e redeploy. Home e `/instagram` agora mostram posts reais auto-atualizando 1/1h.
Detalhes completos e a manutencao critica de refresh (antes de 2026-07-14) na
pendencia #4 abaixo, agora marcada FEITO.

### Sessao 2026-05-09 (DoctorScanner + Hero polaroides + ebooks locais)

Mudancas feitas em ordem cronologica nessa sessao:

1. **Substituicao do motor do Doutor** (commit `0362952`): `/api/diagnose` deixou de chamar Gemini direto e virou proxy fino pro backend Railway (`https://terra-gentil-app-production.up.railway.app/v1/diagnostico`). Mesmo motor do app mobile, prompt centralizado em um repo so. Removeu dep `@google/generative-ai`. `lib/diagnose-mapper.ts` parseia 21 campos backend → schema `Diagnosis` (camelCase). Tipo `Diagnosis` ganhou `extras` com confianca, estado_saude, qualidade da foto, problemas detectados, plano longo, retorno. `PlantDoctor` aceita `variant: 'compact' | 'full'` - full mostra badges + plan rico em `/doutor`.
2. **Logo abaixo do titulo** (`b5c3717`): em `/manifesto` e `/transformacoes` o logo grande estava competindo com o h1 no topo. Reordenado pra eyebrow → h1 → sub → logo (variante `.tp-logo-mark--below`).
3. **Hero polaroides** (`05fdcca`): substitui mascote estatico por 3 polaroides do canal (`andre-bench`, `andre-ia`, `canal-girl`) rotacionando a cada 3.5s com mascote `wave.png` como assinatura. Fonte Caveat adicionada via next/font.
4. **Polaroides mais pra cima** (`76e2139`): pol-0/1/2 subiram de bottom 18/8/28% pra 45/32/56% pra ficarem visiveis acima do mascote (90% altura).
5. **Botoes hero do mesmo tamanho + z-index mobile** (`cdfa96f`): `.btn-yt` e `.btn-ghost` ganharam `min-width: 240px` (desktop) e `flex: 1` (mobile). Primeiro filho do `.hero-grid` ganhou `position: relative; z-index: 5` pra ficar acima das polaroides absolutas no mobile.
6. **Videos da home com fallback channel_id** (`0439abc`): RSS da playlist `PLo0P-qaOD_PSJ24_1Z5d9JbwVs2Y3oDS8` esta retornando 404. `lib/youtube.ts` tenta channel_id (`UCX3xUnHpQrhSUJUGjqMAN2A`) como fallback. `Videos.tsx` FALLBACK estatico tinha 3 IDs aleatorios, trocado pelos 3 videos mais fortes do canal real.
7. **DoctorScanner cinematografico** (`44c67b3`): novo `components/sections/DoctorScanner.tsx` com animacao 11s em 6 fases (Camera, Scanner, Analisando, Diagnostico, Plano, Ebook) usando 8 poses do mascote como atos narrativos. CSS `.scan-stage`, `.hud-*`, `.ss-*` em globals.css. 3 exemplos rotacionando (Tomateiro/Pothos/Manjericao). Plugado: na Home substitui o PlantDoctor estatico, em `/doutor` aparece como hero animado acima do PlantDoctor real (mantem upload).
8. **Play button centralizado nos cards de video** (`c5b1260`): era `top:24px right:24px`, agora `top:50% left:50% transform:translate(-50%,-50%)`.
9. **"Como funciona" abaixo do scanner** (`6564b25`): link `see-more` saiu do `see-more-row` no fim da seccao Doutor e foi pra dentro da coluna do scanner (`.doctor-stage-col`), centralizado.
10. **Otimizacao geral de espaco** (`948c303`): paddings das sections de 120-140px → 88px (`.doctor`, `.about`, `.game`, `.ig`, `.app-promo`, `.manifesto-flow`, `.transform-section`, `.section-pad`, `.ebooks`). `.news` 100→80px. `.section-head margin-bottom` 56→40px. `.see-more-row margin-top` 48→32px. Home ~250px mais curta.
11. **Dois botoes Tirar foto / Galeria no PlantDoctor** (`567033c`): estado inicial passou de um card unico "Toque para enviar uma foto" pra dois botoes (Tirar foto verde com `capture=environment` + Galeria branco). Refs `cameraInputRef` e `galleryInputRef` separados. Estilo chunky 3D igual app mobile.
12. **Mascote newsletter sem distorcer** (`d38e0e4`): `.news-mascot` tinha `height: 60%` sem `width: auto` - agora `width: clamp(160px, 18vw, 240px); height: auto`.
13. **Biblioteca de 18 ebooks completa** (`6f04717`): `data/ebooks.ts` foi de 12 → 18 itens, sincronizado com widget WP antigo. Adicionados Guia de Luz, Hortela, Cebolinha, Jiboia, Alface, Tapete Verde. Titulos completos com subtitulo, keywords ampliadas. `Ebooks.tsx` da home dinamico com `{ebooks.length}`.
14. **PDFs e capas hospedados localmente** (`d302858`): WP antigo no Hostinger comecou a retornar 403 nos uploads. 19 PDFs (10-15MB cada) e 19 capas migrados pra `public/ebooks/` e `public/ebooks/covers/`. URLs novas: `https://terragentil.com.br/ebooks/{N}-{slug}.pdf` e `/ebooks/covers/{slug}.jpeg`. `data/ebooks.ts` aponta pra paths relativos `/ebooks/...`. Backup acessivel pelo subdominio Hostinger sem o bloqueio: `https://plum-tarsier-720506.hostingersite.com/wp-content/uploads/2025/12/`. **Repo cresceu pra ~180MB** (era 14MB no .git).

### Anteriores

- Next.js 16 + Turbopack + React 19, deploy Vercel via Git (repo `terra-gentil/terra-gentil-site`)
- DNS migrado pro Vercel mantendo email no Hostinger (MX/SPF/DKIM/DMARC/autoconfig intactos). IPs novos `216.198.79.1` (apex) + CNAME `fe90e179e6733812.vercel-dns-017.com` (www) ja aplicados no Hostinger.
- HTTPS, HSTS preload, CSP (sem unsafe-eval pos-vistoria), Permissions-Policy, X-Frame-Options ativos (`next.config.ts`)
- 301 redirects do WordPress (`/?p=N`, `/index.php`, `/feed/`, `/wp-admin/*`, `/wp-login*`, `/xmlrpc.php`, `/author/*`, `/tag/*`, `/category/*`)
- GA4 `G-4BZ68B16BK` carregando, Search Console verificado
- Sitemap submetido (21 paginas, 18 estaticas + 3 posts)
- 74 testes Vitest passando (lib + api + paginas legadas; UI nova ainda sem cobertura)
- CI no GitHub Actions: lint + type-check + test + build

### Redesign (2026-05-08)

Substituido o visual verde-puro pelo redesign Claude Design:
- **Paleta**: preto `#0B1410` + creme `#F4ECDB` + ambar `#E8A33D` (cor do logo) + verdes Terra Gentil
- **Fontes via next/font**: Archivo Black (display), Instrument Serif italic (acentos), Inter (corpo), JetBrains Mono (monoespacado)
- **Home**: 12 secoes - hero com mascote + folhas caindo, marquee, videos, doutor, app promo, manifesto em 4 atos, transformacoes, jogo, about com stats animados, ebooks (4 itens), instagram (3 tiles real), newsletter
- **Paginas dedicadas novas**: `/app`, `/doutor`, `/guias`, `/instagram`, `/manifesto`. Reescritas: `/transformacoes`, `/videos`, `/jogo`
- **Legadas mantidas**: `/blog`, `/equipamentos`, `/sobre` ganharam o nav/footer novos via layout, conteudo a redesenhar depois
- **Mascote Brotinho**: 5 PNGs em `/public/images/mascot/` (wave, trimmer, shovel, laptop, blower)
- **PlantDoctor real (Gemini API)** preservado, re-estilizado com classes `.pd-*` e embebido na secao Doutor
- **Instagram via Graph API** com fallback automatico - quando `INSTAGRAM_ACCESS_TOKEN` nao esta presente, mostra os 11 shortcodes hardcoded em `data/instagram.ts`. Todos sao iframe oficial `instagram.com/p/<x>/embed/`.
- **Mobile**: hamburger pill creme (estilo do CTA YouTube), nav com bg solido em mobile (sem mix-blend-mode), 11 fixes pos-vistoria pra paddings/proporcoes/overflow

## Pendencias

### 1. Inverter redirect www -> apex (CRITICO, nao feito ainda)

Curl em 08/05 mostrava `apex: 200, www: 200`. Ambos servem conteudo, gera duplicate content.

Acao na Vercel (Settings -> Domains):
- `terragentil.com.br` -> "Redirect to Another Domain" = **No Redirect** -> Save
- `www.terragentil.com.br` -> "Redirect to Another Domain" = **308 Permanent Redirect** -> dropdown `terragentil.com.br` -> Save

Validar:
```powershell
curl.exe -sI https://www.terragentil.com.br/ -o /dev/null -w "%{http_code} -> %{redirect_url}`n"
```
Esperado: `308 -> https://terragentil.com.br/`

### 2. Cortar plano de hosting do WordPress no Hostinger

Apos validar item 1 e confirmar email funcionando, cancelar **somente o plano de hospedagem** (mantendo dominio + email). DNS ja aponta pro Vercel, o WP nao recebe trafego ha dias.

### 3. Game `/jogo` gated, decisao de quando ligar

Estado atual: `/jogo` mostra a apresentacao rica (hero + features + catalogo + CTA "Entrar no beta"). Sem `NEXT_PUBLIC_GAME_ENABLED`, robots.txt bloqueia indexacao.

Para liberar com indexacao + CTA "Jogar agora" apontando pro jogo real:
1. Vercel -> Settings -> Environment Variables -> Add `NEXT_PUBLIC_GAME_ENABLED=true` (Production)
2. Deployments -> ultimo -> Redeploy

CSP em `next.config.ts` ja libera `frame-src` pra GitHub Pages e `connect-src` pro Railway.

Game vive em outro repo (`terra-gentil/terra-gentil-game`), pasta local em `C:\Gitlab_hz\terra-gentil-site\terra-gentil-game` (Phaser 3.90 + Vite, deploy GitHub Pages, backend FastAPI no Railway).

### 4. Instagram Graph API token (FEITO 2026-05-15, feed ao vivo)

`/instagram` (12 tiles) e a secao Instagram da home (3 tiles) agora puxam os posts
reais e recentes do `@canalterragentil` via Graph API, auto-atualizando a cada 1h
(`revalidate: 3600`). Fallback hardcoded em `data/instagram.ts` so entra se a API
falhar. Zero mudanca de codigo, a integracao em `lib/instagram.ts` ja estava pronta;
faltava so a env.

**Detalhes:**
- App correto: **`terragentilleitura-IG`**, Instagram app ID `2059886428073049`,
  conta `canalterragentil` (IG user ID `17841474413071263`). NAO e o app antigo
  `TerraGentil-IG` `27059007300453528` do handoff anterior.
- Token gerado pelo botao "Gerar token" da tela "API com login empresarial no
  Instagram" = **long-lived 60 dias** (esse fluxo nao usa o short-lived de 1h do
  Basic Display antigo).
- `INSTAGRAM_ACCESS_TOKEN` setado em Production na Vercel (Encrypted/Sensitive).
- `INSTAGRAM_APP_TOKEN` (app secret) chegou a ser criado por engano e foi removido.
  O site nunca usa client_secret em runtime, nao recriar.
- Validado em prod comparando shortcodes do HTML vs lista hardcoded: 7 dos 12 tiles
  eram shortcodes ineditos, prova de que vem da API e nao do fallback.

**MANUTENCAO CRITICA - refresh do token antes de 2026-07-14 (~60 dias):**
Token long-lived expira em ~60 dias a partir de 2026-05-15. Quando expira, a API
retorna code 190 e o site cai no fallback hardcoded silenciosamente (loga evento
`instagram_token_expired`). Pra renovar (estende +60d, fazer com token ainda valido):
```
GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<TOKEN_ATUAL>
```
Pega o `access_token` da resposta e atualiza `INSTAGRAM_ACCESS_TOKEN` na Vercel +
redeploy. Se o token ja tiver expirado, gerar novo pelo botao "Gerar token".

### 5. Newsletter (FEITO 2026-05-09, end-to-end pronta)

Integrado Resend. `components/sections/Newsletter.tsx` chama `POST /api/newsletter` com loading/error/success states + honeypot anti-bot. A rota tem Zod validation, rate limit (3/h por IP), trata duplicata como sucesso, logger estruturado. 11 testes Vitest cobrindo todos os caminhos.

**Em prod:**
- `RESEND_API_KEY` e `RESEND_SEGMENT_ID` setadas em Production na Vercel via `vercel env add`
- API key full access ativa: `re_UUTtnBnU_...`. Outras 2 (vazada e restricted) pendentes de revogacao manual em https://resend.com/api-keys
- Segment ID: `946b190e-c436-41ab-b02a-87937ababc35` (chamado "General" no dashboard)
- Dominio `send.terragentil.com.br` verificado no Resend (sa-east-1). DKIM/SPF/MX ja na Hostinger DNS, sem colidir com email principal
- 2 contatos de teste no segment (`eng.andrehz+nl-test3` e `+nl-real`), pode limpar via dashboard

**Pra mandar broadcast:**
1. Resend dashboard -> Broadcasts -> Create
2. From: qualquer@send.terragentil.com.br (ex: noticias@send.terragentil.com.br)
3. Audience: General
4. Editor visual ou HTML/MJML

### 6. Vistoria 2026-05-08 - itens nao aplicados

Aplicados nesta sprint: P1 #1 (h1 em /instagram), P2 #3 (noopener+noreferrer em todos os target=_blank), P2 #4 (CSP unsafe-eval removido), P2 #5 (newsletter integrada com Resend, ver item 5 acima).

P3 backlog:
- Mascotes PNG 750-900KB cada (4MB total no repo). Next/image otimiza ao servir mas converter pra WebP no source reduziria 70% o tamanho do repo. Comando: `cwebp -q 85 mascot/wave.png -o mascot/wave.webp`.
- SVGs inline duplicados (PlayIcon, IgIcon) em 4+ arquivos. Refatorar pra `components/ui/icons/` em sprint futura.
- Cobertura de testes UI nova zero. Adicionar smoke tests pelo menos pra Hero, PlantDoctor, BeforeAfterSlider.

## Arquivos relevantes

### Layout / chrome
- `app/layout.tsx` - next/font (4 famílias), metadataBase, GoogleAnalytics, skip link, OG/Twitter
- `app/globals.css` - design system completo (paleta, classes .nav/.hero/.video-card/.ig-tile/.ba/.pd-card etc) + media queries mobile
- `components/layout/Header.tsx` - nav fixed, mix-blend-mode em desktop, bg solido em mobile, hamburger pill
- `components/layout/Footer.tsx` - 3 colunas + QR codes
- `components/layout/BrandMark.tsx` - SVG do logo (tulipa + folhas em V)
- `components/layout/WhatsAppButton.tsx` - FAB

### Home
- `app/page.tsx` - monta as 12 secoes
- `components/sections/Hero.tsx` `Marquee.tsx` `Videos.tsx` `Doutor.tsx` `AppPromo.tsx` `Manifesto.tsx` `Transformations.tsx` `Game.tsx` `About.tsx` `Ebooks.tsx` `Instagram.tsx` `Newsletter.tsx`
- `components/sections/Leaves.tsx` - folhas caindo no hero (client only)
- `components/sections/PageHero.tsx` - hero compartilhado das paginas internas
- `components/sections/StubPage.tsx` - layout das paginas /app e /manifesto

### Paginas dedicadas
- `app/videos/page.tsx` + `VideosClient.tsx` - feed YouTube via RSS + tabs
- `app/doutor/page.tsx` + `DoutorFaq.tsx` - 4 passos + PlantDoctor real + FAQ
- `app/transformacoes/page.tsx` + `TransformacoesClient.tsx` - antes/depois + seletor
- `app/jogo/page.tsx` + `JogoMockClient.tsx` - apresentacao + mockup interativo
- `app/guias/page.tsx` + `GuiasClient.tsx` - 12 ebooks + filtro
- `app/instagram/page.tsx` - 12 tiles (11 reais + 1 placeholder)
- `app/app/page.tsx` `app/manifesto/page.tsx` - stub pages

### Logica e API
- `app/api/diagnose/route.ts` - proxy fino pro backend Railway (rate limit + Zod, sem Gemini direto)
- `lib/diagnose-mapper.ts` - parseia schema 21 campos backend → tipo Diagnosis (camelCase)
- `components/sections/DoctorScanner.tsx` - animacao cinematografica 11s 6 fases com poses do mascote
- `public/ebooks/` - 19 PDFs + capas hospedados localmente (WP antigo deu 403)
- `app/sitemap.ts` `app/robots.ts` - 21 rotas, /jogo gated
- `lib/constants.ts` - WHATSAPP_NUMBER, YOUTUBE_PLAYLIST_ID, GAME_URL, GAME_ENABLED, helpers
- `lib/instagram.ts` - Graph API fetch + parse permalink + cache
- `lib/youtube.ts` - RSS parse do canal
- `lib/rate-limit.ts` `lib/logger.ts` `lib/game.ts`
- `data/ebooks.ts` `data/transformations.ts` `data/posts.ts` `data/instagram.ts`

### UI components reusaveis
- `components/ui/BeforeAfterSlider.tsx` - slider drag, a11y (role=slider + keyboard)
- `components/ui/LiteYouTubeEmbed.tsx` - thumb estatico, iframe so on click
- `components/ui/InstagramEmbed.tsx` - iframe oficial pra `/p/<shortcode>/embed/`

### Config / CI
- `next.config.ts` - CSP (sem unsafe-eval), redirects WP, security headers, remotePatterns, optimizePackageImports
- `.env.example` - variaveis com setup do INSTAGRAM_ACCESS_TOKEN documentado
- `.github/workflows/ci.yml` - lint + type-check + test + build
- `~/.claude/commands/sprint-vistoria.md` - slash command de sprint review

## Operacao

- Push em repos `terra-gentil/*` exige `gh auth switch -h github.com -u terra-gentil` (memoria salva em `feedback_github_auth.md`, fazer sem perguntar)
- Vercel deploy automatico no push pra `main`
- Variaveis de producao na Vercel:
  - `DIAGNOSE_API_URL` (opcional, default `https://terra-gentil-app-production.up.railway.app`)
  - `GEMINI_API_KEY` (legada, pode remover - nao usada mais desde commit `0362952`)
  - `NEXT_PUBLIC_GA_ID=G-4BZ68B16BK`
  - `NEXT_PUBLIC_GOOGLE_VERIFICATION=OV3rat2vVU6w17ZQ389kNnw9dPz7Uxp3QVJSCem9iMI`
  - `NEXT_PUBLIC_GAME_ENABLED` (vazio ate liberar /jogo)
  - `INSTAGRAM_ACCESS_TOKEN` (vazio - quando setar, IG passa a auto-atualizar)
- Login terra-gentil no `developers.facebook.com` ainda nao concluido (token IG pendente)

## Comandos uteis

```powershell
# Validar redirects
curl.exe -sI https://terragentil.com.br/ -o /dev/null -w "apex: %{http_code} -> %{redirect_url}`n"
curl.exe -sI https://www.terragentil.com.br/ -o /dev/null -w "www:  %{http_code} -> %{redirect_url}`n"

# Validar redirect WP legado
curl.exe -sI "https://terragentil.com.br/?p=999" -o /dev/null -w "wp: %{http_code} -> %{redirect_url}`n"

# Sitemap
curl.exe -sI https://terragentil.com.br/sitemap.xml -o /dev/null -w "sitemap: %{http_code}`n"

# Bundle inspection (apos build)
ls .next/static/chunks/ | head
```

## Vistoria 2026-05-08 (sumario)

| # | Eixo | Nota | Status |
|---|------|-----:|:------:|
| 1 | Performance | 8/10 | 🟢 |
| 2 | Bugs e edge cases | 8/10 | 🟢 |
| 3 | Memory leaks | 9/10 | 🟢 |
| 4 | Seguranca e compliance | 8/10 | 🟢 (apos CSP fix) |
| 5 | Arquitetura | 8/10 | 🟢 |
| 6 | Observabilidade | 8/10 | 🟢 |
| 7 | Escalabilidade | 8/10 | 🟢 |
| 8 | Acessibilidade | 7/10 | 🟡 (apos h1 fix) |
| 9 | SEO | 8/10 | 🟢 (JSON-LD ja presente) |
| 10 | Qualidade dos testes | 6/10 | 🟡 (UI nova sem cobertura) |
| 11 | CI/CD | 8/10 | 🟢 |
| **Media** | | **7.8/10** | 🟢 |

## Auditoria multi-agente 2026-05-08 (6 sprints)

Apos a vistoria, rodei 6 agentes Sonnet em paralelo, um por sprint historica do projeto, procurando bugs nao detectados no review unico. Todos read-only. Achados:

**5 P1 corrigidos nesta passada:**
- `lib/instagram.ts:109` - **token IG vazava em log** via `String(err)` (URL com access_token=...). Agora mascarado com regex.
- `lib/instagram.ts:44` - extractShortcode regex exigia trailing slash, descartava posts. Agora `/\/(?:p|reel|tv)\/([^/?#]+)/`.
- `Header.tsx:36,88` - `pathname.startsWith` sem `/` final dava falso positivo. Agora `pathname === href || pathname.startsWith(href + '/')`.
- `Header.tsx:83` - `role="menu"` exigia `menuitem`. Trocado por `<nav aria-label="Mobile">`. Adicionado overlay clicavel + Esc + auto-close ao mudar rota.
- `BeforeAfterSlider` - `:focus-visible` sumiu no redesign. Re-adicionado em `.ba:focus-visible`.

**~12 P2 corrigidos:**
- `PlantDoctor.tsx` - mensagem real do Gemini (ex: "nao e planta") agora chega ao usuario.
- `app/api/diagnose/route.ts` - rate limit nao mais bypassable via XFF spoof; usa x-real-ip primeiro.
- `lib/instagram.ts:84` - erro de token expirado (Meta code 190) ganha evento distinto `instagram_token_expired` no log.
- `AppPromo.tsx` - links App Store/Google Play **deixaram de apontar pro repo do JOGO**; agora sao divs decorativos. Beta tester aponta pro Insta.
- `LiteYouTubeEmbed.tsx` - `videoId` sanitizado com encodeURIComponent antes de virar URL.
- `app/sitemap.ts` - `lastModified` fixo em `STATIC_LAST_MOD` (data literal). Crawler nao ve "modificado agora" a cada hit.
- `blog/[slug]/page.tsx` - JSON-LD ganha `dateModified` + `image` fallback pro logo (era omitido em posts sem foto).
- `app/videos/page.tsx` - eyebrow nao mais mente "142 videos" quando RSS falha.
- `globals.css` - prefers-reduced-motion completo (5 animations infinitas pausadas).
- `globals.css` - dead 540px do .ig-tile-embed removido (era sobrescrito).
- `globals.css` - app-phone na faixa 761-980px com translate menor pra nao estourar.
- `globals.css` - hamburger 38x38 -> 44x44 (WCAG 2.5.5 AAA).
- `Header.tsx` - link `/jogo` no nav so renderiza se `GAME_ENABLED`.
- `InstagramEmbed.tsx` - `referrerPolicy="strict-origin-when-cross-origin"`.

**P3 backlog (nao aplicado):**
- `lib/game.ts` + `__tests__/lib/game.test.ts` = dead code desde redesign. Apagar.
- `FACEBOOK_URL` e `YOUTUBE_HANDLE` em `lib/constants.ts` = dead exports.
- Footer com 5 links so. Faltam `App`, `Jogo`, `Instagram`.
- StubPage `/manifesto` e `/app` rasos pro Google indexar como conteudo real.
- `<time>` sem `dateTime` attribute em `/blog/[slug]:56`.
- `GoogleAnalytics.tsx:27` `anonymize_ip` deprecated em GA4 (silenciosamente ignorado).
- `robots.ts:14` `host` field ignorado pelo Google (legacy do Yandex).
- `lib/instagram.ts` token na query string vs header `Authorization` (best practice, mas funciona).
- `app/api/diagnose/route.ts` servidor nao cancela call ao Gemini quando cliente aborta (queima tokens).
- Cobertura zero pra `BeforeAfterSlider`, `whatsappLink`, `lib/instagram.ts`, e novas paginas.
- 1 unico CSS global de 1600+ linhas sem split por modulo (so manutencao).

**Pode ir pra producao: SIM.** Bloqueios: nenhum apos esta passada. Itens pendentes acima sao melhoria continua.
