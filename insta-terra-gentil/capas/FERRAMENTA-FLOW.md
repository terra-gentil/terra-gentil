# Ferramenta "Capas TG" no Google Flow

Mesmo molde da "Fila MR" do marca registrada: criada no Flow em Ferramentas > Criar, colando o
pedido abaixo no "Criador de ferramentas" (em inglês, o Flow escreve o código sozinho). Gasta os
créditos da assinatura, nunca API paga.

## Estado

CRIADA em 27/10/2026 (conta eng.andrehz, Ferramentas > Minhas criações > "Capas TG", fixada na
barra). Lição: o Criador dá "Algo deu errado" com pedido longo (falhou 4 vezes com o texto
abaixo inteiro). Funciona em rodadas curtas, uma por vez, cada uma começando com "Keep
everything as it is". Foram 5: base, erro e Parar, elenco e Resultado, conferência do Gemini,
aria-labels e `#estado-capas`. Clicar no campo do Criador pelo nome ("O que você quer criar?"),
nunca por coordenada: o clique por coordenada perde o texto. O Nano Banana Pro no Flow não tem
4:5: a ferramenta gera em 3:4 e o `importar-cli.mjs` corta para 1080x1350.

## Pedido completo (referência do que a ferramenta faz)

```
Build a tool called "Capas TG": a batch generator of photorealistic Instagram carousel covers for a
Brazilian gardening channel. UI in Brazilian Portuguese, dark theme, dense layout. It will be
operated mostly by an AI agent through browser automation, so every control has a stable aria-label
in Portuguese (exactly the labels below) and every state is plain text in the DOM, plus a hidden
<div id="estado-capas" data-status="..." data-prontas="N" data-falhas="N" data-gerando="id">.

ELENCO: panel "Elenco" with ONE person, name "Andre". 1 to 6 reference images, added from the
project (Flow.media.selectMultiple, aria-label "Imagens do projeto Andre") or from local files
(aria-label "Enviar imagem Andre", Flow.upload). Buttons "Baixar elenco" (elenco-capas.json with
mediaIds) and "Carregar elenco" (that file or pasted text), so references are added only once.

INPUT: file input (aria-label "Enviar fila JSON") and textarea (aria-label "Colar fila JSON") with
button "Carregar fila". Format: {"capas": [{"id": "orquidea-A-1", "especie": "Phalaenopsis",
"nome": "orquidea", "prompt": "..."}]}. One row per item: checkbox (aria-label "Selecionar <id>"),
id, nome, state, collapsible prompt. Buttons "Selecionar todos" and "Limpar selecao".

GENERATION: image model always "🍌 Nano Banana Pro", aspect ratio 4:5 (or the closest portrait
ratio available, show which one), highest resolution available, ONE image per item. Send all
Elenco images as reference images. Send the prompt exactly as given, never rewrite, translate,
enhance or shorten. Button "Gerar selecionadas" first shows, inside the page (no browser dialog),
the list and the estimated credits with "Confirmar geracao" and "Cancelar". Then it runs ONE item
at a time, in order. State per row (text and data-estado): pendente, gerando, conferindo, pronta,
aviso, falhou. On error show the message, wait 20 s with a visible countdown and retry ONCE; on
quota or unsafe errors do not retry. Button "Parar" (also cancels a pending retry) and per row
"Gerar de novo <id>" (same in-page confirmation). Save each result with the id as media name.

AUTOMATIC CHECK: after each image call Flow.generate.text with the image plus one Elenco image and
ask Gemini for JSON only: {"rosto_igual": bool, "logo_legivel": bool, "maos_ok": bool,
"planta_certa": bool, "topo_livre": bool, "texto_na_imagem": bool, "resumo": "short sentence"}.
"planta_certa" means it really looks like the species in "especie". Any false (or
texto_na_imagem true) marks the row "aviso" with the reason as a badge (ROSTO!, LOGO!, MAOS!,
PLANTA!, TOPO!, TEXTO!). Show the image thumbnail in the row.

OUTPUT: per ready row "Baixar <id>" (Flow.download exactly once per click, filename "<id>.jpg").
"Baixar todas prontas" downloads each ready image one by one as "<id>.jpg". Section "Resultado"
with read-only textarea (aria-label "Resultado JSON") always updated with {"capas": [{"id",
"estado", "media_id", "conferencia", "erro", "tentativas": [{quando, media_id, erro}]}],
"creditos_gastos"} and button "Baixar resultado" (resultado-capas.json).
```

## Uso (passo a passo)

1. Gerar a fila: `node capas/fila-cli.mjs orquidea` (sem slug = todas; `--por-cenario 2` dobra).
   Sai em `saida/fila-capas.json`.
2. No Flow, abrir a ferramenta "Capas TG". Na 1a vez, o André sobe as fotos de
   `capas/referencias/` no Elenco e clica "Baixar elenco" (guardar o JSON junto das referências).
3. "Carregar fila" com o JSON, "Gerar selecionadas", conferir o custo e confirmar.
4. Linha com aviso: olhar a imagem. Só entra no banco o que o André aprovar.
5. "Baixar todas prontas", **triar o rosto antes de o André ver**:
   `node capas/rosto/triar-cli.mjs <pasta>` move para `<pasta>/_rosto-reprovado` as capas com
   rosto diferente do dele (nota abaixo de `LIMITE_ROSTO`, ou sem rosto). Só o que sobra vai
   para a revisão do André. Depois importar: `node capas/importar-cli.mjs <pasta>`.
6. Commitar `capas/banco/`. O carrossel passa a usar a capa sozinho (rodízio por espécie).
