# PROGRESSO Terra Gentil

## REVISAO DO BANCO (28/10/2026, 114 capas, uma a uma em tamanho grande) - ACHOU CAPA COM ROSTO DE OUTRA PESSOA

Andre achou a `espada-de-sao-jorge-B-1` (rosto e logo errados) saindo no carrossel duotom e mandou revisar tudo. Folhas de 4 em 540x675 comparadas com as fotos de referencia. **Meu criterio de vistoria anterior (folhas de 5 em 1K) deixou passar rosto diferente e logo errada; a conferencia do Gemini (`camiseta_logo_correta`) estava desligada.**

**REPROVADAS (13), nao usar:** rosto de outro homem e/ou barba cheia ou logo errada: babosa-A-1 (barba cheia), costela-de-adao-A-1 e D-1 (outro homem, logo errada), espada-de-sao-jorge-B-1 (rosto e logo), hortela-B-1 (barba cheia), lirio-da-paz-B-1 (barba cheia), morango-A-1 (outro homem, logo sem icone), rosa-do-deserto-A-1 (barba cheia, logo errada), suculenta-A-1 (barba cheia), suculenta-B-1 e D-1 (outro homem, logo errada), tomate-A-1 (outro homem, icone diferente). Defeito de imagem: orquidea-B-1 (faixa branca vazia no topo).

**GRAFIA SUSPEITA (conferir no 2K, parecem "TIRRA"/"TARRA"):** lirio-da-paz-E-1 (bone), manjericao-E-1 (camiseta), maranta-D-1, rosa-do-deserto-E-1.

**DUVIDA de rosto (cenario E regando, de perfil; quase sempre mais marcado/diferente):** alface-E-1, anturio-E-1, babosa-E-1, cebolinha-E-1, costela-de-adao-B-1 e E-1, espada-de-sao-jorge-E-1, jiboia-E-1, morango-B-1, peperomia-B-1 C-1 E-1, samambaia-E-1, suculenta-C-1 E-1, zamioculca-E-1. Andre decide.

**FEITO (28/10): PORTAO DE APROVACAO.** `capas/banco/revisao.json` guarda o veredito (aprovada, reprovada, duvida, pendente) e o sha256 de cada capa. `capaDoDia` so entrega capa APROVADA E INTACTA (sem a revisao ele dispara erro). `capas/revisao.test.mjs` tem um teste sobre o banco real: falha se alguma capa nao tem veredito, mudou depois da revisao ou esta reprovada dentro do banco. `importar-cli.mjs` agora grava capa nova como PENDENTE (nao entra em uso ate alguem rodar `node capas/revisar-cli.mjs aprovada <id>`). `revisar-cli.mjs reprovada <id>` move para `capas/reprovadas/` e tira do indice. As 13 reprovadas ja foram movidas; as 20 em duvida ficam no banco SEM USO ate o Andre decidir (aprovada ou reprovada). 180 testes ok.

**FEITO (28/10): CAMADA 2, ROSTO AUTOMATICO.** `capas/rosto/verificar_rosto.py` (OpenCV YuNet + SFace, modelos em `Documents/Terra Gentil/modelos-rosto/`, fora do git; `pip install opencv-python-headless`) compara cada capa com as 6 fotos de referencia do Andre e grava `capas/banco/rosto.json` (nota e sha256). Limiar 0,363 (oficial do SFace). Calibracao: as 12 reprovadas por rosto tiraram 0,04 a 0,22; as 81 aprovadas, 0,41 ou mais. `capaDoDia` exige revisao E rosto, `revisar-cli.mjs aprovada` recusa capa abaixo do limiar, e `capas/rosto.test.mjs` barra o banco real. Fluxo para capa nova: `importar-cli` (entra pendente) -> `python -I capas/rosto/verificar_rosto.py --gravar` -> vistoria humana da logo -> `revisar-cli.mjs aprovada <id>`. 183 testes ok.

**AINDA SEM AUTOMACAO:** a LOGO (grafia TERRA GENTIL, icone, maiuscula) e defeitos de imagem (faixa branca) so a vistoria humana pega. Nota baixa nao e prova de rosto errado em perfil (SFace e fraco de lado). **As 20 em duvida foram APROVADAS pelo Andre (28/10)**; 3 de perfil abaixo do limiar (zamioculca-E-1, alface-E-1, peperomia-B-1) entraram com `excecaoRosto` (`revisar-cli.mjs aprovada <id> --excecao-rosto`). Banco: 101 capas aprovadas, 13 reprovadas em `capas/reprovadas/`.

**Cuidado (Windows):** scripts Python que reescrevem `.mjs` gravam CRLF e quebram o teste de limites (conta o `\r`); usar `newline='\n'` ou `sed -i 's/\r$//'`.

**Carrossel (28/10):** capa com o Andre agora desce o titulo para o rodape e tira desfoque e veu (`carrossel/titulo-embaixo.mjs`, `render.mjs`, `montar-dia.mjs`, `tratamento-foto.mjs`; 176 testes ok). Falta: contorno vazado do titulo com riscos por dentro das letras, logo da camiseta parcialmente coberta pelo titulo, ver as capas novas dos outros 6 moldes.

## ATUALIZACAO (27/10/2026, noite): banco com 114 capas 2K, limite diario descoberto

