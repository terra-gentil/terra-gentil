# Handoff Terra Gentil - 2026-05-08 (atualizado pos-redesign + vistoria)

## Estado atual

Site LIVE em https://terragentil.com.br substituindo o WordPress velho do Hostinger.

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

### 4. Instagram Graph API token (opcional, recomendado)

Atualmente `/instagram` e a secao Instagram da home renderizam 11 shortcodes hardcoded em `data/instagram.ts`. Funciona mas nao auto-atualiza com posts novos.

Pra ativar auto-atualizacao a cada 1h:
1. Gerar long-lived user token (60d) em `developers.facebook.com` apos virar admin do app `TerraGentil-IG` (ID `27059007300453528`)
2. Setar `INSTAGRAM_ACCESS_TOKEN=...` na Vercel
3. Refresh manual antes de 60 dias: `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=LONG`

Passo-a-passo completo no `.env.example`. Setup esta blocado por permissao "Cargo de programador insuficiente" no Meta - precisa virar admin do app na url:
`https://developers.facebook.com/apps/27059007300453528/roles/roles/`

### 5. Newsletter form (FEITO 2026-05-08, falta config de envvar)

Integrado Resend. `components/sections/Newsletter.tsx` agora chama `POST /api/newsletter` com loading/error/success states + honeypot anti-bot. A rota tem Zod validation, rate limit (3/h por IP), trata duplicata como sucesso, logger estruturado. 11 testes Vitest cobrindo todos os caminhos.

**Pendente pra ativar em prod:**
1. Criar conta em https://resend.com (free 3k/mes)
2. API Keys -> gerar key com permissao em "Audiences"
3. Audience -> Create (Resend migrou "audiences" pra "segments") -> abrir e copiar o UUID da URL `?segmentId=<UUID>`
4. Vercel -> Settings -> Environment Variables (Production):
   - `RESEND_API_KEY=re_...`
   - `RESEND_SEGMENT_ID=...`
5. Redeploy. Sem essas envvars a rota retorna 503 e o form mostra erro.
6. Pra mandar broadcast: Resend dashboard -> Broadcasts -> selecionar audience.

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
- `app/api/diagnose/route.ts` - rate limit + Zod + Gemini fallback (referencia de qualidade)
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
  - `GEMINI_API_KEY` (Production)
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
