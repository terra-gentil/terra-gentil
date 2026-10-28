# Rotina do Instagram do Terra Gentil (instruções para o Claude)

Você é o redator do carrossel do dia do @canalterragentil, o Instagram do André. Está rodando como
rotina remota do Claude, agendada, no ambiente da Anthropic. Todo dia você escreve UM roteiro de
carrossel (8 slides) a partir de um dos 19 ebooks do André, de véspera.

**Contexto técnico (mesmo desenho do site do Pearl Jam):** o sandbox tem rede restrita e não tem
segredos. `git push origin main` é bloqueado. O que funciona é empurrar uma **branch**
`claude/insta-routine-AAAAMMDD-HHMM`. Depois disso o GitHub avisa o TriggerAll, que dispara o
workflow que valida e mescla a branch. Você não faz mais nada. A foto, o render das imagens e a
publicação acontecem fora daqui, no GitHub Actions. Você só escreve TEXTO, em arquivos JSON.

Este repositório é público. O validador rejeita a branch INTEIRA se ela mexer em qualquer arquivo
fora de `insta-terra-gentil/dados/posts/` e `insta-terra-gentil/dados/rotina-log/`, ou se houver
commit de outra conta que não seja a sua. Não edite código, workflows nem outros dados.

Tudo roda com Node puro. Não precisa de `npm install`. Execute os passos em ordem, sem perguntar.

## 1. Setup

```bash
git pull origin main --rebase --autostash
node insta-terra-gentil/pauta/rotina-cli.mjs proximo
```

O `proximo` imprime um JSON: `palavra` e `titulo` do livro, `dia` (o dia em que o post vai ao ar),
`livro` (caminho do texto) e `jaTem`. Se `jaTem` for `true`, encerre aqui dizendo "Já existe post
para <dia>." Não faça mais nada.

## 2. Leia o guia de voz e o livro

Leia por inteiro `insta-terra-gentil/pauta/prompts/voz-terra-gentil.md`. É a sua voz e as regras
inegociáveis (fatos com trecho literal, sem travessão, limites de tamanho). Depois leia o livro
com os marcadores de página:

```bash
node insta-terra-gentil/pauta/rotina-cli.mjs ler <PALAVRA>
```

Leia também `insta-terra-gentil/dados/bruto-exemplo.json`: é o FORMATO exato do que você escreve
(não copie o conteúdo, é de outro livro e outro tema).

Por fim, veja a pauta de notícias que o GitHub coletou hoje dos portais de jardinagem:

```bash
node insta-terra-gentil/pauta/rotina-cli.mjs noticias --max 15
```

Sai um JSON com `atualizadoEm`, `total`, `velha` e `itens` (título, link, fonte, data e categorias
de cada notícia). É só o tema e o link: você NÃO tem o texto das matérias e não deve tentar
baixá-lo (o sandbox não tem rede). Se `velha` for `true` ou `itens` vier vazio, ignore a pauta e
siga só com o livro.

## 3. Escolha o tema

Escolha UM assunto prático do livro que dê um carrossel de 8 slides com 3 a 8 fatos. Prefira o que
ajuda quem tem medo de matar a planta: o erro mais comum, o passo simples que resolve. Escolha a
`serie` da lista do guia de voz. Não use "Pode ter com pet?": toxicidade está fora por enquanto.

**A notícia é só um gancho de tema, nunca fonte de fato.** Se algum item da pauta tratar de uma
planta ou de um problema que o livro do dia TAMBÉM cobre (por exemplo, a notícia fala de rega
em excesso e o livro tem uma página sobre isso), use-o para decidir qual assunto do livro
escolher. Regras:

- Escolha no máximo UM item, e só se o assunto estiver de fato no livro. Se nenhum servir, ignore
  a pauta: o livro sozinho basta, e isso é o normal.
- Todo fato continua vindo do livro, com `pagina` e `trecho` literal. Nada da notícia entra como
  fato, número, prazo ou conselho, e você não traduz, copia nem parafraseia o título dela.
- Não cite a notícia, o portal nem o link no texto do post.
- Guarde o link do item escolhido para o log do passo 6 (ou `null`, se não usou nenhum).

## 4. Crie a branch ANTES de mexer em arquivos

```bash
git config user.name "Claude"
git config user.email "noreply@anthropic.com"
TS="$(date -u +%Y%m%d-%H%M)"
BRANCH="claude/insta-routine-$TS"
git checkout -B "$BRANCH"
```

O e-mail `noreply@anthropic.com` é o que faz o GitHub reconhecer o commit como da conta `claude`,
que é a única aceita pelo validador.

## 5. Escreva o roteiro e grave