- Limite da conta da Pamela: **99 geracoes no dia** (1 teste + lote de 45 + 53 do lote de 135). Parou na lavanda-D com "Limite diario provavelmente atingido". Teto pratico: cerca de 100 imagens por conta por dia. Reset ainda nao confirmado (hipotese: meia-noite do Pacifico, cerca de 4h BRT). Tentativa agendada para 28/10 02:03 (cron de sessao); se falhar, repetir 2h depois e anotar o horario do reset.
- Lote de 53 vistoriado: 43 aprovadas, 10 reprovadas (logo do peito TIRRA em cacto D E, hibisco C, maranta A E, pimenta E, samambaia B D; grama B logo ilegivel; hortela E rosto e bone diferentes). Refazer so no fim.
- 2K baixado pela galeria com script na pagina (clique direito, Fazer o download, 2K), busca por palavra em ingles da legenda (lettuce, aloe, basil, rosemary, cactus...). Casamento por correlacao com `place2k.py`. Importado: **114 capas no banco** (indice.json, 1080x1350, 16 testes ok). Commits 0360056, 78d848a, 0aa17c1.
- Faltam: 4 jiboia A a D (2K so na conta antiga), 10 reprovadas, 82 nao geradas (lavanda D E, salsinha, violeta, bromelia, jabuticabeira, limoeiro, girassol, roseira, buganvilia, comigo-ninguem-pode, bambu-da-sorte, 10 coringas x3). Lista em `insta-terra-gentil/saida/faltam.json`.
- Mantido: PC sem dormir (processo PowerShell), aba da ferramenta Capas TG aberta na conta da Pamela (nao recarregar: a fila e as prontas ficam na pagina).
- **Tentativa das 02:03 (28/10): limite NAO zerou.** Desmarquei as 53 prontas (selecao em 82 pendentes), confirmei, e voltou "Limite diario provavelmente atingido" na hora (contador seguiu em 53). Reset nao e antes de 2h BRT. Proxima tentativa agendada para 28/10 04:08 (cron 3414e7f8); a selecao de 82 fica na aba.
- **Tentativa das 04:08 (28/10): limite continua.** Mesmo erro, contador em 53. Reset NAO e meia-noite do Pacifico; pode ser janela movel de 24h (primeiras geracoes foram na tarde de 27/10). Proxima tentativa 28/10 06:13 (cron).
- **Tentativa das 09:32 (28/10): limite continua.** A sessao nova do Claude nao enxerga a aba antiga (outro grupo de abas do Chrome), entao abri a ferramenta numa aba nova, montei o Elenco (6 fotos: chroma-3, chroma-1, rua-1, rua-2, bone-logo, camiseta-logo) e carreguei so a lavanda-D-1 como teste. Resposta imediata: "Limite do Flow, nova tentativa em 09:51"; parei o teste. A fila de 82 da aba antiga segue intacta. Se a janela for movel de 24h, o primeiro teste que deve passar e depois das 14:42 de 28/10 (horario da primeira geracao de 27/10). Dica: ao colar a fila, usar so ctrl+v (o "ctrl+a" mandado junto digitou um "a" no inicio e invalidou o JSON).

## HANDOFF FINAL (28/10/2026, noite): 135 capas gerando na conta da Pamela

**Decisoes do Andre:** (1) NAO editar as fotos de referencia (editar piora); (2) o clip de microfone aparecendo no peito esta OK, nao reprova capa; (3) manter as fotos chroma no Elenco. Logo as 6 que eu tinha reprovado so pelo clip (alface C D, anturio C, lirio D, morango D, tomate D) estao APROVADAS, e as 7 sem 1K (alface A, babosa A, manjericao B C D E, rosa-do-deserto E) tambem estao aprovadas apos vistoria (alface-A sem logo do bone visivel por cabeca baixa, vale como ok).

**Agora:** a ferramenta Capas TG (conta da Pamela, aba do Chrome aberta, URL `.../u/5/project/9a9b36e1-8266-4dd7-8245-c86cc2a40829/tool/7f91a921-cdd1-44aa-92c5-f796332fe542`) esta gerando as 135 capas que faltavam (grama, cacto, samambaia, alecrim, hortela, pimenta, hibisco, begonia, maranta, peperomia, lavanda, salsinha, violeta, bromelia, jabuticabeira, limoeiro, girassol, roseira, buganvilia, comigo-ninguem-pode, bambu-da-sorte e os 10 coringas), ritmo 5 s entre capas e 30 s entre lotes de 6, conferencia desligada, 1 tentativa. Estimativa 5 a 7 h. NAO fechar a aba nem o Chrome.

**Quando terminar:** (1) "Baixar prontas" (as que nao vierem, baixar pelo botao da linha); mover para o scratchpad e montar folhas de 5 (script em `scratchpad`, como foi feito); (2) vistoriar uma a uma; (3) baixar o 2K de TODAS as aprovadas pelo metodo da galeria (busca pelo nome cientifico) e `place2k.py`; hoje ha 46 aprovadas sem 2K: alface A B C D E; anturio A B C D E; babosa A B C D E; cebolinha A a E; costela B; espada C; jiboia E; lirio A D E; manjericao A B C D E; morango A B C D E; rosa-do-deserto B C E; suculenta C E; tomate A B C D E; (4) `importar-cli.mjs` por especie e commitar. As jiboia A a D so baixam na conta antiga (limite dela ainda nao testado de novo). Lista completa e atualizada em `insta-terra-gentil/saida/faltam.json` (os 6 "refazer" dali agora contam como aprovados).

## ESTADO DAS 210 CAPAS (28/10/2026, fim da tarde) - lista completa em `insta-terra-gentil/saida/faltam.json`

Lote de 45 na conta da Pamela terminou: 46 prontas (com jiboia-E), 0 falhas, sem erro de limite. 1K baixadas, vistoria feita em folhas de 5. **Contagem:** 25 no banco (2K) | 33 aprovadas SEM 2K ainda (alface B E; anturio A B D E; babosa B C D E; cebolinha A a E; costela B; espada C; jiboia E; lirio A E; manjericao A; morango A B C E; rosa-do-deserto B C; suculenta C E; tomate A B C E) | 4 jiboia A a D com 2K so na conta antiga | 6 REFAZER (alface C D, anturio C, lirio D, morango D, tomate D: ponto preto bem visivel no peito, parece clip de microfone) | 7 geradas mas 1K NAO baixada pelo "Baixar prontas" (alface-A, babosa-A, manjericao B C D E, rosa-do-deserto-E: baixar uma a uma pelo botao "Baixar <id>" da linha e vistoriar) | 135 NAO geradas: grama, cacto, samambaia, alecrim, hortela, pimenta, hibisco, begonia, maranta, peperomia, lavanda, salsinha, violeta, bromelia, jabuticabeira, limoeiro, girassol, roseira, buganvilia, comigo-ninguem-pode, bambu-da-sorte e os 10 coringas.

