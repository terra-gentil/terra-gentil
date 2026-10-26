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

Previstos: download da foto para disco, filtro de título (flor, fruto, diagrama).
