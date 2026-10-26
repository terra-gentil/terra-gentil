# Etapa: notícias no site (SEO e Google Analytics)

Pedido do André (26/10/2026): o carrossel do dia vira uma **notícia no site e um post no Instagram ao
mesmo tempo**. Cada notícia precisa ter a própria página, otimizada para o Google achar o site, e
ser medida de forma individual no Google Analytics, como no site do Pearl Jam (setlists-pj-ev), onde
isso gerou bastante visualização. Base lida: `docs/PLAYBOOK-SEO-GOOGLE.md` e `docs/ANALYTICS.md` de lá.

## O que o Pearl Jam ensinou (e vale aqui)

1. **Uma URL própria por notícia, sem `#`, com o HTML completo já no servidor.** O Google ignora o que
   vem depois do `#`. No Pearl Jam o site de 4 meses tinha zero visita vinda do Google por causa disso.
2. **Texto completo na página, não resumo.** Página fina atrapalha o site inteiro.
3. **Todas as páginas saem de um molde único** (title, description, canonical, Open Graph, JSON-LD,
   breadcrumb, menu e GA4).
4. **A home e o rodapé precisam de links `<a href>` reais** para o índice. É por eles que o Google entra.
5. **Sitemap com todas as notícias** e `robots.txt` apontando para ele.
6. **GA4 mede cada URL como uma página**, sem configurar nada. Eventos próprios dão o detalhe.

## O que o Terra Gentil já tem (não refazer)

- `/blog` e `/blog/[slug]` (histórias do campo, em `data/posts.ts`), `app/sitemap.ts`, `lib/seo.ts`
  (`pageMetadata`), `components/seo/BreadcrumbJsonLd.tsx`, GA4 `G-4BZ68B16BK` carregado com atraso
  (`components/analytics/GoogleAnalytics.tsx`), canonical e og:image padrão, JSON-LD Organization.
- Alerta do próprio Search Console (30/09): os posts do blog com 250 a 350 palavras foram descartados
  como conteúdo fino. **Notícia com texto curto vai pelo mesmo caminho.**

## Desenho

**Rotas:** `/noticias` (índice), `/noticias/[slug]` (estática, gerada no build), `/noticias/feed.xml`.
`/blog` continua para as histórias do canal; `/noticias` é o conteúdo de cuidado de plantas que também
vira carrossel.

**Fonte dos dados:** os mesmos `insta-terra-gentil/dados/posts/*.json` que a rotina grava e o merge
valida. O site lê esses arquivos no build. Um post, duas saídas.

**Texto da notícia:** a rotina escreve, junto com os 8 slides, um campo `materia` a partir dos MESMOS
fatos (cada um com página e trecho conferido no livro). Formato previsto: `slug`, `titulo` (até 60
caracteres), `descricao` (150 a 160), `introducao`, 3 a 5 `secoes` (`h2` e parágrafos, cada uma com os
`fatosUsados`), `faq` (2 a 3 perguntas) e `conclusao`. O validador exige no mínimo 600 palavras (meta
800), sem travessão, e que toda seção cite pelo menos um fato.

**A página mostra:** o texto completo, as 8 imagens do carrossel com `alt` descritivo, o crédito
da foto de fundo visível (CC BY exige crédito também no site), as fontes ("Livro, p. N") com o link
do ebook (a palavra-chave), o link para o Instagram e 3 notícias para ler a seguir.

**SEO técnico:** `pageMetadata` + canonical; JSON-LD `Article` + `BreadcrumbList` + `FAQPage`;
og:image própria por notícia (a capa, em 1200x630, gerada no mesmo render); item no menu e coluna "Pra
ler" no rodapé; sitemap com `lastModified` real (data do post).

**Google Analytics:** componente cliente pequeno (`NewsTracker`) manda `news_view`
(`news_slug`, `serie`, `livro`), `news_read_75` (rolagem), `cta_ebook_click` e `cta_instagram_click`,
e `content_group = noticias`. Marcar `cta_ebook_click` como evento-chave. O script do GA continua
carregando com atraso, para não pesar a velocidade. Documentar em `docs/ANALYTICS.md`.

**Site e Instagram juntos, nesta ordem (no `publish-instagram.yml`):** merge na `main` -> deploy do
site -> conferir `GET /noticias/<slug>` = 200 -> publicar o carrossel com o link na legenda ("Leia a
matéria completa: ..."). Se publicasse antes, o link do post cairia num 404.

## Entregas, em ordem

| Etapa | O que | Onde |
|---|---|---|
| N1 | Campo `materia` no formato da rotina, validação (palavras, fatos por seção, travessão) e prompt | `insta-terra-gentil/pauta/` |
| N2 | Páginas `/noticias`, `/noticias/[slug]` e feed lendo `dados/posts` | `app/noticias/` |
| N3 | SEO técnico: metadados, JSON-LD, og:image por notícia, sitemap, menu, rodapé, home | `app/`, `lib/`, `components/` |
| N4 | Eventos do GA4, evento-chave, `docs/ANALYTICS.md` | `components/analytics/` |
| N5 | Ordem site e Instagram no workflow, legenda com o link | `.github/workflows/`, `carrossel/legenda.mjs` |
| N6 | Search Console: enviar o sitemap, pedir indexação das 3 primeiras notícias, acompanhar | conta terragentil.oficial |

## Riscos a resolver antes ou durante

1. **Vercel e o commit do bot: RESOLVIDO em 26/10.** O merge feito pelo `github-actions[bot]` (commit e0181cf) foi deployado normalmente ("Deployment has completed"). Se um dia bloquear, o plano B e um Deploy Hook da Vercel (segredo `VERCEL_DEPLOY_HOOK`) chamado pelo workflow.
2. **Conteúdo fino.** A barreira de 600 palavras no validador existe por causa disso.
3. **Rotina mais longa.** Carrossel mais matéria de 800 palavras pode estourar o tempo da rotina. Se
   estourar, separar em duas rotinas (roteiro e matéria) que gravam o mesmo post.
4. **Duplicidade com o blog.** Manter os dois temas bem separados e linkar um para o outro.
5. **Indexação demora.** O Google leva dias. O sitemap e o pedido manual das primeiras notícias aceleram.

## Pronto quando

Lighthouse mobile SEO 100, JSON-LD sem erro no Teste de Resultados Aprimorados, as notícias aparecendo
no sitemap e indexadas no Search Console, e `news_view` visível no GA4 em Tempo real com o slug da
notícia.
