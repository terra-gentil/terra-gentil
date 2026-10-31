# insta-terra-gentil: regras para agentes (Claude Code, routines)

Máquina de conteúdo do Instagram @canalterragentil: carrossel, reel narrado, reel do André
(Plantão), palavra-chave que manda o PDF no direct. Especificação completa:
https://claude.ai/artifact/Hj1ysfH7HQFmeggS4h5i7r

Este é um subprojeto Node puro (ESM `.mjs`, `node:test`), independente do site Next.js da raiz.
Não importa nada de `app/`, `components/` ou `lib/` da raiz; o que precisar de lá é copiado em
`lib/config.mjs` com comentário dizendo de onde veio.

## Limites (o teste `lib/limites.test.mjs` barra quem passar)

| Limite | Valor |
|---|---|
| Linhas por arquivo `.mjs` | 160 |
| Caracteres por arquivo `.mjs` | 6000 |
| Caracteres por linha | 100 (o mesmo `printWidth` do Prettier da raiz) |
| Cabeçalho | 1a linha é comentário `//` dizendo o que o arquivo faz |

Passou do limite? Fatie por responsabilidade em arquivos menores. Nunca suba o teto.

## Como o código é organizado

- Uma pasta por parte da máquina, cada uma com `README.md` (o que faz, entrada, saída, fase).
- Um arquivo, uma responsabilidade. Nome em português, dizendo o que faz (`palavras.mjs`).
- Só exports nomeados. Funções puras sempre que der; IO (rede, disco) em arquivo separado.
- Teste ao lado do arquivo: `x.mjs` + `x.test.mjs`. `npm test` acha todos sozinho.
- Cada parte é desligada sem a sua chave (secret ou variável). Faltou chave = pula, não quebra.
- Estado em JSON dentro de `dados/`, lido só com `lerJson` (`lib/json.mjs`). JSON corrompido
  derruba a execução de propósito; nunca `catch { return vazio }`.
- Segredos só em variáveis de ambiente. Nunca no código, nunca em `dados/`.

## Mapa

| Pasta | Parte | Fase |
|---|---|---|
| `lib/` | Config, leitura de JSON, verificador de limites | 0 |
| `dados/` | Estado versionado (palavras-chave, fila, pautas) | 0 |
| `dm/` | Palavra-chave do comentário e mensagem do direct | 2 |
| `pauta/` | Gerador de pauta a partir dos ebooks e livros | 1 e 5 |
| `carrossel/` | Slides do carrossel (arte, texto, legenda) | 1 |
| `capas/` | Banco de capas do André com a planta (Google Flow) | 1 |
| `gama-ebooks/` | Fábrica de ebooks (meta 200; hoje o Gamma é o molde) | 0 |
| `publicar/` | Fila e cliente da Graph API do Instagram | 1 |
| `aprovacao/` | Prévia e ok no Telegram | 1 |
| `acervo/` | Trechos de b-roll no R2, com etiquetas | 3 |
| `reel/` | Reel narrado (voz do ElevenLabs) | 3 |
| `plantao/` | Reel do André (HyperFrames) | 4 |
| `metricas/` | Insights do Instagram e relatório semanal | 6 |

Pasta só com README = parte ainda não construída; o README diz o que vai entrar nela.

## Antes de mandar

```
npm --prefix insta-terra-gentil test
```

Muita coisa vem do setlists-pj-ev (repositório irmão, mesmo motor). Ao copiar de lá, adaptar e
respeitar os limites daqui; não criar dependência entre os dois repositórios.

Texto que vai para o post: PT-BR com acento, sem travessão, na voz do André (acolhedora, sem
culpa, para 40 a 70 anos). Planta certa na tela, sempre.
