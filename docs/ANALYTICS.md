# Google Analytics das notícias

O site usa o GA4 `G-4BZ68B16BK` (`components/analytics/GoogleAnalytics.tsx`), carregado com atraso
(`lazyOnload`) para não pesar a velocidade. Cada notícia (`/noticias/<slug>`) já é medida como uma
página, sem configurar nada. Os eventos abaixo dão o detalhe. Vêm de
`components/analytics/NewsTracker.tsx`, que espera o `gtag` carregar antes de enviar.

## Eventos

| Evento | Quando | Parâmetros |
|---|---|---|
| `news_view` | a notícia abre | `news_slug`, `serie`, `livro`, `content_group` |
| `news_read_75` | a pessoa rola 75% do texto (uma vez por visita) | os mesmos |
| `cta_ebook_click` | clique em "Baixar o ebook grátis" | os mesmos e `link_url` |
| `cta_instagram_click` | clique em "Seguir @canalterragentil" | os mesmos e `link_url` |

`content_group = noticias` vai em todos os eventos e também é definido com `gtag('set')`, para
separar as notícias do blog e do resto do site nos relatórios.

## O que ligar no painel do GA4 (uma vez, na conta do André)

1. **Evento-chave:** Admin > Eventos > ative "Marcar como evento-chave" em `cta_ebook_click`. É a
   conversão que importa: quem lê e baixa o ebook. Os eventos só aparecem na lista depois do
   primeiro disparo.
2. **Dimensões personalizadas** (Admin > Definições personalizadas > Criar dimensão, escopo
   "Evento"): `news_slug`, `serie` e `livro`. Sem isso o GA guarda os valores, mas os relatórios
   não deixam filtrar por eles.
3. **Conferir:** abra uma notícia com o Tempo real aberto no GA4 (ou o DebugView). Devem aparecer
   `news_view` na hora, `news_read_75` ao rolar e os cliques.

## Como ler

- Qual notícia traz mais gente: Relatórios > Engajamento > Páginas, filtrando `/noticias/`.
- Quem lê até o fim: `news_read_75` dividido por `news_view`, por `news_slug`.
- O que converte: `cta_ebook_click` por `serie` e por `livro`.

## Limites

- Os eventos saem quando o `gtag` carrega (ocioso depois do load). Quem sai da página antes disso
  não é contado; o clique em PDF usa `transport_type: 'beacon'` para sobreviver à troca de página.
- O `page_view` automático ainda não leva `content_group`: ele sai antes do `gtag('set')`.
  Use os eventos acima para agrupar.
