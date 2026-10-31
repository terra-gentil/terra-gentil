# Auditoria dos 19 ebooks Terra Gentil (brief do redesign)

Data: 30/10/2026. Material: `public/ebooks/*.pdf` (19 PDFs, gerados no Gamma em 2025).
Régua: publicação editorial moderna de 2026, lida no celular por gente de 40 a 70 anos.
Critério principal: o livro prende a atenção nas 3 primeiras páginas ou a pessoa larga?
Sem comparar com o Gamma. Notas rigorosas: 5 é "aceitável", 8 é "profissional".

Método: PyMuPDF (texto, tamanho de fonte por caractere, tamanho de página, nº de imagens),
render de todas as páginas dos livros 1, 10, 13 e 18 e, nos outros, páginas 1, 2, 3, duas
do meio e a última. "p" = página do PDF.

## Resumo em 5 linhas

1. Nenhum dos 19 é legível no celular: o corpo tem 13,5 pt (16,9 pt nos livros 16 a 19) numa página de 900 pt de largura, o que dá 5 a 7 px na tela, e as páginas chegam a ser 5,7 vezes mais altas que largas.
2. Os livros 1 a 8 perdem o leitor logo de cara: a capa é só o logo com um texto copiado da descrição do YouTube, e a p3 é uma página de capítulo quase vazia. Os livros 11 a 19 prendem melhor, com título grande, foto do André e a voz dele na p2.
3. Confiança é o risco número 1: o livro 10 diz que hortelã e orégano são seguros para cães e gatos, mas a ASPCA lista os dois como tóxicos. O livro 18 tem depoimentos inventados ("Comunidade do Bairro X"). NASA, saúde e cura aparecem sem fonte em vários livros.
4. Há muito acabamento de IA à vista: texto em inglês dentro das imagens, rótulos vazados ("PÁGINA 14", "Photorealis"), markdown aparecendo (`**`), capítulos duplicados, planta errada na imagem e travessão em pelo menos 14 livros.
5. Não é uma coleção, são 19 livros soltos, em 3 gerações visuais, sem número, sem selo, com 16 hashtags diferentes. Cada PDF pesa de 5 a 15 MB (165 MB no total). O que se salva é a voz do André, o teste do dedo, quiz e checklist, e o gancho "100% de graça".

## Tabela dos 19

Notas de 0 a 10. "3 págs" = prende nas 3 primeiras páginas? (Sim, Parcial, Não).

