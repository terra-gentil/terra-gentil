// Segunda rodada de capas (cenários F a H): outros enquadramentos das mesmas espécies.
// Sempre plano médio ou fechado, com o peito virado o bastante para a logo ter pixels.

export const RODADA_1 = ['A', 'B', 'C', 'D', 'E'];
export const RODADA_2 = ['F', 'G', 'H'];

export const CENARIOS_2 = {
  F: (e) =>
    `Close-up portrait, chest up. He looks at the camera with a relaxed smile, holding a ` +
    `${e.ingles} close to his chest; both his face and the plant are sharp and in focus.`,
  G: (e) =>
    `Side angle, medium shot. He kneels and works the soil around a ${e.ingles} with bare ` +
    'hands, looking at the plant, torso turned three quarters so the chest logo stays visible.',
  H: (e) =>
    `Low angle, medium shot in ${e.ambiente}. He holds up a ${e.ingles} toward the light ` +
    'with both hands and looks at it with a proud smile, soft warm late afternoon light.',
};

// Coringa: notícia sem planta específica. e = { cena, ambiente }.
export const CORINGAS_2 = {
  F: (e) =>
    `Close-up portrait, chest up, in ${e.ambiente}. ${e.cena} ` +
    'He glances at the camera with a relaxed smile, shallow depth of field.',
  G: (e) =>
    `Side angle, medium shot in ${e.ambiente}. ${e.cena} ` +
    'Torso turned three quarters so the chest logo stays visible.',
  H: (e) =>
    `Low angle, medium shot in ${e.ambiente}. ${e.cena} ` +
    'Soft warm late afternoon light, proud calm expression.',
};