**Problema sistematico achado na vistoria:** varias capas trazem um pontinho preto redondo no peito (clip de microfone). Ele ja existe nas fotos de referencia do Elenco (chroma-3, chroma-1, bone-logo mostram o clip na camiseta), entao o gerador copia. Aceitei so as com ponto pequeno e reprovei as com ponto bem visivel. SOLUCAO PROPOSTA: tirar o clip das referencias (editar no Flow com "remove the black microphone clip from the t-shirt" ou usar so rua-1, rua-2 e camiseta-logo, que nao tem o clip) e regerar o Elenco antes dos proximos lotes.

**Como baixar o 2K na conta da Pamela:** mesmo metodo (galeria, busca pelo nome cientifico, clique direito, Fazer o download, 2K, `python -I place2k.py` casa com as 1K). As 1K aprovadas estao em scratchpad `novas/` (se sumir, "Baixar prontas" de novo na ferramenta ou usar o botao por linha). Folhas de vistoria: scratchpad `folha_01..08.jpg`.

## HANDOFF CAPAS (28/10/2026, tarde): conta nova da Pamela funcionando

**Estado:** a conta antiga bateu o limite de uso do Flow. Mudamos para a conta da Pamela (PRO), projeto `https://flow.google.com/u/5/project/9a9b36e1-8266-4dd7-8245-c86cc2a40829`, ferramenta Capas TG recriada: `.../tool/7f91a921-cdd1-44aa-92c5-f796332fe542` (Ritmo, conferencia desligada, 1 tentativa). Elenco com 6 fotos (`andre-chroma-3`, `chroma-1`, `rua-2`, `rua-1`, `bone-logo`, `camiseta-logo`) ja na galeria desse projeto (use "Do Projeto"). TESTE OK: jiboia-E-1 gerada na 1a tentativa, vistoriada e boa (media_id `74da5e3d-4089-487a-b1e4-c49d48994f42`), falta baixar o 2K dela. O limite dessa conta ainda nao foi testado em volume: usar o contador "Geracoes nesta sessao" e anotar onde bater.

**Como subir fotos sem o seletor nativo (funciona):** servidor local temporario com CORS (`scratchpad/cors_server.py`, porta 8765, servindo `capas/referencias`) e, na pagina da galeria, `fetch` dos arquivos + `DataTransfer` + `drop` no `elementFromPoint(680,300)`; o Flow pede o aviso "Direitos de uso" (Concordo, com autorizacao do Andre). Depois parar o servidor.

**Proximo passo:** (1) baixar o 2K da jiboia-E (busca "Epipremnum aureum" na galeria dessa conta); (2) gerar em lotes de 6 pela ferramenta (fila via `fila-cli.mjs` + clipboard) os pendentes: babosa, anturio, manjericao, tomate, morango, alface, cebolinha (A a E) e as reprovadas listadas abaixo, depois as demais especies e coringas; (3) baixar "Baixar prontas" (1K), eu vistorio uma a uma, e baixo o 2K so das boas; (4) importar com `importar-cli.mjs` e commitar. As jiboia A a D ainda estao sem 2K na conta antiga (Epipremnum aureum) e so baixam la.

## ANDAMENTO DO LOTE DE CAPAS (28/10/2026, madrugada)

**Regra de fila:** a caixa "Colar fila JSON" da ferramenta guarda uma fila antiga ao reabrir; sempre clicar no campo, ctrl+a, ctrl+v, e conferir a lista antes de gerar. Elenco (6 fotos, na ordem): camiseta "Man wearing charcoal t-shirt", chroma-3, chroma-1, rua-1, rua-2, bone-logo (desmarcar a `orquidea-E-1`, que vem pre-selecionada).

| id | media_id / tentativa final | estado |
|---|---|---|
| orquidea-A-1 | `cb7bd578-876a-4835-86b3-42bbac351c2e`, tentativa 1 | APROVADA e 2K BAIXADO (`Documents\Terra Gentil\capas-2k\orquidea\orquidea-A-1.jpg`, 1792x2400). Falta rodar `importar-cli.mjs` e commitar |
| jiboia-A-1 | `614e5cc4-1c7d-43e9-ab37-9af1171e4fd4`, tent. 2 | APROVADA, falta baixar 2K |
| jiboia-B-1 | `46aaa9c6-3847-4c9a-a2ce-9edf306537c9`, tent. 2 | APROVADA, falta baixar 2K |
| jiboia-C-1 | `dcd6c5b3-e714-4528-bf51-14f2d3d01789`, tent. 2 | APROVADA, falta baixar 2K |
| jiboia-D-1 | `ed4c5257-4961-4262-b02d-fc53c603fa0b`, tent. 2 | APROVADA, falta baixar 2K |
| jiboia-E-1 | tent. 3 `880f1198-ae2e-40f8-81e3-7824d9c820be` | REPROVADA (grafia do bone errada), refeita na fila grande |

**Regra do Andre (28/10): falhas e reprovadas NAO sao refeitas na hora.** Anotar aqui e, so no fim de tudo, montar rodadas apenas com o que nao deu certo. Pendentes de refazer: jiboia-E-1 (boné/microfone, 3 tent.), lirio-da-paz-A-1 (rosto, 3 tent.).