| # | Arquivo | Págs | MB | Capa | Visual | Texto | Utilidade | 3 págs | Pior problema |
|---|---|---|---|---|---|---|---|---|---|
| 1 | O-Codigo-Secreto-das-Plantas | 35 | 11,5 | 2 | 3 | 5 | 6 | Não | Capa é logo gigante + texto "Aqui no YouTube" (p1); p4 é um capítulo com uma linha só |
| 2 | O-Esquadrao-Imortal | 23 | 6,5 | 2 | 3 | 4 | 5 | Não | p3 quase vazia e p8 com parede de texto; ilustração de um estranho no lugar do André (p2) |
| 3 | Plantas-da-Gratidao | 29 | 6,5 | 2 | 3 | 3 | 3 | Não | Texto esotérico ("energias negativas", "purifica toxinas") sem fonte, com bloco de 400 palavras na p3 |
| 4 | Jardim-Lindo-com-Pouco-Dinheiro | 20 | 7,9 | 2 | 3 | 4 | 5 | Não | p2 com imagem de IA de homem desesperado, p3 vazia, mascote segurando a página de outro livro (p7) |
| 5 | O-Seu-Novo-Quintal-e-na-Parede | 26 | 10,6 | 2 | 4 | 5 | 6 | Não | Capa logo + YouTube (p1); p2 com homem solitário, sem relação com o tema |
| 6 | Jardim-Terapeutico | 28 | 8,6 | 3 | 3 | 3 | 3 | Não | Carta da p2 é cópia da carta do livro 10; promessa de cura ("oxigena o cérebro", p18) sem fonte |
| 7 | Jardim-Pequeno-Amor-Gigante | 24 | 7,7 | 3 | 4 | 5 | 5 | Parcial | Travessão na própria capa (p1); p3 de capítulo com 80% de branco |
| 8 | Horta-na-Varanda | 27 | 7,7 | 3 | 4 | 5 | 5 | Não | "Orégano" ilustrado com foto de jiboia (p10); p3 vazia; travessão (p3) |
| 9 | Plantas-para-Varanda-Pequena | 17 | 5,2 | 4 | 3 | 6 | 7 | Parcial | Página de até 3,5x a largura (p11); "segundo a NASA" sem fonte e lírio-da-paz indicado para o quarto sem alerta para pets |
| 10 | Guia-Gentil-Plantas-Caes-e-Gatos | 25 | 8,3 | 3 | 3 | 4 | 3 | Parcial | Diz que hortelã e orégano são seguros para pets (p11), contra a ASPCA; "Photorealis" (p11), "Inviting Natural" e "PÁGINA 14" (p16) nas imagens |
| 11 | Como-Plantar-Suculentas | 16 | 5,5 | 5 | 4 | 5 | 6 | Sim | "Desenhadas por Deus para a mulher moderna" (p3) exclui metade do público; Cap. 8 é cópia do livro 13 |
| 12 | Como-Plantar-Rosa-do-Deserto | 22 | 10,3 | 5 | 4 | 6 | 7 | Sim | 12 páginas compridas (até 2,3x), excesso de mascote |
| 13 | Morangos-do-Coracao | 21 | 10,6 | 5 | 4 | 5 | 7 | Sim | Capítulos 6 e 7 repetidos (p8-p9); "bursting" no texto (p16); pimentões e salsinha no capítulo de morango (p13) |
| 14 | O-Cheirinho-que-Mora-na-Memoria | 21 | 8,1 | 6 | 4 | 5 | 6 | Sim | "Anti-séptica, calmante e analgésica muito eficaz" (p3) sem fonte; travessão (p2) |
| 15 | Como-Plantar-Cebolinha-em-Casa | 21 | 9,9 | 5 | 4 | 5 | 6 | Sim | Foto de cebolinha-francesa florida (p14), que não é a cebolinha da horta brasileira; 11 páginas compridas |
| 16 | Jiboia-na-Sala | 19 | 9,5 | 5 | 4 | 5 | 7 | Sim | Markdown vazando ("**Terra Gentil**", p2); "Healthy Aur..." em inglês na imagem (p12) |
| 17 | Alface-em-Casa | 21 | 10,7 | 4 | 4 | 4 | 6 | Parcial | Subtítulo copiado das suculentas, "(que não apodrecem em 1 mês)" (p1); 17 marcas de markdown; tabela nutricional sem fonte (p8) |
| 18 | O-TAPETE-VERDE-DA-BONDADE | 21 | 15,0 | 5 | 3 | 4 | 6 | Sim | Depoimentos inventados com "Comunidade do Bairro X" (p19); página 5,7x mais alta que larga (p14); 15 MB |
| 19 | Tomate-em-Vaso | 19 | 8,9 | 5 | 4 | 6 | 7 | Sim | 15 páginas compridas (até 3x); capa com tomate de IA "plantado" no vaso |

Médias: capa 3,8; visual 3,6; texto 4,7; utilidade 5,6. Nenhum livro chega a 7 de média.

## Manter (o que funciona)

- **A voz do André na abertura, sem culpa.** "Seja honesto comigo... você não é um assassino de plantas" (19 p2), "Você Não Tem Dedo Podre" (9 p2), "Você não é um dono irresponsável" (10 p3). É o melhor gancho da coleção.
- **Capa com título enorme e foto real do André com a planta do livro** (13 p1, 12 p1, 14 p1). O 14 corta o logo como elemento gráfico, e é a capa mais moderna das 19.
- **O teste do dedo como ferramenta assinatura**, repetida e reconhecível (1 p10, 7 p16, 13 p6 "Técnica do Dedômetro").
- **Linguagem concreta e barata**: palito de churrasco, pote de sorvete, garrafa PET, "dica de vó" (13 p4, 4 p7).
- **Formato erro + correção** (16 p12, "5 erros que mais matam jiboias") e **cartões de problema e solução** (13 p7).
- **Interação**: mini quiz com gabarito comentado (13 p19-p20) e mini teste "que tipo de varanda é a sua?" (9 p3).
- **Checklist por fases** (18 p12) e **mensagem final assinada** pelo André (9 p17).
- **Tabela de custo em R$/m²** (18 p6) e **tabela de risco por planta** (10 p5), que são formatos certos e só precisam de fonte.
- **Fechamento com vídeos reais das missões "100% de graça"** (13 p21, 12 p22). Isso liga o livro à história humana do canal.

## Nunca repetir

