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
  (ex.: `2k 0 3 1` na Pamela, `2k 1 7 2` onde a galeria duplica; mais de 4 downloads vira `faixa-invalida`). A aba pega o comando no pulso (ate 25 s).
- `node esperar-2k.mjs` em segundo plano: imprime `VIGIA2K fim|limite|sem-sinal|demorou <novos 2K> <estado>`.
- `parar2k` em `saida/comando.txt` cancela o laco.
- Ritmo (v1.3, depois do aviso de atividade incomum de 13/11/2026): no maximo 4 downloads por rodada, 1 por
  minuto, 40 a 110 s entre fotos e 2 a 5 min de descanso a cada 2 fotos. Uma rodada de 4 leva uns 6 a 10 min.
  Entre rodadas, 25 min no minimo (o receptor recusa com `parou: "espacando"`). E de proposito, nao acelerar.
- O receptor tambem recusa o 2K com a ferramenta gerando (`gerando`) e com extensao abaixo da v1.3
  (`extensao-velha`: o `versao` vem em todo POST, conferir em `saida/estado-2k.json`).
- O laco so age com a aba da galeria visivel (`sem-foco` se ela sair da frente) e para se o menu sumir 2 vezes
  (`menu-sumiu`). Nao rola a pagina se a foto ja esta na tela.
- `../baixar2k.js` (colar no console) virou plano B: funciona, mas deixa pegada na pagina.

## Travas contra cara de robo (v1.2)
- Primeiro "Limite do Flow", primeira "atividade incomum" ou primeira "Falha no aumento de resolucao": o laco
  de 2K PARA e nao tenta de novo. Na geracao, a extensao clica "Parar" na ferramenta se ainda ha foto gerando.
- O receptor grava `saida/alerta.json` e recusa comando de 2K por 60 min no limite (`ESFRIAR_MIN`) e 180 min na
  atividade incomum (`ESFRIAR_INCOMUM_MIN`), regras em `regras.mjs`; `esperar-2k.mjs` devolve `limite` com
  `parou: "esfriando"`. `node pode.mjs gerar` antes de cada "Gerar selecionadas": alem do resfriamento, sorteia o
  intervalo ate o proximo lote (18 a 35 min, e 60 a 100 min a cada 3 lotes) e grava em `saida/ritmo.json`.
  `node pode.mjs 2k` antes de cada rodada de 2K. Liberar antes da hora so por decisao do Andre (apagar
  `saida/alerta.json`).

## O que continua detectavel (por natureza)
- Clique direito, passar do mouse, clique e Escape do laco sao eventos sinteticos (`isTrusted = false`), sem
  `pointerdown`/`mouseup` e sem trajeto do mouse. Qualquer script da pagina que olhe `isTrusted` ve. Nao ha como
  esconder isso de dentro de uma extensao sem `debugger` (que mostra faixa amarela e e outro sinal). Por isso o
  laco e curto, lento e raro, e o 2K manual pelo Andre e o caminho mais limpo.
- O clique em "Parar" (conteudo.js) tambem e sintetico, mas so acontece depois de um aviso.
- O que NAO aparece para a pagina: leitura de `innerText`, mensagens da extensao e o POST ao 127.0.0.1 (sai do
  service worker). A extensao nao grava nada no DOM, nao cria global e nao tem recurso acessivel pela web.
- O volume e o compasso pesam tanto quanto os eventos: em 13/11 foram 11 ciclos seguidos de 4 geracoes (com
  conferencia Gemini em cada) mais 4 downloads 2K, a cada 13 min cravados, por 2 h 30. O aviso veio NA GERACAO
  (dsj-gesto-3), 12 min depois do ultimo 2K.
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
