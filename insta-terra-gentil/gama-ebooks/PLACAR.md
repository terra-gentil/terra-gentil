# Placar: gama-ebooks contra o Gamma

Regra de ouro: **livro nosso só vai ao ar se empatar ou ganhar do Gamma no placar.** O Gamma só é
cancelado quando o motor próprio ganhar 3 rodadas seguidas.

## Como mede

1. O mesmo roteiro (mesmo texto, mesmos fatos) vira PDF nos dois: Gamma (tema Terra Gentil) e
   gama-ebooks. A comparação é de design e de leitura, não de conteúdo.
2. Críticos cegos: os dois PDFs vão como "A" e "B", sem dizer qual é qual (Gemini e um agente do
   Claude), com a rubrica abaixo. Cada crítico dá a nota de 0 a 10 por critério e justifica.
3. O André dá o voto final em 3 páginas lado a lado (capa, capítulo, ficha).
4. A rodada é registrada na tabela de rodadas, com a nota de cada um e a diferença.

## Rubrica (peso)

| Critério | Peso | Pergunta |
|---|---|---|
| Fisgada | 3 | Nas 3 primeiras páginas, a pessoa quer continuar? |
| Capa | 2 | Para o dedo no direct? Parece livro de editora? |
| Legibilidade no celular | 2 | Letra, contraste e linha confortáveis para quem tem 60 anos? |
| Hierarquia e ritmo | 2 | Dá para escanear? Alterna texto, imagem, ficha e respiro? |
| Imagens | 2 | Bonitas, coerentes, planta certa, sem cara de IA estranha? |
| Identidade de coleção | 1 | Reconhece como Terra Gentil numerado de uma série? |
| Utilidade | 2 | Dá para fazer algo hoje (passo a passo, checklist)? |
| Confiança | 1 | Cita fonte? Nada perigoso sem fonte? |
| Acabamento | 1 | Sem corte, página vazia, erro, PDF pesado (> 15 MB)? |

Nota final = média ponderada (0 a 10). Diferença = nossa nota menos a do Gamma.

## Leitura do placar

| Diferença | Situação | O que fazer |
|---|---|---|
| < -0,5 | Abaixo | Não publica. Lista o que falta por critério e corrige o molde |
| -0,5 a +0,5 | Empate | Publica; ataca o critério de menor nota |
| > +0,5 | Acima | Publica; conta para cancelar o Gamma (3 seguidas) |

## Rodadas

| Data | Livro | Gamma | Nosso | Diferença | Maior falta |
|---|---|---|---|---|---|
| 31/10/2026 | TG 001 Orquídeas (falta o voto do André) | 3,6 (Claude 3,8, Gemini 3,4) | 9,2 (Claude 8,6, Gemini 9,7) | +5,6 | Nosso: caixas de foto vazias (p11, p15), PDF pesado |

Notas da rodada 1: sorteio A=nosso, B=Gamma (chave em `Documents\Terra Gentil\ebooks\placar-r1-chave.txt`).
O Gamma fez 19 cards, não 20: cortou a Fontes em "ASPCA, lista de" e não fez o fechamento; exportou
em página quase quadrada (900x771), corpo ilegível no celular. Exportado como está, por decisão do André.
Para o Gemini o nosso foi comprimido (pypdf, JPEG 75) de 10 MB para 2,3 MB, sem perda visível; o
Gemini atribuiu por engano as caixas vazias ao B. Os dois críticos pedem: preencher p11 e p15 com
foto, PDF mais leve (perto de 2 MB) e foto do sintoma de vírus na p14.