1. **Corpo de 13,5 pt numa página de 900 pt** (todos os 19). No celular isso vira texto de 5 px, e a pessoa precisa dar zoom em toda página.
2. **Página de altura livre**: 9 livros têm página mais de 2,5x mais alta que larga (18 p14 tem 5,7x, 16 tem 3,7x, 9 tem 3,5x). A página vira um rolo, sem ritmo de leitura.
3. **Capa sem promessa**: logo gigante com um texto de descrição do canal colado, "Aqui no YouTube, postamos..." (1, 2, 4, 5 p1). Num PDF, essa frase não faz sentido.
4. **Abertura de capítulo vazia** logo na p3 ou p4 (1 p4, 2 p3, 4 p3, 6 p3, 8 p3). É exatamente onde o leitor larga o livro.
5. **Parede de texto**: blocos de 300 a 400 palavras sem respiro (3 p3, 2 p8).
6. **Texto dentro da imagem, em inglês ou com rótulo vazado**: "Photorealis" (10 p11), "Inviting Natural" e "PÁGINA 14: TESTE DO DEDO" (10 p16), "Healthy Aur" (16 p12), "Plnatagrame" (2 p23), "MÉTODO 1/2" fantasma (18 p8), "Chamomile pets" (10 p14).
7. **Planta errada ou fora de contexto**: jiboia no lugar do orégano (8 p10), morango junto com suculentas (13 p8), pimentão no capítulo de morango (13 p13), floresta com neve no calendário brasileiro (18 p4).
8. **Depoimento inventado** apresentado como "Histórias Reais" (18 p19, "Dona Maria, 65 anos", "Comunidade do Bairro X"). Isso destrói a confiança no canal, que vive de história real.
9. **Saúde e toxicidade sem fonte, ou erradas**: hortelã e orégano "seguros" para pets (10 p11), "remove 60% das toxinas segundo a NASA" (9 p11, 16), "anti-séptica e analgésica" (14 p3), "oxigena o cérebro" (6 p18), "purifica energias" (3), tabela nutricional (17 p8). Também há contradição dentro do mesmo livro: o 9 recomenda lírio-da-paz para o quarto (p11) e o lista como tóxico na p13.
10. **Conteúdo duplicado**: capítulos 6 e 7 iguais (13 p8-p9), carta igual nos livros 6 e 10 (p2), o Cap. 8 do 11 copiado no 13, ilustração de capa repetida (6, 10 e 2 usam a mesma família).
11. **Artefato de geração**: markdown aparecendo (`**`, `_`) no 16, no 17 e no 2; subtítulo copiado de outro livro (17 p1); "Capítulo 1.5" e "3.5" (1).
12. **Travessão** (em-dash e en-dash) em pelo menos 14 dos 19 livros, até na capa (7 p1) e nos títulos "CAPÍTULO 1 (travessão) ...".
13. **URL crua quebrada no meio** como título ("@TerraG / entil", 1 p35, 2 p23, 3 p29).
14. **Promessa de produto que não existe**: "Terra Gentil Pro: Guia Visual de Pragas" (1 p34), "Terra Gentil Avançado" (10 p24).
15. **Mascote aleatório** (batata com soprador de folhas em quase todos os fechamentos, chef, detetive, cientista) e **André em cartoon de IA** (10 p4, 16 p2). Isso briga com a foto real.
16. **Público errado no texto**: "mulher moderna" (11 p3) e "Seja muito bem-vinda" (15 p2), quando o público é misto.
17. **16 hashtags diferentes** (#TerraGentilSalvou, #CasaGentilSegura, #MorangosQueVivem...) e nenhuma numeração. Isso dispersa a marca.
18. **PDF de 5 a 15 MB** com 27 a 73 imagens cheias. É pesado para o direct e para o plano de dados do público.

## Consistência entre os 19

Não é coleção. São 3 gerações:
- **Livros 1 a 8**: capa com logo e texto do YouTube, páginas paisagem, capítulos "Capítulo N:", fechamento com mascote.
- **Livros 9 e 10**: transição, com capa meio a meio e travessão depois de "CAPÍTULO N".
- **Livros 11 a 19**: capa com título grande e foto do André, emoji em todo título, páginas longas, fechamento com vídeos.
O que falta em todos: número na coleção, selo, série por tema, sumário, página de fontes, tamanho de página fixo e padrão de ficha de planta.

## Brief para o redesign (novo padrão, mensurável)

1. **Formato de página fixo**: retrato 9:16, arte em 1080 x 1920 px (405 x 720 pt), margens de 32 px. Uma página cabe numa tela de celular, sem zoom e sem rolagem dentro da página. Página de altura livre é proibida.
2. **Tamanho e ritmo**: de 16 a 24 páginas por livro, no máximo 110 palavras por página de texto, no máximo 3 blocos por página e pelo menos 1 elemento visual a cada 2 páginas.
3. **Tipografia para 40 a 70 anos**: corpo de no mínimo 18 pt na página de 405 pt (cerca de 16 px efetivos no celular), entrelinha 1,5, no máximo 42 caracteres por linha. Título de capítulo com no mínimo 40 pt, intertítulo com 26 pt, legenda e rodapé com 14 pt. Nada abaixo de 14 pt (validar com PyMuPDF). No máximo 2 famílias: uma serifada humanista para títulos e uma sem serifa de alta legibilidade para o corpo, sem itálico longo.
4. **Contraste e paleta**: o texto do corpo precisa de contraste de pelo menos 7:1 (AAA); laranja só em destaque, nunca em texto pequeno. Paleta proposta: creme `#FAF6EE` no fundo, tinta `#1F1F1F` no texto, ouro do logo `#E8A31B`, terracota `#C8521E`, verde folha `#2F5D3A`, e alerta `#B42318` sobre `#FDECEA`. Uma cor de série por tema, aplicada na lombada e no selo.
5. **As 3 primeiras páginas prendem o leitor**:
   - p1, capa: promessa concreta em no máximo 8 palavras, foto real do André com a planta do livro e o selo.
   - p2, carta do André: no máximo 90 palavras, uma história real de missão, foto e assinatura.
   - p3: o resultado rápido, ou seja, a dica mais útil do livro numa página só, aplicável hoje.
   - Sumário só depois da p3. Capa só com logo, ou abertura vazia antes do conteúdo, é proibido.
6. **Tipos de página (biblioteca fixa de 12 modelos)**: capa, carta do André, resultado rápido, sumário, abertura de capítulo (imagem cheia + título + 1 frase, nunca vazia), ficha de planta, passo a passo numerado (no máximo 5 passos, com foto), tabela (no máximo 4 colunas e 6 linhas), alerta, erro e correção, checklist, quiz com gabarito, história real, fechamento e página de fontes/colofão. Todo livro usa pelo menos 8 desses modelos.
7. **Ficha de planta padronizada**: nome popular e científico, luz, rega, vaso, dificuldade (1 a 3) e um selo obrigatório de segurança para pets e crianças ("Seguro", "Cuidado", "Tóxico"), sempre com a fonte.
8. **Regras de imagem**:
   - A capa, a carta e o fechamento usam só fotos próprias do André (banco de cerca de 445).
   - Google Flow só para cenas didáticas e passo a passo, com a planta certa conferida pelo nome científico.
   - Banco de imagens só para planta isolada ou textura.
   - Uma única linha de tratamento (luz quente, fundo neutro).
   - Proibido: texto ou rótulo dentro da imagem, inglês, clima estrangeiro (neve), André em cartoon, depoimento com rosto de IA, e a mesma imagem em 2 livros.
9. **Mascote**: aparece no máximo 1 vez por livro, só no quiz ou no checklist, ou sai da coleção. Nunca no lugar do André.
10. **Selo de coleção e numeração**: "Coleção Terra Gentil, Nº 001 a 200" na capa e no rodapé, com o número da página, o nome da série (Horta, Dentro de Casa, Flores, Quintal, Casa com Pets, Bem-estar) e a cor da série. A hashtag é uma só para toda a coleção (por exemplo, #TerraGentil), e o arquivo segue o padrão `TG-001-slug.pdf`.
11. **Fonte é obrigatória**:
    - Toda afirmação de toxicidade, saúde, nutrição ou estudo leva uma nota numerada, e a página final de fontes lista ASPCA, Embrapa, CIATox, artigo original etc.
    - Não citar a NASA sem o estudo e sem a ressalva.
    - Sem fonte, a frase sai.
    - Proibidas promessas de cura e depoimento sem nome real e autorização.
12. **Texto**:
    - PT-BR, voz do André, público misto (nada de "mulher moderna").
    - Zero travessão, zero markdown, zero inglês, zero capítulo duplicado.
    - Nenhum produto prometido que não exista.
    - Revisão humana dos 3 primeiros parágrafos de cada livro.
13. **Fechamento padrão**: checklist "comece essa semana", mensagem assinada do André, 2 vídeos reais das missões "100% de graça" com QR code, links curtos clicáveis (sem URL crua) e "próximo livro da série".
14. **Peso**: no máximo 4 MB por PDF (alvo de 2 a 3 MB), imagens em JPEG a 1080 px de largura com qualidade 75 a 80, fontes em subset, sem imagem fora da área visível.
15. **Portão de qualidade automático antes de publicar**:
    - um script (PyMuPDF) reprova o PDF se encontrar fonte abaixo de 14 pt, página fora de 9:16, peso acima de 4 MB, travessão (U+2013 ou U+2014) ou `**`, palavras comuns em inglês, ficha de planta sem selo de pets, ou nota de saúde sem fonte;
    - depois, uma vistoria visual das 3 primeiras páginas.
