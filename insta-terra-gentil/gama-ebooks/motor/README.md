# motor: livro a partir de roteiro

Fase 1 da fábrica. As 19 páginas do canvas (`../canvas/*.dc.html`) viram moldes: o motor lê os
textos e as fotos de cada molde **na ordem em que aparecem** e troca pelos do roteiro.

- Entrada: `../roteiros/tgNNN.json` (`livro`, `titulo`, `serie`, `paginas[]` com `molde`,
  `textos[]`, `fotos[]` e `fatos[]` com os ids da `dados/biblia.json`, só para conferência).
- Saída: `livro.html` na pasta das fotos e o PDF 1080x1920.
- O roteiro precisa ter o MESMO número de textos e fotos do molde; senão o motor recusa.

```
node gama-ebooks/motor/livro-cli.mjs extrair <saida.json>          # roteiro do canvas atual
node gama-ebooks/motor/livro-cli.mjs montar <roteiro> <fotos> <pdf>  # HTML + PDF (Chrome)
```

Texto que passa da página não some mais (bloco não encolhe): conferir estouro antes de mandar.
Limites conhecidos: os ícones da Ficha e da Chave da Galeria são fixos do molde de orquídea; a
grade do Fechamento sempre destaca o 001.
