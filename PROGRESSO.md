# PROGRESSO Terra Gentil

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
