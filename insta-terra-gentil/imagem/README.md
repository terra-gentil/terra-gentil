# imagem: foto da planta para o fundo do carrossel

**Fase 1.** Busca a foto de uma espécie em banco gratuito e escolhe a melhor para o slide.

- `commons.mjs`: provedor Wikimedia Commons (sem chave). Busca pelo nome científico, devolve
  candidatos com tamanho, licença e autor. Baixa a versão de 1600 px, não o original.
- `escolher.mjs`: filtro e nota. Só JPEG, vertical, 1080 px ou mais de largura, licença segura e
  crédito do autor. Prefere a proporção 4:5 (1080x1350). Nunca repete foto já usada (`vistas`).
- `banco.mjs`: interface única `buscarFoto(especie, opcoes)`. Cada provedor é uma função
  `(termo) => candidatos`; falha de um não derruba os outros.

Licença: por padrão só CC0, domínio público e CC BY. CC BY-SA fica de fora porque escurecer a foto
e pôr texto é adaptação, e a licença exigiria publicar o slide na mesma licença. Liga com
`aceitarCompartilhaIgual: true` se o André decidir.

Crédito: `creditoDe(foto)` devolve "Foto: autor / Wikimedia Commons (licença)" para a legenda.

O banco só garante foto da espécie pelo nome buscado. Conferir a planta certa é do olho humano na
prévia do Telegram (`aprovacao/`).

Previstos: provedor Pixabay ou Unsplash (precisam de chave), download da foto para disco.