**LIMITE DE USO ATINGIDO (28/10):** o Flow respondeu "Voce chegou ao limite de uso. Tente de novo mais tarde." ao chegar na babosa. Antes disso: 64 tentativas de geracao na fila grande (30 itens concluidos: 20 prontas + 10 em aviso; 36 falharam por limite) + 12 na orquidea A e jiboia A a E = cerca de 76 geracoes desde o inicio desta sessao, alem das da orquidea de ontem. O Flow NAO informa o teto exato; e limite de taxa, nao de creditos (creditos_gastos 0). Resultado salvo em `Documents\Terra Gentil\capas-2k\resultado-fila1-limite.json`.
**Pendentes (refazer so no fim):** falharam por limite: rosa-do-deserto-E, babosa A-E, anturio A-E, manjericao A-E, tomate A-E, morango A-E, alface A-E, cebolinha A-E. Em aviso (3 tent.): jiboia-E, espada-de-sao-jorge-C, costela-de-adao-B, lirio-da-paz-A, D, E, suculenta-C, E, rosa-do-deserto-B, C (vistoriar antes de decidir se refaz).

**VISTORIA DA FILA GRANDE (28/10, imagem por imagem no visualizador):**
- APROVADAS (20): espada-de-sao-jorge A B D E; costela-de-adao A C D E; zamioculca A B C D E; lirio-da-paz B C; suculenta A B D; rosa-do-deserto A D.
- REPROVADAS, refazer no fim (11): jiboia-E (microfone), espada-C (microfone), costela-B (rosto), lirio A (rosto), D e E (microfone), suculenta-C (rosto), E (microfone, cabeca cortada), rosa-B (rosto e microfone), C (microfone), E (camiseta e rosto).
- Mais as 36 que falharam por limite (lista acima).

**NO BANCO (28/10, 2K importado e commitado):** orquidea A B C D E; espada-de-sao-jorge A B D E; costela-de-adao A C D E; zamioculca A B C D E; lirio-da-paz B C; suculenta A B D; rosa-do-deserto A D (25 capas). Origem 2K em `Documents\Terra Gentil\capas-2k\<slug>\<id>.jpg` (fora do git).
**FALTA BAIXAR O 2K (aprovadas, sem arquivo):** jiboia A B C D. As 1K de referencia ja estao em scratchpad `ref1k/jiboia-*-1.jpg` (se o scratchpad sumir, baixar de novo por `/edit/<media_id>`: A `614e5cc4-1c7d-43e9-ab37-9af1171e4fd4`, B `46aaa9c6-3847-4c9a-a2ce-9edf306537c9`, C `dcd6c5b3-e714-4528-bf51-14f2d3d01789`, D `ed4c5257-4961-4262-b02d-fc53c603fa0b`). Busca na galeria: "Epipremnum aureum".
**PARADO EM (28/10):** a extensao do Chrome desconectou ("Browser extension is not connected") e o grupo de abas foi perdido, inclusive a aba da ferramenta Capas TG. Reabrir o Chrome, conferir a extensao, abrir `https://flow.google.com/project/57852232-f318-4573-9547-901651781160/tools` e a ferramenta Capas TG. O limite de uso do Flow ainda nao foi testado de novo desde a babosa.
**Metodo do 2K (funciona):** (1) botao "Baixar prontas" da ferramenta baixa as 1K `<id>.jpg` (referencia); (2) na galeria, buscar pelo nome cientifico (ex. "Monstera deliciosa"), clicar direito na gemea descritiva, Fazer o download, 2K; (3) `python -I place2k.py` (em scratchpad) casa cada 2K com a 1K por correlacao (1,0 = certo) e move para a pasta da especie. Esperar 1 s entre os cliques do menu e 10 s pelo download; a barra "O que voce quer criar?" cobre a linha de baixo da galeria, entao rolar para a gemea ficar no alto.

**FERRAMENTA CAPAS TG AJUSTADA (28/10):** novo painel "Ritmo" (valores salvos no navegador): Pausa entre capas 20 s, Tamanho do lote 6, Pausa entre lotes 120 s, Espera ao bater o limite 10 min; contador de geracoes da sessao; espera 5 s entre refacoes automaticas; erro de limite (limite de uso, quota, 429) nao vira "falhou": estado "esperando limite" com contagem, repete a mesma capa, e apos 3 esperas seguidas para o lote com "Limite diario provavelmente atingido". `data-status` ganhou `esperando-limite`. Usar lotes pequenos e ver o contador de geracoes para descobrir o teto.

**SEM CONFERENCIA AUTOMATICA (28/10):** o painel Ritmo ganhou "Conferencia automatica (Gemini)" (padrao DESATIVADA) e "Tentativas por capa" (padrao 1). Gera 1 vez por capa, sem chamar o Gemini; quem vistoria e o Claude, olhando as 1K baixadas por "Baixar prontas". Teste com jiboia-E-1 (28/10): o Flow ainda devolveu o limite de uso, a ferramenta entrou em "Limite do Flow, nova tentativa em 09:26" (espera de 10 min, ate 3 vezes). O limite NAO liberou depois de algumas horas. Proximo: aguardar e tentar de novo (testar de hora em hora) e so entao liberar lotes de 6.

**Fila grande (28/10):** jiboia-E + espada-de-sao-jorge, costela-de-adao, zamioculca, lirio-da-paz, suculenta, rosa-do-deserto, babosa, anturio, manjericao, tomate, morango, alface, cebolinha (66 capas). Ao trocar de fila a ferramenta perde os ids acima, entao o painel "Todas as midias" (busca pelo slug) e a fonte para achar a gemea descritiva.

## HANDOFF (27/10/2026, noite): orquidea no banco, falta a A e o metodo "gerar tudo, baixar depois"

**Estado:** `capas/banco/orquidea/` tem B, C, D, E (2K importado, 1080x1350, logo pequena no peito esquerdo) e `capas/banco/indice.json` com tags. A-1 NAO esta no banco (a antiga tinha logo grande e foi removida; a nova saiu com aviso de rosto, terminou na tentativa 3, fica a decidir). 2K originais guardados em `C:\Users\engan\Documents\Terra Gentil\capas-2k\<slug>\<id>.jpg` (fora do git). Prompt atual: logo pequena no peito esquerdo, camiseta de corte normal, quadro 3:4 sem topo livre.

