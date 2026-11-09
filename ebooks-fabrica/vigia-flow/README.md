# TG Vigia das Fotos

Versao enxuta da extensao-vigia do Marca Registrada (youtube-white-label/inteligencia-imagens/extensao-vigia), para a
ferramenta Fotos Ebook TG. Serve para o Claude NAO ficar conferindo a tela: ele liga o `esperar-fim.mjs` em segundo
plano e so acorda no fim, na falha ou no limite.

## Como funciona
1. A extensao le, dentro da moldura da ferramenta, a div escondida `#estado-fotos` (ou os contadores do cabecalho).
2. Manda ao `receptor.mjs` (127.0.0.1:47812), que grava `saida/estado.json` e `saida/historico.ndjson`.
3. `node esperar-fim.mjs` le o arquivo e imprime `VIGIA fim|limite|sem-sinal|demorou`.

## Instalar (uma vez)
Chrome > chrome://extensions > ligar "Modo do desenvolvedor" > "Carregar sem compactacao" > escolher esta pasta
(`C:\Gitlab_hz\terra-gentil-site\terra-gentil\ebooks-fabrica\vigia-flow`). Depois recarregar a aba da ferramenta (F5).

## Usar em cada rodada
- `node receptor.mjs` em segundo plano (uma vez por sessao).
- Depois de "Confirmar geracao": `node esperar-fim.mjs --quieto 60` em segundo plano.

`saida/` nao vai para o git.
