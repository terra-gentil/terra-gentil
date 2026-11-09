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

## 2K da galeria (v1.1)
- `../baixar2k.js` v2 grava o progresso em `data-b2k` da pagina e PARA sozinho apos 2 falhas de 2K seguidas
  ("Falha no aumento de resolucao" = limite da conta). Faixa maxima de 38 posicoes, passo 2.
- `conteudo-galeria.js` le esse progresso e o aviso de falha e manda ao receptor (`saida/estado-2k.json`).
- `node esperar-2k.mjs` em segundo plano: imprime `VIGIA2K fim|limite|sem-sinal|demorou <novos 2K> <estado>`.

## Atualizar a extensao sem abrir o Chrome
Editar os arquivos, rodar `node --test vigia.test.mjs` (tem de passar) e gravar `recarregar` em `saida/comando.txt`.
Na proxima mensagem da extensao o receptor responde o comando e ela se recarrega sozinha (so vale para
versoes ja com esse mecanismo; mudar o manifest com permissao nova pode pedir um clique em chrome://extensions).

## Regra de ouro
Erro novo no 2K ou na espera: antes de seguir, escrever o teste que o pega em `vigia.test.mjs` e, se couber, uma
trava no codigo. O mesmo erro nao pode acontecer duas vezes.

`saida/` nao vai para o git.