**Como baixar o 2K certo (descoberto hoje):** cada imagem aparece 2x no painel "Todas as midias". A copia salva pela ferramenta tem o nome do id (`orquidea-E-1`) e SO baixa 1K. A copia gemea ao lado, com nome descritivo ("Man watering orchid in..."), tem o icone "reutilizar comando" ao passar o mouse e o menu "Fazer o download" abre submenu 1K / 2K aprimorada / 4K. Baixe o 2K da gemea descritiva (arquivo vem como `Man_..._2K_<data>.jpg`, 1792x2400) e renomeie para `<id>.jpg`. Cada TENTATIVA vira um par; a tentativa final e a mais NOVA (topo do painel). Para conferir qual par e qual id, passe o mouse na copia com nome do id.

**Decisao do Andre (27/10):** gerar TODAS as imagens primeiro (lotes por especie, sem baixar) e baixar depois, para ganhar tempo. Para nao se perder: apos cada lote, anotar aqui o id e a tentativa final de cada capa (a aba "Resultado" da ferramenta mostra `media_id` e estado; "Baixar resultado" salva o JSON), e usar a busca do painel por `orquidea-` (slug) para ver so as copias nomeadas e achar a gemea. Se der clear, retomar por aqui.

**Proximo passo exato:** (1) decidir a A da orquidea (gerar de novo ou aceitar a atual); (2) gerar os lotes das 15 principais (`node insta-terra-gentil/capas/fila-cli.mjs jiboia` etc., colar via clipboard; Elenco = camiseta nova "Man wearing charcoal t-shirt" + andre-bone-logo, chroma-1, chroma-3, rua-1, rua-2); (3) depois baixar os 2K pela regra acima e importar com `node insta-terra-gentil/capas/importar-cli.mjs "C:\Users\engan\Documents\Terra Gentil\capas-2k\<slug>"`; (4) commitar. Cuidado: a pagina da ferramenta recarrega sozinha as vezes e perde Elenco e fila.

**Comando:** `cd C:\Gitlab_hz\terra-gentil-site\terra-gentil && claude`

---

## AJUSTE (27/10/2026, noite): capas da orquidea com camiseta padrao

**Decisoes do Andre:** logo da camiseta PEQUENA, so no peito esquerdo (area do coracao), camiseta de corte normal, nao oversized. O topo livre para titulo foi REMOVIDO do prompt (`QUADRO` em `capas/prompts.mjs`: quadro 3:4, pessoa preenchendo, sem espaco vazio; o Flow nao aceita 4:5).

