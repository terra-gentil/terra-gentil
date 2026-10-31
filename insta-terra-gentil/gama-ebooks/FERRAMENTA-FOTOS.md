# Ferramenta "Fotos Ebook TG" no Google Flow

Gera as fotos do miolo dos ebooks (gesto do passo a passo, sintoma, variedades). Irmã da
"Capas TG" (`capas/FERRAMENTA-FLOW.md`), com as lições dela já aplicadas. Uma ferramenta por conta
(Pamela e eng.andrehz): o 2K só baixa na conta que gerou. Criar não gasta crédito; gerar gasta.

## O que muda em relação à Capas TG

| Capas TG | Fotos Ebook TG | Por quê |
|---|---|---|
| Prompt inteiro por capa | `estilo` no topo + `cena` curta por foto | Colar a fila custava ~10 mil tokens a cada 3 capas |
| Elenco em todas | `elenco: true/false` por foto | Planta sozinha não leva o André |
| Elenco some ao recarregar | Elenco guardado (mediaIds no armazenamento local) | Subir 6 fotos a cada abertura |
| Sempre 3:4 | `proporcao` por foto (9:16, 3:4, 1:1) | Página inteira x miniatura da galeria |
| Gemini confere rosto e logo | Confere espécie, mãos e texto; rosto só com elenco | Foto de ebook não tem logo |

## Formato da fila

```json
{"livro": "TG 001",
 "estilo": "documentary photo, natural window light, ...",
 "fotos": [{"id": "orq-gesto-1", "especie": "Phalaenopsis", "proporcao": "9:16",
            "elenco": true, "cena": "Close-up of ..."}]}
```

Prompt enviado = `cena` + ". " + `estilo`, exatamente, sem reescrever. Filas em `gama-ebooks/fila-fotos-<livro>.json` (a pasta `fotos/` e ignorada pelo git).

## Pedido ao Criador, em 5 rodadas (uma por vez; da 2a em diante começa com "Keep everything as it is")

**Rodada 1, base**
```
Build a tool called "Fotos Ebook TG": a batch generator of photorealistic photos for the inner pages of gardening ebooks. UI in Brazilian Portuguese, dark theme, dense layout. Input: file input (aria-label "Enviar fila JSON") and textarea (aria-label "Colar fila JSON") with button "Carregar fila". Format: {"livro": "TG 001", "estilo": "...", "fotos": [{"id": "orq-gesto-1", "especie": "Phalaenopsis", "proporcao": "9:16", "elenco": true, "cena": "..."}]}. The prompt for each photo is exactly cena + ". " + estilo, never rewritten, translated or shortened; show it collapsible in the row. One row per photo: checkbox (aria-label "Selecionar <id>"), id, especie, proporcao, elenco yes/no, state. Show "Total N" after loading. Image model always Nano Banana Pro, the row's aspect ratio (or the closest available, show which), highest resolution, ONE image per photo. Button "Gerar selecionadas" shows inside the page (no browser dialog) the list and estimated credits with "Confirmar geracao" and "Cancelar", then runs ONE photo at a time with a 3 second pause. States: pendente, gerando, conferindo, pronta, aviso, falhou. Button "Parar". Save each result with the id as media name.
```

**Rodada 2, erros**
```
Keep everything as it is. On a generation error show the message in the row, wait 20 s with a visible countdown and retry ONCE; on quota or unsafe errors do not retry and mark "falhou" with the reason. If the error is a quota limit, stop the queue and show "Limite do Flow" at the top. "Parar" also cancels a pending retry. Add per row "Gerar de novo <id>" with the same in-page confirmation.
```

**Rodada 3, elenco**
```
Keep everything as it is. Add a panel "Elenco" with ONE person, "Andre": 1 to 6 reference images, from the project (Flow.media.selectMultiple, aria-label "Imagens do projeto Andre") or local files (aria-label "Enviar imagem Andre", Flow.upload). Remember the Elenco media ids in local storage so they are still there when the tool is opened again; button "Limpar elenco". Send the Elenco images as reference images ONLY for photos with "elenco": true; photos with "elenco": false get no reference image.
```

**Rodada 4, conferência**
```
Keep everything as it is. After each image, call Flow.generate.text with the image (plus one Elenco image when elenco is true) and ask Gemini for JSON only: {"planta_certa": bool, "maos_ok": bool, "texto_na_imagem": bool, "rosto_igual": bool or null, "resumo": "short sentence"}. "planta_certa" means it really looks like the species in "especie". rosto_igual is null when elenco is false. Any false (or texto_na_imagem true) marks the row "aviso" with badges PLANTA!, MAOS!, TEXTO!, ROSTO!. Show a thumbnail in the row.
```

