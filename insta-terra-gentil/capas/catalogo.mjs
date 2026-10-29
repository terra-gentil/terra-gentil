// Acha no catálogo de capas a entrada do post: tema (coringa), espécie exata ou pelo gênero.

// Temas do post com capa de coringa (dados/capas.json, slug "coringa-<tema>").
export const TEMAS = Object.freeze([
  'regar',
  'adubar',
  'podar',
  'praga',
  'trocar-vaso',
  'compostagem',
  'ferramentas',
  'horta',
  'jardim-vertical',
  'gramado',
  'mato',
  'solo',
  'pet',
  'luz',
  'muda',
]);

// Pelo gênero só quando é seguro: chave de uma palavra (Phalaenopsis, Begonia) ou lista
// "generos" na entrada. "Solanum tuberosum" nunca pega a capa do tomate (Solanum lycopersicum).
// Gênero em mais de uma entrada não escolhe nenhuma: planta certa na tela, sempre.
export function entradaDaEspecie(especie, catalogo) {
  if (!especie) return null;
  if (catalogo[especie] && !catalogo[especie].coringa) return catalogo[especie];
  const genero = especie.trim().split(/\s+/)[0];
  const casam = Object.entries(catalogo).filter(
    ([chave, e]) => !e.coringa && (chave === genero || (e.generos ?? []).includes(genero)),
  );
  return casam.length === 1 ? casam[0][1] : null;
}

// Ordem de preferência: o coringa do tema (post de praga, mato, solo...) e depois a planta.
export function entradasDoPost(post, catalogo) {
  const { especie, tema } = typeof post === 'string' ? { especie: post } : (post ?? {});
  const coringa = tema ? catalogo[`coringa-${tema}`] : null;
  return [coringa, entradaDaEspecie(especie, catalogo)].filter(Boolean);
}
