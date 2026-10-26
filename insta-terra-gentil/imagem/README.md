# imagem: foto da planta para o fundo do carrossel

**Fase 1.** Busca a foto de uma espécie em banco gratuito e escolhe a melhor para o slide.

- `banco.mjs`: interface única `buscarFoto(especie, opcoes)`. Tenta um provedor por vez, na ordem
  de `PROVEDORES`, e para no primeiro que tiver foto segura. Falha de um provedor entra em
  `falhas` e passa para o próximo. Devolve `{ escolhida, provedor, candidatos, falhas }`.
- `commons.mjs`: principal. Wikimedia Commons, sem chave. Pede 50 resultados, baixa a versão de
  1600 px, não o original.
- `openverse.mjs`: reserva. Openverse (iNaturalist, Flickr e outros), sem chave. Já pede só
  licença livre, vertical e grande. Observação: o anônimo aceita `page_size` até 20 (acima disso
  responde 401), tem limite de 20 por minuto e 200 por dia, e a resposta oscila de 0,1 s a 45 s
  (prazo de 60 s). A maior parte das fotos vem do iNaturalist, identificadas por espécie.
- `escolher.mjs`: filtro e nota. Só JPEG, vertical, 1080 px ou mais de largura, licença segura e
  crédito do autor. Prefere a proporção 4:5 (1080x1350). Nunca repete foto já usada (`vistas`).
  Foto sem dimensões é recusada.

Provedor é só `{ nome, buscar: (termo) => candidatos }`. Pixabay ou Unsplash entram na lista
sem mexer no resto.

Licença: por padrão só CC0, domínio público e CC BY. CC BY-SA fica de fora porque escurecer a foto
e pôr texto é adaptação, e a licença exigiria publicar o slide na mesma licença. Liga com
`aceitarCompartilhaIgual: true` se o André decidir. NC e ND nunca entram.

Crédito: `creditoDe(foto)` devolve "Foto: autor / fonte (licença)", com a fonte real
(Wikimedia Commons, iNaturalist, Flickr).

O banco só garante foto da espécie pelo nome buscado. Conferir a planta certa é do olho humano na
prévia do Telegram (`aprovacao/`).

- `baixar.mjs`: baixa o JPEG escolhido para uma pasta e grava o `.json` de crédito ao lado. As fotos nunca vão para o git.

Filtro de título e categoria (`EVITAR_TITULO`): descarta flor, fruto, herbário, diagrama, desenho, gravura. No Commons a categoria pega ilustração botânica mesmo com título neutro.

Limite conhecido: o banco acerta a espécie, mas não garante foto bonita nem planta inteira. Nos 5 exemplos de 26/10, 2 ficaram boas. Escolha final é humana (prévia) ou lista curada por espécie.

## Curadoria (foto escolhida a mão, com o automático de reserva)

`dados/fotos.json` guarda a foto escolhida pelo André por espécie. Com entrada, o carrossel usa
ela; sem entrada, o banco automático escolhe. Para curar uma espécie:

```
node imagem/curar-cli.mjs "Epipremnum aureum"            # lista as 8 melhores, com o link de cada
node imagem/curar-cli.mjs "Epipremnum aureum" --url <url> # fixa a escolhida em dados/fotos.json
```

A lista só traz foto segura (JPEG, vertical, 1080 px ou mais, licença livre, crédito). Abra o
"ver:" de cada uma no navegador, escolha, copie a "url:" e rode o segundo comando. Depois é só
commitar o `fotos.json`.