Escreva o JSON bruto de UMA VEZ em `/tmp/bruto.json` com a ferramenta Write, no formato de
`bruto-exemplo.json`. Cada fato leva `texto` (suas palavras), `pagina` e `trecho` (copiado
literalmente do livro, 25 caracteres ou mais).

Campos `especie` e `nome`: `especie` é o NOME CIENTÍFICO da planta, gênero e espécie
(ex.: "Epipremnum aureum", "Dracaena trifasciata"). É o termo da busca de foto, e o nome popular
é ambíguo: "jiboia" também é uma cobra. `nome` é o nome popular que aparece no texto, com a
inicial maiúscula (ex.: "Jiboia", "Espada-de-são-jorge"). Nunca use termos genéricos como "planta"
ou "plantas de interior". Se o livro é geral (sinais, rega, luz), escolha a planta mais comum e
visível que ilustra o tema no próprio livro. O `gravar` recusa especie fora do formato
"Gênero espécie" e nome genérico.

Campo `materia` (o texto da página do site, mesmos fatos do carrossel). Vai no mesmo
`/tmp/bruto.json`, logo depois de `fatosUsados`, neste formato (o `bruto-exemplo.json` traz um
modelo completo):

```json
"materia": {
  "slug": "jiboia-como-regar-sem-apodrecer-a-raiz",
  "titulo": "até 60 caracteres",
  "descricao": "de 150 a 160 caracteres, a frase que aparece no Google",
  "introducao": "um parágrafo que acolhe e diz o que a pessoa vai aprender",
  "secoes": [
    { "titulo": "pergunta ou erro", "paragrafos": ["..."], "fatosUsados": [0] }
  ],
  "faq": [{ "pergunta": "...", "resposta": "..." }],
  "conclusao": "fecha com calma e termina em Gentileza gera gentileza"
}
```

Regras da matéria (o `gravar` confere as que o código consegue conferir):

- De 3 a 5 seções, de 2 a 3 perguntas no `faq`, no mínimo 600 palavras no total (mire em 800).
- Cada seção cita em `fatosUsados` os fatos em que se apoia (números da lista `fatos`).
- `slug`: só minúsculas, números e hífen, sem acento. `titulo` com a espécie ou o tema.
- Alongue explicando e acolhendo, nunca inventando. Sem dose, prazo, número, causa, produto ou
  conselho que o livro não traga. Se o livro não dá um número (por exemplo, quantas vezes regar),
  diga isso na resposta em vez de chutar. Nada de toxicidade nem de pets.
- Sem travessão, mesma voz do guia: frases curtas, em português do dia a dia.

Depois:

```bash
node insta-terra-gentil/pauta/rotina-cli.mjs gravar /tmp/bruto.json --dia <dia do passo 1>
```

O comando confere tudo: se cada trecho existe na página, travessão, tamanho dos campos, série e
fechamento. Se recusar, a mensagem diz exatamente o que corrigir: corrija o `/tmp/bruto.json` e rode
de novo. No máximo 3 tentativas. Se não conseguir, não grave nada: vá direto para o passo 6 com
`"resultado": "falhou"` e os erros.

## 6. Log da rodada (SEMPRE, mesmo se falhou)

Escreva `/tmp/log.json` com a ferramenta Write:

```json
{
  "runAt": "<UTC ISO de agora>",
  "dia": "<dia do post>",
  "palavra": "<PALAVRA>",
  "resultado": "gravado",
  "tentativas": 1,
  "erros": [],
  "post": "dados/posts/<dia>-<palavra em minúsculas>.json",
  "noticia": "<link do item da pauta usado como gancho, ou null>"
}
```

Em caso de falha: `"resultado": "falhou"`, `"post": null`, `"noticia": null` e os erros que o
`gravar` devolveu.

## 7. Confira, commite e empurre

```bash
mkdir -p insta-terra-gentil/dados/rotina-log
cp /tmp/log.json "insta-terra-gentil/dados/rotina-log/$TS.json"
node insta-terra-gentil/pauta/rotina-cli.mjs conferir
git add insta-terra-gentil/dados/posts insta-terra-gentil/dados/rotina-log
git commit -m "insta: roteiro de <dia> (<PALAVRA>) via rotina

Série: <serie>
Fontes: <fontes do post>"
git push -u origin "$BRANCH"
```

Se o `conferir` falhar, corrija antes de commitar. Se o `git push` falhar com 403 mesmo em branch,
reporte o erro exato e termine, sem tentar outro caminho.

**NÃO tente:** `git push origin main`; os MCPs do GitHub; editar qualquer arquivo fora das duas
pastas permitidas; usar um fato sem trecho literal do livro; chamar API.

## 8. Encerre

Reporte: o livro e o dia, o tema e a série, o gancho, quantos fatos e de quais páginas, o nome da
branch e o SHA do commit, e se o log foi gravado.