**Rodada 5, saída e automação**
```
Keep everything as it is. Per ready row "Baixar <id>" (download once per click, filename "<id>.jpg", in the highest resolution Flow offers, 2K if available). Button "Baixar todas prontas" downloads them one by one. Section "Resultado" with read-only textarea (aria-label "Resultado JSON") always updated with {"livro", "fotos": [{"id", "estado", "media_id", "conferencia", "erro"}], "creditos_gastos"} and button "Baixar resultado". Add a hidden <div id="estado-fotos" data-status="..." data-prontas="N" data-falhas="N" data-gerando="id"> kept up to date, and stable Portuguese aria-labels on every control.
```

## Estado

| Conta | Ferramenta | Elenco |
|---|---|---|
| eng.andrehz | CRIADA 31/10, `/project/db0dc6c0-4e26-452d-9c3d-bbfa4ac6f70d/tool/7fab2c63-e6ed-49c5-b319-30466abdbdd8`, fixada na barra; fila de 8 testada (Total 8); painel Mascote e campo `mascote` (rodadas 6 e 7, 31/10 tarde) | Gentileza subido no projeto como `image.png`; Elenco (4 fotos) e Mascote escolhidos pela "Imagem do projeto" (ctrl+clique marca varias), mas **somem ao recarregar a pagina** nesta conta: montar de novo antes de cada geracao |
| Pamela (u/5) | CRIADA 31/10, `/u/5/project/9a9b36e1-8266-4dd7-8245-c86cc2a40829/tool/d39226f8-3f50-4ca3-8fc3-29158da6a89e`, fixada; icones trocados por SVG na rodada 5; fila de 8 testada; painel Mascote e campo `mascote` (rodadas 6 e 7, 31/10) | 4 fotos do Andre (andre-rua-1/2, bone, camiseta) + Mascote: Gentileza acenando, salvos |

Licoes da criacao (31/10): na tela de Criar ferramenta da Pamela o clique pela ref perdeu o texto, o clique por coordenada no campo funcionou (o contrario da conta eng.andrehz); enviar pela seta. Na caixa da fila, ctrl+a e ctrl+v na mesma chamada viram a letra 'a': mandar ctrl+a, Delete e ctrl+v em chamadas separadas. A fila vai pelo clipboard (Set-Clipboard).

**Rodada 6 (31/10, pedido do Andre: corrigir gerando de novo gasta credito demais), aplicada nas duas contas:** sem nova tentativa automatica; erro marca falhou e a fila segue (limite ainda para a fila); linha em aviso NAO e regerada, fica com a nota 'corrigir no pos'; 'Gerar de novo' so por clique manual. Defeito se corrige no tratamento depois.

## Mascote Gentileza (31/10/2026)
Rodadas 6 e 7 na Pamela (pedido unico longo deu "Algo deu errado"; em duas curtas passou): painel
"Mascote: Gentileza" abaixo do Elenco e campo `"mascote": true` na fila. A foto marcada recebe a
imagem do Gentileza como referencia e o sufixo: boneco de plastico impresso em 3D, pequeno, desfocado,
numa prateleira ou janela; a planta segue como assunto. Teste: orq-gesto-1 saiu com o boneco discreto
na prateleira do fundo. Rodadas 6 e 7 repetidas na conta eng.andrehz (31/10 tarde), com estes textos:
```
Keep everything as it is. Add a panel "Mascote: Gentileza" right below the Elenco panel: ONE reference image of the mascot, from the project (Flow.media.selectMultiple, aria-label "Imagens do projeto Mascote") or a local file (aria-label "Enviar imagem Mascote", Flow.upload). Show its thumbnail, remember its media id in local storage so it is still there when the tool is opened again, and add a button "Limpar mascote".
```
```
Keep everything as it is. Add an optional field "mascote": true per photo in the queue and show it in the row (mascote yes/no). For photos with "mascote": true, also send the Mascote image as a reference image and append to the prompt: ". A small 3D-printed plastic figurine of the mascot from the reference image appears as a tiny, slightly out-of-focus detail on a shelf or windowsill in the background; the plant stays the main subject." Photos without mascote stay exactly as before.
```
**Subir imagem sem janela do Windows:** copiar a imagem para a area de transferencia
(`[System.Windows.Forms.Clipboard]::SetImage` em `powershell -STA`) e dar ctrl+v na caixa
"O que voce quer criar?" da pagina do projeto: ela entra na galeria (Imagens/Envios). Depois tirar o
anexo da caixa no X e escolher pela "Imagens do projeto" da ferramenta.
