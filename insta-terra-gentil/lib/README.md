# lib

Peças comuns a todas as partes.

| Arquivo | O que faz |
|---|---|
| `config.mjs` | Caminhos (`RAIZ`, `DADOS`, `EBOOKS_DIR`), endereços da marca e `LIMITES` |
| `json.mjs` | `lerJson`: lê estado e para tudo se o arquivo faltar ou estiver corrompido |
| `limites.mjs` | `listarCodigo` e `problemasDoTexto`: o verificador dos limites do AGENTS.md |
| `limites.test.mjs` | Roda o verificador em todo `.mjs` da pasta |

Próximos (vindos do setlists-pj-ev, adaptados): commit e push do estado, aviso no Telegram,
fuso de Brasília.