**Feito:** referencia de camiseta nova gerada no Flow (logo pequena a esquerda, foto #1 do Elenco, nome "Man wearing charcoal t-shirt"), pois o upload local nao funciona pela automacao. Lote da orquidea A a E gerado com ela (A com aviso de rosto, B a E prontas). O lote usou ainda o prompt antigo de topo livre na geracao, mas saiu com a pessoa preenchendo o quadro.

**Banco organizado com tags (27/10, noite):** `capas/banco/<slug>/` por especie + `capas/banco/indice.json` (id, arquivo, especie, cenario A a E, tags). `capas/indice.mjs` tem `porTags(indice, ['orquidea','regando'])` e `lerIndice` para o carrossel; `importar-cli.mjs` agora aceita A a E e nomes do download do Flow (`orquidea-E-1_20261027....jpg`) e atualiza o indice. **2K:** o menu da imagem (galeria e pagina da imagem) so baixa 896x1200 (1K) para as capas geradas pela ferramenta; a opcao 2K nao apareceu. O import escala 1,2x para 1080x1350. Decisao pendente: importar o 1K ou achar o 2K.

**Falta:** Andre aprovar a qualidade; baixar 2K pelo painel (usar `media_id` na URL de edicao), renomear `<id>.jpg`, `node capas/importar-cli.mjs <pasta>`, trocar os 3 arquivos antigos de `capas/banco/orquidea/` (camiseta lisa) e commitar. Atencao: a pagina da ferramenta recarrega sozinha durante a geracao e perde Elenco e fila (as imagens ficam salvas no projeto).

---

## HANDOFF (27/10/2026, tarde): capas com o Andre, orquidea testada, falta o lote

**Onde paramos:** codigo e ferramenta prontos, teste da orquidea feito e vistoriado. NADA de imagem no banco ainda (`capas/banco/` vazio, de proposito: o banco recebe so o 2K aprovado). Gerar imagem nao gasta credito no plano Pro (saldo 1.050 antes e depois, conferido no historico do Google One).

**Codigo (commit a1657e6, 171 testes verdes):** `insta-terra-gentil/capas/`. Slide 1 do carrossel usa a capa do banco quando a especie tem; rodizio pela contagem de `dados/posts`. `dados/capas.json`: 36 especies x 5 cenarios (A segurando, B cuidando, C ambiente, D ensinando, E regando) + 10 coringas x 3 = 210 imagens. Camiseta OFICIAL Terra Gentil (cinza escuro, logo laranja no peito, decisao do Andre): para a logo nao sair "TIRRA", o prompt traz o texto entre aspas, planos medios e manda copiar de uma foto de referencia so da logo, `capas/referencias/andre-camiseta-logo.jpg` (recorte da chroma-3, fora do git). O Agente do Flow confirmou que isso melhora muito; se ainda errar, corrigir por edicao de imagem ("Fix the spelling on the logo to read TERRA GENTIL"). CLIs: `node capas/fila-cli.mjs <slug>` (gera `saida/fila-capas.json`) e `node capas/importar-cli.mjs <pasta>` (corta para 1080x1350 e poe no banco; nome do arquivo = `<slug>-<A..E>-<n>.jpg`).

**Ferramenta "Capas TG" no Flow (conta eng.andrehz, projeto 57852232):** Elenco, fila JSON, geracao 1 por vez, conferencia rigida pelo Gemini com ate 2 refacoes automaticas, salva a imagem no painel com o id no nome (`orquidea-B-1`). Cabeca/topo ocupado agora so INFORMA (tag "TOPO OCUPADO"), nao reprova; `bone_correto` so reprova logo visivel e errada. Sempre editar em rodadas curtas ("Keep everything as it is..."), campo achado por `find`, enviar com a seta se Enter nao enviar.

**Ferramenta, ajustes de hoje:** a conferencia da camiseta agora e `camiseta_logo_correta` (verdadeira se a logo nao aparece ou le TERRA GENTIL; falsa so se visivel e errada), e as miniaturas abrem um visualizador grande (setas, Esc, tentativas), tambem durante a geracao.

**Vistoria da orquidea (4 imagens vistas em 1K, ainda com camiseta LISA, antes da troca):** B-1, D-1, E-1 aprovadas (rosto fiel, folhas saudaveis, logo do bone ok). C-1: aprovada com ressalva (linha "GENTIL" do bone cortada pela aba). A-1 nova ainda NAO vista. Como a camiseta mudou para a oficial, REFAZER a orquidea inteira no proximo teste. O painel mostra cada imagem duas vezes (a ferramenta salva em duplicado): baixar so uma de cada nome.

**Fotos 2K:** o SDK da ferramenta NAO baixa 2K. So no painel "Todas as midias": menu da imagem > "Fazer o download" > 2K (aprimorada); 4K exige upgrade. A ferramenta baixa 1K (896x1200). Plano: gerar tudo, vistoriar, baixar no 2K pelo painel, renomear para `<id>.jpg`, importar, commitar.

**Atalhos aprendidos:** copiar o JSON da fila com `Set-Clipboard` e colar com ctrl+v no campo (digitar 6 KB e lento). Elenco perde-se ao recarregar: "Do Projeto" + ctrl+clique nas 5 fotos `andre-*` (chroma-3, chroma-1, rua-1, rua-2, bone-logo), ou "Carregar elenco" com `capas/referencias/elenco-capas.json` (fora do git). Ler `Minhas criacoes` do Flow nao e preciso.

**Pedidos do Andre ainda abertos:** (1) FEITO: miniatura abre a imagem grande; (2) gerar sozinho, sem pedir confirmacao a cada geracao (memoria `feedback-gerar-sozinho`); (3) lotes de 5 em 5 (uma especie por lote), vistoria minha antes de baixar.

**Achado (27/10):** o `media_id` que a ferramenta mostra abre direto a pagina da imagem: `https://flow.google.com/project/57852232-f318-4573-9547-901651781160/edit/<media_id>` (titulo = id, botao de download no topo, menu 1K/2K). Use isso para baixar o 2K da imagem certa sem confundir as copias duplicadas do painel. Ideia aberta: rodada no Criador para por link "Abrir no Flow" por linha; e ver, com read_network_requests, se o clique em 2K usa uma URL direta reaproveitavel.

**Proximo passo exato:** (a) subir `capas/referencias/andre-camiseta-logo.jpg` no Elenco da ferramenta (sem rosto; limite de 6 fotos, hoje 5: ou trocar a rua-2 por ela) e gerar o teste novo da orquidea com os 5 cenarios (`node capas/fila-cli.mjs orquidea`, colar via clipboard); (b) vistoriar as 5 (eu olho cada uma antes de baixar; atencao a grafia TERRA GENTIL na camiseta e no bone), baixar no 2K pelo painel, importar, commitar `capas/banco/orquidea/`; (c) lotes das 15 principais restantes (`node capas/fila-cli.mjs jiboia` etc.), depois secundarias e coringas; (d) folha de prova por grupo para o Andre; (e) ligar coringas ao post (hoje `capaDoDia` busca por `post.especie`; coringa usa chave `coringa-regar` etc., falta o mapa tema para coringa); (f) opcional: o molde escolher titulo em cima/embaixo conforme a tag TOPO OCUPADO.

**Pendencias antigas ainda validas:** rascunho vazio "Miniaplicativo sem titulo" no Flow (so o Andre exclui); Chromium do Playwright falta neste PC (`npx playwright install chromium-headless-shell`) para render local; N6 do Search Console; IG_PUBLICAR segue `desligado`; testar `renovar-token-instagram.yml` a mao.

**Terminal:** `warning.confirmCloseAllTabs: true` ligado (so vale com 2+ abas). Retomar sessao fechada: `claude -c`.

**Comando:** `cd C:\Gitlab_hz\terra-gentil-site\terra-gentil && claude`

---

## AJUSTE (27/10/2026, manha): capa e titulo do carrossel

**Conferido no ar:** a rotina das 04:00 gerou o post de 28/10 (IMORTAL), mesclou, e a noticia `/noticias/espada-de-sao-jorge-como-regar-sem-afogar` esta no ar (200, index, JSON-LD, sitemap, feed). Instagram segue desligado. A noticia sai com data de amanha porque a rotina escreve o dia seguinte e o site publica ao mesclar.

**Corrigido:** (1) titulo longo ("espada-de-sao-jorge") nao quebra mais no hifen: `tratamento-texto.mjs` trava cada linha do h1 e encolhe todas pelo mesmo fator (`fatorDeEncolhimento`, com teste), mantendo a altura da linha; testado nos 7 moldes, sem aviso de estouro. (2) capa com desfoque e veu leves (`tratarFoto` com `capa`, ESCURECIMENTO_CAPA 30, veu do album) para a planta aparecer. (3) foto curada da espada-de-sao-jorge em `dados/fotos.json` (CC0, folhas nitidas, no lugar do mato com galhos); capa do site trocada. (4) legenda de exemplo "2 cm acima da gema" vazava no passo do molde album: agora "terra gentil".

**Risco aberto:** a foto automatica escolhe so por proporcao e licenca, nao por qualidade. Como a noticia vai ao site sozinha, curar a foto de cada especie ANTES da rotina escrever o post dela (`node insta-terra-gentil/imagem/curar-cli.mjs "Especie"`).

## ESTADO (26/10/2026, fim da noite): publicacao no Instagram montada, DESLIGADA

**Feito hoje:** nome cientifico em `especie` (corrige foto de cobra), desfoque/gradiente/sombra/realce de foto/titulo equilibrado nos moldes, enquadramento variado, retry do Chromium no CI. Publicacao no IG pronta e testada com IG falso: `insta-terra-gentil/publicar/instagram/` (cliente Graph API, carrossel, registro anti-duplicata). Teste de ponta a ponta no GitHub OK com o botao desligado (previa gera pacote na branch `ig-slides`, `postar-instagram.yml` confere e NAO posta).

**Noticias no site (N1 a N5 prontas, 26/10 noite):** o post ganhou o campo `materia` (texto de 600+ palavras com fatos por secao, FAQ), validado em `pauta/materia.mjs` e pedido no prompt da rotina. Site: `/noticias`, `/noticias/[slug]`, `/noticias/feed.xml`, JSON-LD Article/FAQ/Breadcrumb, sitemap, menu, rodape e home (tudo so aparece com ao menos 1 noticia; vazio = noindex). GA4: `NewsTracker` (news_view, news_read_75, cta_ebook_click, cta_instagram_click), doc em `docs/ANALYTICS.md`. Workflow: grava capa e credito em `public/noticias/<slug>/` e o link entra na legenda so se a pagina estiver no ar. **ATENCAO:** a noticia vai ao ar no site SOZINHA quando o post com `materia` e mesclado (o botao IG_PUBLICAR so controla o Instagram). A rotina das 04:00 de 27/10 ja deve gerar a primeira. Falta: N6 (Search Console, com o Andre: `docs/ETAPA-NOTICIAS-SITE.md`), ligar evento-chave e dimensoes no GA4 (`docs/ANALYTICS.md`), conferir a 1a noticia real (texto, fatos, capa).

**Foto:** curadoria pronta (`node insta-terra-gentil/imagem/curar-cli.mjs "Especie"`), automatico de reserva; falta curar as especies que importam.

**BOTAO:** variavel do repo `IG_PUBLICAR` (hoje `desligado`). So `ligado` posta. `gh variable set IG_PUBLICAR --body ligado`.

**Meta (feito 26/10 noite):** app `Terra Gentil Publicador` (ID 1671676171195897, modo desenvolvimento, portfolio Terra Gentil, e-mail canalterragentil@gmail.com). Permissoes `instagram_business_basic` e `instagram_business_content_publish`. @canalterragentil e Testador do Instagram (convite aceito). IG_USER_ID 17841474413071263. Secrets `IG_USER_ID` e `IG_ACCESS_TOKEN` cadastrados e VALIDADOS (run 40413778021, `so_token`, "token e conta conferidos, nada publicado"). Publicacao real ainda NAO testada (decisao: ajustar na hora de postar). Token vale 60 dias (gerado 26/10, vence ~25/12). Cadastrar secret: `gh secret set` com `!` grava VAZIO (sem stdin); usar `powershell -NoProfile -Command "Get-Clipboard" | gh secret set NOME --repo terra-gentil/terra-gentil`.

**Falta para postar de verdade (Fase B/C):** (3) cadastrar gatilho no TriggerAll para `postar-instagram.yml` no horario de postar; (4) renovacao do token: workflow `renovar-token-instagram.yml` PRONTO (dias 1 e 15), secret `GH_PAT_SEGREDOS` CADASTRADO 26/10 (PAT fine-grained, Secrets read/write, so este repo, vence 25/10/2027, renovar ate la). FALTA testar: rodar o workflow a mao a partir de 27/10 (Meta exige token com mais de 24h) e conferir que a data do secret IG_ACCESS_TOKEN muda; (5) previa e aprovacao no Telegram antes de ligar; (6) CI do site vermelho por lint em app/app/page.tsx e app/jogo/page.tsx (nao relacionado).

---

## HANDOFF (26/10/2026, noite): colar no inicio da proxima sessao

**Onde paramos:** o pipeline do Instagram do Terra Gentil funciona de ponta a ponta, SEM publicar no Instagram. Teste real feito: a rotina (`trig_01BH4izGfvqgUA9V7hmgMPVR`, 04:00 BRT) escreveu o post de 27/10 (livro CODIGO, serie Socorro, 6 fatos com pagina), empurrou a branch `claude/insta-routine-20261026-1913`, o webhook acionou o TriggerAll (gatilho #014), que disparou o `publish-instagram.yml` (run 40384815084): validou, mesclou na main (commit e0181cf, bot do GitHub) e gerou a previa (artefato `carrossel-2026-10-27`, 8 MB). A Vercel aceitou o commit do bot (risco da etapa de noticias nao se confirmou).

**Decisoes:** sem API paga, texto por rotina agendada do Claude (como no Pearl Jam); fato so com pagina e trecho literal conferido no livro; foto so CC0/CC BY; repo publico, entao o validador do ramo so aceita a conta claude e so `dados/posts` e `dados/rotina-log`; prefixo `claude/insta-routine-` (TriggerAll ajustado, 1c61803).

**Proximo passo exato:** (1) Andre confere a previa (baixar o artefato do run 40384815084) e o texto de `dados/posts/2026-10-27-codigo.json`; o campo `nome` saiu generico ("planta"), ajustar `pauta/routine-prompt.md` para exigir o nome popular da planta se quiser; (2) decidir a foto (lista curada em `dados/fotos.json` ou automatico); (3) etapa de noticias no site com SEO e GA4, comecando pela N1 (campo `materia`), plano em `docs/ETAPA-NOTICIAS-SITE.md`; (4) previa no Telegram e publicacao pela Graph API (nao existe hoje).

**Arquivos chave:** `insta-terra-gentil/pauta/routine-prompt.md` e `pauta/prompts/voz-terra-gentil.md` (prompt da rotina), `pauta/rotina-cli.mjs`, `publicar/rotina/mesclar-cli.mjs`, `.github/workflows/publish-instagram.yml`, `C:/Gitlab_hz/triggerall/backend/src/routes/webhooks.js`.

**Comando:** `cd C:Gitlab_hz	erra-gentil-site	erra-gentil && claude`

---

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

### Como o TriggerAll funciona (lido em C:/Gitlab_hz/triggerall, 26/10)
- Gatilho = `{ name, type: "github_workflow", config: { owner, repo, workflow_id, ref, token_env, inputs }, schedule (cron UTC), on_success_trigger_id }`, cadastrado no painel (login com senha). Ele mesmo dispara o workflow no horario, por isso os workflows nao tem `schedule` no YAML.
- `POST /webhooks/github` (assinado com HMAC, segredo `GITHUB_WEBHOOK_SECRET` no Railway): em `push` na ref `refs/heads/claude/news-routine-*` dispara na hora o gatilho cujo `config.repo` = nome do repo e `config.workflow_id` = `publish-instagram.yml`. Isso esta FIXO no codigo (webhooks.js).
- Ao fim de um workflow (`workflow_run` completed) registra o resultado e encadeia `on_success_trigger_id`. Dedup de 3 min.
- Para o Terra Gentil funcionar: (a) o prefixo `claude/insta-routine-` precisa ser aceito (3 linhas em webhooks.js, hoje so `claude/news-routine-`); (b) webhook do GitHub no repo terra-gentil/terra-gentil apontando para o Railway, com o mesmo segredo; (c) um gatilho com `repo: "terra-gentil"` e `workflow_id: "publish-instagram.yml"`; (d) o PAT do Railway (`token_env`) precisa de acesso a Actions do repo da org terra-gentil (hoje e conta andrehz4).

### Estado atual (fim de 26/10)
- Funcionam e estao testadas: pauta por RSS, busca/download de foto, `montar-dia`, e o lado do repo da rotina (CLI, conferencia dos fatos contra o livro, validador do ramo, orquestracao do merge).
- Merge da rotina testado de ponta a ponta com git de verdade num remoto local (so o `gh` simulado): ramo bom entra e a branch e apagada; commit de outra conta, diff que mexe em codigo e post adulterado sao RECUSADOS e a main fica intacta.
- `.github/workflows/publish-instagram.yml` criado (so `workflow_dispatch`): job 1 valida e mescla, job 2 renderiza o post do dia e guarda os 8 PNGs e a legenda como artefato. YAML validado, mas NAO executado no GitHub ainda. Publicacao no Instagram ainda nao existe.
- Ligacao fechada: webhook + gatilho #014 + token funcionando (ver Proximo passo 1). Falta so a rotina rodar de verdade (primeira 27/10 04:08 BRT, ou rodar agora para testar tudo).
- TriggerAll (repo terra-gentil/triggerall): `webhooks.js` agora aceita `claude/insta-routine-*` alem de `claude/news-routine-*`, 2 testes novos, 9/9 passando, push feito (1c61803). Railway deve redeployar sozinho.
- ROTINA CRIADA no claude.ai: `trig_01BH4izGfvqgUA9V7hmgMPVR` (https://claude.ai/code/routines/trig_01BH4izGfvqgUA9V7hmgMPVR), todo dia 07:00 UTC = 04:00 BRT, claude-sonnet-5-5, so o repo terra-gentil/terra-gentil, SEM conectores (o servidor anexou Gmail, Drive e Docs sozinho; removi). Primeira execucao: 27/10 as 04:08 BRT. Ela empurra uma branch `claude/insta-routine-*`; enquanto o webhook e o gatilho do TriggerAll nao existirem, a branch fica esperando (o workflow pode ser disparado a mao: `gh workflow run publish-instagram.yml`).
- Licenca de foto: padrao aceita so CC0, dominio publico e CC BY. CC BY-SA fica FORA.

### Proximo passo
1. (FEITO em 26/10, junto com o Andre) Webhook no repo terra-gentil/terra-gentil apontando para `https://triggerall-production.up.railway.app/api/webhooks/github`, eventos push e workflow_run, mesmo segredo do Railway: "Last delivery was successful". Gatilho #014 "Terra Gentil: Publish Instagram" criado no painel (https://triggerall.vercel.app), owner/repo terra-gentil, workflow `publish-instagram.yml`, ref main, token pela variavel `GITHUB_ACTION` (o token ja tem acesso ao repo da org). Teste real: "Disparar agora" no painel dispara o workflow no GitHub e o run 40384341133 terminou em sucesso (mesclar ok; previa pulou a instalacao do Chromium por nao haver post).
2. (feito) Rotina criada. Opcional: rodar agora para testar tudo de ponta a ponta (rotina, branch, workflow, merge) sem esperar as 04:00.
3. ETAPA NOVA, pedida pelo Andre: noticias no site com SEO e GA4, no mesmo momento do Instagram. Plano completo em `docs/ETAPA-NOTICIAS-SITE.md` (N1 a N6). Risco principal: Vercel pode bloquear o deploy do commit do bot.
4. Andre decide a foto: lista curada por especie em `dados/fotos.json` (vazio hoje) ou automatico com conferencia na previa.
5. Previa no Telegram e publicacao na Graph API (depois do workflow rodar de verdade).
6. Noticias do RSS como segunda fonte de pauta (a rotina le `_pending` como no Pearl Jam).
7. Opcional: Pixabay ou Unsplash como segundo provedor quando houver chave.

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

