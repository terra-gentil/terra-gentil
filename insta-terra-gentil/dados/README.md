# dados: estado versionado

JSON lido só com `lerJson` (`lib/json.mjs`). Corrompido = a execução para.

| Arquivo | Papel | Fase |
|---|---|---|
| `palavras.json` | Uma palavra-chave por ebook | 0 |
| `fontes-noticias.json` | Sites de jardinagem aceitos como fonte de pauta | 1 |
| `pautas.json` | Fila de pautas: série, espécie, gancho, pontos, palavra, fontes | 1 |
| `fila.json` | Posts aprovados com horário, `postedAt`, erro e nova tentativa | 1 |
| `pedidos.json` | Quem pediu qual PDF e se o direct foi entregue | 2 |
