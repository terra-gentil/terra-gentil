# Vistoria SEO de terragentil.com.br (30/09/2026)

Resumo: base tecnica boa (Lighthouse SEO 100, boas praticas 100, titulos unicos, canonical, sitemap). O que falta para ser achado e ganhar sitelinks: conteudo com mais substancia, estrutura de links clara, dados estruturados nas paginas internas e velocidade no celular (LCP da home 7,9 s). Fontes: documentacao oficial do Google (sitelinks, site names, favicon), Search Console e Lighthouse mobile.

## Como o Google decide os "sitelinks" (as secoes embaixo do resultado)
- Sao automaticos. Nao existe codigo nem marcacao que os crie. O Google analisa a estrutura de links do site e so mostra quando acha util.
- O que ajuda (documentacao oficial): titulos e H1 informativos e curtos, estrutura logica, texto de link conciso e relevante, conteudo sem repeticao.
- Na pratica aparecem quando a busca e pela MARCA ("terra gentil") e o site tem autoridade. Hoje: 66 cliques em 16 meses. Sitelinks vem com volume de busca de marca, que vem do canal.
- A antiga "caixa de busca nos sitelinks" foi descontinuada pelo Google em 2024. Nao adianta marcar.
- Nome do site no resultado: vem do JSON-LD `WebSite` da home (`name`, `alternateName`). Ja existe; falta `alternateName`.
- Icone no resultado: quadrado, multiplo de 48 px, rastreavel. Ja atende (`/icon.png` 512x512).

## Estado atual (medido)
| Item | Resultado |
|---|---|
| Lighthouse mobile home | desempenho 66, acessibilidade 88, boas praticas 100, SEO 100 |
| Lighthouse mobile post | desempenho 80, acessibilidade 90, boas praticas 100, SEO 100 |
| LCP home | 7,9 s (bom: ate 2,5 s). Imagem do mascote com 2,5 s de atraso de renderizacao (animacao de entrada) |
| LCP post | 5,4 s. Miniatura do video com `loading=lazy` sendo o primeiro elemento |
| CLS | 0,057 home, 0 post (bom) |
| Indexadas | 8 de 34 conhecidas pelo Google |
| Titulos | todos unicos. 4 posts passam de 60 caracteres (cortados no Google) |
| Separador de titulo | inconsistente: "·" na maioria, travessao em /sobre e /equipamentos |
| og:title das paginas internas | todas repetem o da home |
| JSON-LD | home (Organization, WebSite) e posts (Article). Paginas de indice sem nada |
| Paginas finas | /transformacoes 143 palavras, /equipamentos 127, /instagram 184, posts 205 a 445 |
| Imagens sem alt | /jogo 7, /manifesto 4, home 2 |
| /sobre e /equipamentos | fora do menu: quase nenhum link interno aponta para elas |
| Textos falsos ou vencidos | H1 de /videos "Toda terca tem video novo"; hero "Ao vivo no YouTube, novo video toda semana"; cidades e duracoes inventadas em /transformacoes |

## Plano de correcao (em ordem de impacto)
### A. Velocidade (Core Web Vitals entram no ranking)
1. Home: imagem do mascote com `priority` (fetchpriority high) e sem animacao de opacidade no primeiro quadro.
2. Posts: miniatura do video com `priority` (tirar lazy do primeiro elemento).
3. Medir de novo em producao. Meta: LCP abaixo de 2,5 s.

### B. Estrutura que ajuda sitelinks
4. Menu com rotulos claros e poucos itens principais; /sobre acessivel no menu ou rodape com texto "Sobre o Terra Gentil".
5. H1 das paginas de indice descritivos (ex.: /videos "Videos de transformacao de quintais", nao slogan).
6. Titulos padronizados "Pagina · Terra Gentil", ate 60 caracteres.
7. BreadcrumbList em todas as paginas internas; `alternateName` no WebSite.
8. og:title e og:description proprios por pagina.

### C. Conteudo (o que faz o Google indexar)
9. Paginas por historia `/historias/<slug>` com 800+ palavras, fotos de antes e depois, video embutido e `VideoObject`. Publicar junto com cada video novo.
10. Expandir /transformacoes com dados reais; remover cidades e duracoes inventadas.
11. Posts curtos: juntar com a pagina da historia correspondente (redirect 301) ou expandir.

### D. Honestidade e manutencao
12. Corrigir textos vencidos (video toda terca, ao vivo) ate o relancamento.
13. Alt em todas as imagens.
14. Search Console: acompanhar Paginas e Desempenho a cada 2 semanas; pedir indexacao da home e das paginas novas no lancamento.
