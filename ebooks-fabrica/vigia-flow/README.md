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

## 2K da galeria (v1.2, laco dentro da extensao)
O laco de 2K saiu do console e mora na extensao (`laco2k.js` + `conteudo-galeria.js`), no mundo isolado: nada de
`window.__baixar2k`, `localStorage.b2k`, politica de Trusted Types ou atributo `data-b2k` na pagina do Flow.
- Abrir a galeria do projeto (uma aba so, em primeiro plano, fora da tela da ferramenta).
- `node pode.mjs` (tem de imprimir `PODE`), depois gravar `2k <a> <b> <passo>` em `saida/comando.txt`
  (ex.: `2k 0 7 1` na Pamela, `2k 1 15 2` onde a galeria duplica). A aba pega o comando no pulso (ate 25 s).
- `node esperar-2k.mjs` em segundo plano: imprime `VIGIA2K fim|limite|sem-sinal|demorou <novos 2K> <estado>`.
- `parar2k` em `saida/comando.txt` cancela o laco.
- Ritmo: esperas sorteadas, no maximo 3 downloads por minuto, 20 por rodada, pausa longa de vez em quando.
  Uma rodada de 8 fotos leva uns 3 minutos. E de proposito, nao acelerar.
- `../baixar2k.js` (colar no console) virou plano B: funciona, mas deixa pegada na pagina.

## Travas contra cara de robo (v1.2)
- Primeiro "Limite do Flow", primeira "atividade incomum" ou primeira "Falha no aumento de resolucao": o laco
  de 2K PARA e nao tenta de novo. Na geracao, a extensao clica "Parar" na ferramenta se ainda ha foto gerando.
- O receptor grava `saida/alerta.json` e recusa comando de 2K por 60 min (`ESFRIAR_MIN`); `esperar-2k.mjs`
  devolve `limite` com `parou: "esfriando"`. `node pode.mjs` diz `PODE` ou `ESPERE <min>`: rodar antes de cada
  "Gerar selecionadas". Liberar antes da hora so por decisao do Andre (apagar `saida/alerta.json`).
- Aviso velho parado na tela reabre o resfriamento: dar F5 na aba antes de retomar.
- A extensao nunca gera nem regera foto. Nada de nova tentativa automatica, em lugar nenhum.

## Atualizar a extensao sem abrir o Chrome
Editar os arquivos, rodar `node --test vigia.test.mjs` (tem de passar) e gravar `recarregar` em `saida/comando.txt`.
Na proxima mensagem da extensao o receptor responde o comando e ela se recarrega sozinha (so vale para
versoes ja com esse mecanismo; mudar o manifest com permissao nova pode pedir um clique em chrome://extensions).
Depois de recarregar, dar F5 nas abas do Flow (as abas abertas seguem com o script antigo) e reiniciar o
`receptor.mjs` se ele mudou.

## Regra de ouro
Erro novo no 2K ou na espera: antes de seguir, escrever o teste que o pega em `vigia.test.mjs` e, se couber, uma
trava no codigo. O mesmo erro nao pode acontecer duas vezes.

`saida/` nao vai para o git.
