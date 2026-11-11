# Brief dos agentes: livros TG 115 a 128 (leva 10, 11/11/2026)

Voce escreve 2 livros curtos da Colecao Terra Gentil (ebooks gratis de jardinagem do Andre Zimermann).
PT-BR, tom caloroso e simples, NUNCA travessao (nem em-dash nem en-dash; use virgula ou ponto).

## Onde
- Repo: `C:\Gitlab_hz\terra-gentil-site\terra-gentil`. Fabrica: `ebooks-fabrica` (rode os comandos de dentro dela).
- MODELO OBRIGATORIO: `curtos/tg114.mjs` (leia inteiro). Veja tambem `curtos/tg113.mjs` e `tg112.mjs`.
  19 paginas, mesma ordem e MESMA QUANTIDADE de textos `t` por pagina que o modelo, so muda o conteudo.
  O arquivo do seu livro: `curtos/tgNNN.mjs` com `livro: 'TG NNN'`, `titulo`, `serie` (cor propria, ex. '#4A3A2A'), `provisorias`, `paginas`.
- Fatos: SO `pools/pool10-NNN.txt` do seu livro (ids no campo `f` das paginas). Outros agentes usam os outros pools.
  Mire 25 a 35 fatos unicos. Cada texto do livro diz so o que os fatos citados dizem; nao invente numero, especie ou dica.
- Fotos provisorias da capa e do miolo: arquivos de `insta-terra-gentil/capas/banco/<pasta>/<pasta>-A-1.jpg` (letras A,B,C,F,G,H; confira que existem com ls; use coringa-* quando nao tiver a especie). Nao repetir foto dentro do mesmo livro.

## Fila de fotos do Flow (obrigatoria)
Alem do roteiro, crie `ebooks-fabrica/filas10/NNN.mjs` com `export default [...]`, 8 itens `[id, especie_em_ingles, cena_em_ingles, mascote]`, igual ao formato de `filas9.mjs` (veja o bloco do TG 114 la): 3 gestos (`<pre>-gesto-1..3`, maos do Andre, 9:16), 1 sintoma (`<pre>-sintoma-1`), 4 variedades (`<pre>-var-<nome>`, 3:4). 2 itens com mascote true (`${M}` na cena, sempre dizendo o lugar exato: "sits on the wooden edge of the bed"). Como no filas9.mjs, defina `const M = 'the small mascot figurine'` e `const H = "Close-up of a man's hands"` no topo do seu arquivo. Os ids das fotos devem ser os mesmos usados nos `p` e em `provisorias` do roteiro.

## Regras aprendidas
- Titulo da capa ate ~19 caracteres (20 estoura largura). Titulo honesto: se os fatos nao sustentam, ajuste o titulo mantendo a PALAVRA e AVISE.
- Unidade do numero grande da pagina 17 curta (`%`, `M`, `CM`, `X`, `G`, `MIL`, `DIAS`); `SEMANAS` e `ANOS` estouram.
- Frases da pagina 7 (tabela certo e erro) e da pagina 13 curtas, senao estoura altura.
- Fatos contraditorios: escolha um e nao cite o outro.
- Ultima pagina: "Com carinho, André", numero do proprio livro, "São N livros na coleção, todos de graça." com N = numero do livro, "PRÓXIMO: TG <N+1> <TITULO EM MAIUSCULAS>" e "Comente <PALAVRA DO PROXIMO> no @canalterragentil e ele chega no seu direct, de graça." A lista "VOCÊ TEM" segue o padrao do modelo (N, depois N+1 a N+5).
- A capa (p1): `ARVORE`-style palavra grande e a PALAVRA do proprio livro.

## Conferir antes de responder
1. `node fazer.mjs curtos/tgNNN.mjs` deve mostrar "nenhuma pagina estourada" (se passar px, encurte o texto).
2. `node validar.mjs | grep tgNNN` ok (sem travessao, fatos existem).
3. Todos os ids de fato citados estao no seu pool.
4. `node -e "import('./filas10/NNN.mjs').then(m=>console.log(m.default.length))"` mostra 8.
Se o roteiro de um livro tiver a pasta de saida `ebooks/` diferente, siga o que o `fazer.mjs` do modelo faz. Nao mexa em outros livros nem em PROGRESSO.md. Nao rode git. Responda com: titulos ajustados, estouros que sobraram, fatos que deixou de fora por contradicao.

## Livros e palavras da leva
Ver `pools/LEVA10-titulos.md` (titulo, PALAVRA, prefixo, promessa do proximo).
