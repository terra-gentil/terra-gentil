// Prompts das capas: bloco fixo de foto realista + cenário (A, B, C) por espécie, em inglês.

// Mesmo texto em toda capa: é o que mantém o rosto, a roupa e o "jeito de foto" iguais.
export const ESTILO = [
  'Photorealistic documentary photo, shot on a full-frame mirrorless camera,',
  '35mm lens at f/2.8, natural soft daylight, natural color grading.',
  'Real skin texture with visible pores, light sweat, slight imperfections,',
  'no retouching, no beauty filter.',
  'The man is exactly the person in the reference photos: same face, eyes, beard and smile.',
  'He wears the same dark grey cap with the orange TERRA GENTIL logo',
  'and the dark grey t-shirt with the small orange Terra Gentil logo on the chest.',
].join(' ');

// Capa do carrossel: 4:5 vertical, terço de cima livre para o título.
export const QUADRO = [
  'Vertical 4:5 frame. The man and the plant fill the lower two thirds;',
  'the top third is calm, softly out-of-focus background with no objects, free for a headline.',
].join(' ');

export const EVITAR =
  'Avoid: any text, watermark, extra fingers, distorted hands, plastic skin, ' +
  'oversaturated colors, lavalier microphone, other people, perfect artificial plants.';

// e = { ingles, ambiente } de dados/capas.json.
export const CENARIOS = {
  A: (e) =>
    `Waist-up shot. He holds a potted ${e.ingles} close to his chest with both hands, ` +
    'looking down at the plant with a gentle, proud smile.',
  B: (e) =>
    `Three-quarter angle, medium shot. He crouches next to a ${e.ingles} and gently ` +
    'touches one leaf, checking it with care, a small watering can beside him.',
  C: (e) =>
    `Medium shot in ${e.ambiente}, surrounded by ${e.ingles}. ` +
    'He looks at the camera with a warm, natural smile, relaxed posture.',
};

const planta = (e) =>
  `The plant is a botanically accurate ${e.ingles}, healthy but real, ` +
  'with a few natural leaf marks and one or two imperfect leaves.';

export function promptDaCapa(especie, cenario) {
  const montar = CENARIOS[cenario];
  if (!montar) throw new Error(`[capas] cenário desconhecido: ${cenario}`);
  return [montar(especie), planta(especie), ESTILO, QUADRO, EVITAR].join('\n');
}

// Uma linha por imagem: id = <slug>-<cenário>-<n>, o nome do arquivo baixado do Flow.
export function filaDeCapas(especies, { cenarios = ['A', 'B', 'C'], porCenario = 1 } = {}) {
  const fila = [];
  for (const [cientifico, e] of Object.entries(especies)) {
    for (const c of cenarios) {
      for (let n = 1; n <= porCenario; n++) {
        const id = `${e.slug}-${c}-${n}`;
        fila.push({ id, especie: cientifico, nome: e.nome, prompt: promptDaCapa(e, c) });
      }
    }
  }
  return fila;
}
