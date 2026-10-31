# gama-ebooks: fábrica de ebooks do Terra Gentil

Meta: sair de 19 ebooks para 100 e depois 200, todos de graça, entregues pela palavra-chave
no direct, pelo site e pelo carrossel. Fase atual: **0 (Gamma como molde)**. Nada de código ainda.

## Por que

Hoje a base tem 1.502 fatos com fonte (16 livros de referência, `dados/biblia.json`) e 445 capas do
André com planta. Isso rende muito mais livros do que os 19 feitos no Gamma em 2025. O Gamma é
caro e faz o livro por nós; a ideia é aprender a fórmula dele, gastar os 12.000 créditos que
sobraram e ter um motor nosso, melhor, antes de cancelar.

## Fases

| Fase | O que entrega | Pronto quando |
|---|---|---|
| 0a. Auditoria | Os 19 PDFs de `public/ebooks/` página a página: o que é bom, o que é ruim, nota; `AUDITORIA.md` | Lista de acertos a manter e erros a nunca repetir |
| 0a2. Referências | Design editorial moderno (2024 a 2026), legibilidade 40 a 70 anos no celular, paleta por família; `REFERENCIAS.md` | Brief com referências concretas, não com o Gamma de 2025 |
| 0b. Redesign | Brief da auditoria + referências + fórmula levado ao Claude Design (web): sistema visual profissional, tipos de página | André aprova o novo visual |
| 0c. Livros novos | 6 livros com roteiro nosso (Gamma com o novo visual ou já o motor próprio); `FORMULA-GAMMA.md` completa | 6 PDFs aprovados pelo André |
| 1. Motor próprio | Roteiro JSON, molde HTML com o tema, render em PDF pelo Chrome, checagem automática | O mesmo roteiro sai no nosso motor igual ou melhor que no Gamma (lado a lado) |
| 2. Distribuição | Palavra-chave por livro, vitrine `/ebooks` no site, PDFs no R2, carrossel de lançamento | Livro novo chega ao seguidor sem passo manual |
| 3. Escala | Rotina agendada do Claude escreve 1 roteiro por dia; André aprova a prévia | 100 livros; depois 200 |

## Placar contra o Gamma

Todo avanço é medido em `PLACAR.md`: o mesmo roteiro sai no Gamma e no nosso motor, críticos cegos
dão nota por uma rubrica com peso e o André dá o voto final. Livro nosso abaixo do Gamma não vai
ao ar; o Gamma só é cancelado depois de 3 vitórias seguidas.

## Como um livro nasce (fase 1 em diante)

1. `catalogo.json`: id, título, tema, palavra-chave, fatos que usa, status.
2. Roteiro: a rotina agendada do Claude (sem API paga) escreve `roteiros/<id>.json`, um objeto
   por card, na voz do André. Todo fato vem da bíblia ou de um ebook, com livro e página.
3. Conferência: travessão, tamanhos, fato com fonte, toxicidade só com fonte de pet, sem texto
   copiado de livro (repo público).
4. Imagens: capas do banco por espécie, banco de imagens e ilustração flat; a capa do livro vem
   do Google Flow.
5. Render: molde HTML com o tema Terra Gentil, Chrome headless gera o PDF (mesmo caminho do
   carrossel, `TG_CHROME_CANAL=chrome`).
6. Prévia no Telegram, ok do André, publica: PDF no R2, palavra em `dados/palavras.json`, card
   no site e carrossel de lançamento.

## Catálogo alvo (cerca de 200)

| Família | Exemplos | Qtde |
|---|---|---|
| Por espécie | Orquídeas, Cactos, Samambaia, Violeta, Bromélia, Antúrio | 70 |
| Por cuidado | Rega, solo e adubo, pragas sem veneno, poda, mudas e propagação, luz | 25 |
| Por lugar | Apartamento sem sol, banheiro, escritório, quintal pequeno, muro, calçada | 20 |
| Por pessoa | Primeiro jardim, jardim para netos, jardim acessível 60+, pets | 15 |
| Calendário | O que plantar em cada mês, jardim nas 4 estações | 16 |
| Cozinha verde | Temperos, chás do quintal, PANC, horta em caixote | 20 |
| Histórias | Um livro por missão do canal (história + o que aprendemos) | 25 |
| Coleções | Kits de 3 livros (iniciante, horta, flores) | 10 |

Gargalo: fatos. Espécies com menos de 30 fatos precisam de bíblia nova antes do livro (lista de
temas em `PROGRESSO.md`: pragas, rega, propagação, aromáticas, sombra, estações).

## Primeiros 6 (fase 0, no Gamma)

Orquídeas sem Medo (263 fatos), Pragas sem Veneno (95), Terra Viva: solo, adubo e compostagem
(128), Cactos e Babosa (72), Regar e Trocar de Vaso sem Matar (75), O Mato que Ensina (71).
