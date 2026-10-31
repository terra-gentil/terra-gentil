// Prompts das capas: bloco fixo de foto realista + cenário (A a E; F a H na 2a rodada), inglês.
import { CENARIOS_2, CORINGAS_2, RODADA_1 } from './cenarios2.mjs';

// Mesmo texto em toda capa: é o que mantém o rosto, o boné e o "jeito de foto" iguais.
// Camiseta oficial Terra Gentil. Para a logo sair certa (teste de 27/10 deu "TIRRA"): foto de
// referência só da logo (capas/referencias/andre-camiseta-logo.jpg), texto entre aspas e
// plano médio, dicas do Agente do Flow.
export const ESTILO = [
  'Photorealistic documentary photo, shot on a full-frame mirrorless camera,',
  '35mm lens at f/4, natural soft daylight, natural color grading.',
  'Highlights keep detail: no blown-out white sky or windows, no harsh shadows on his face.',
  'Real skin texture with visible pores, slight imperfections, no retouching, no beauty filter.',
  'The man is exactly the person in the reference photos: same face, eyes, beard and smile.',
  'He wears the same dark grey cap with the orange logo that reads exactly "TERRA GENTIL".',
  'He wears the official Terra Gentil dark grey t-shirt, a regular-fit tee, not oversized,',
  'with one small standard-size orange logo (8 cm wide) only on the left chest, at the heart,',
  'a wheat flower icon beside the two lines of text "TERRA" and "GENTIL"',
  'in clean capital letters,',
  'copied exactly from the t-shirt logo reference photo (andre-camiseta-logo), only its design,',
  'never its size: on the shirt the logo stays small and the rest of the chest is plain.',
].join(' ');

// Capa do carrossel: cabeça no terço de cima, sem vazio grande acima.
// Crítico do Gemini (30/10/2026): boné cortado no topo, mão e pétala encostadas na borda.
export const QUADRO = [
  'Vertical 3:4 frame, natural photographic composition: he fills the frame, head in the upper',
  'third with only a small natural headroom, no large empty area above him.',
  'The whole cap stays inside the frame, never cut by the top edge; his hands and the plant',
  'stay fully inside the frame with a small margin on the sides.',
].join(' ');

export const EVITAR =
  'Avoid: any other text, misspelled or distorted logo on the cap or t-shirt, a big or centered ' +
  'logo, an oversized t-shirt, microphone or ' +
  'clip on the clothes, extra fingers, distorted hands, plastic skin, oversaturated colors, ' +
  'other people, holes, bites, pests or damage on the leaves.';

export const CENARIOS = {
  A: (e) =>
    `Waist-up shot. He holds a potted ${e.ingles} at chest height with both hands, ` +
    'looking down at the plant with a gentle, proud smile.',
  B: (e) =>
    `Three-quarter angle, medium shot. He crouches next to a ${e.ingles} and gently ` +
    'touches one leaf, checking it with care, a small watering can beside him.',
  C: (e) =>
    `Medium shot in ${e.ambiente}, surrounded by ${e.ingles}. ` +
    'He looks at the camera with a warm, natural smile, relaxed posture.',
  D: (e) =>
    `Medium shot. He stands beside a ${e.ingles}, points at it with one open hand ` +
    'and looks at the camera as if explaining how to care for it, friendly expression.',
  E: (e) =>
    `Medium shot in ${e.ambiente}. He waters a ${e.ingles} with a metal watering can, ` +
    'focused and calm, turned three quarters so the chest logo stays visible.',
};

// Coringa: notícia sem planta específica (regar, podar...). e = { cena, ambiente }.
export const CORINGAS = {
  A: (e) => `Waist-up shot in ${e.ambiente}. ${e.cena} He smiles gently.`,
  B: (e) => `Three-quarter angle, medium shot in ${e.ambiente}. ${e.cena}`,
  C: (e) => `Wide shot in ${e.ambiente}. ${e.cena} He looks at the camera, warm smile.`,
};

const TODOS_CENARIOS = { ...CENARIOS, ...CENARIOS_2 };
const TODOS_CORINGAS = { ...CORINGAS, ...CORINGAS_2 };

const planta = (e) =>
  e.coringa
    ? 'Plants in the scene are healthy and real.'
    : `The plant is a botanically accurate ${e.ingles}, healthy, with natural glossy leaves.`;

export function promptDaCapa(especie, cenario) {
  const montar = (especie.coringa ? TODOS_CORINGAS : TODOS_CENARIOS)[cenario];
  if (!montar) throw new Error(`[capas] cenário desconhecido: ${cenario}`);
  return [montar(especie), planta(especie), ESTILO, QUADRO, EVITAR].join('\n');
}

// Uma linha por imagem: id = <slug>-<cenário>-<n>, o nome do arquivo baixado do Flow.
// Sem `cenarios`: rodada 1 (espécie A a E, coringa A a C). Rodada 2: cenarios = RODADA_2.
export function filaDeCapas(especies, { cenarios, porCenario = 1 } = {}) {
  const fila = [];
  for (const [chave, e] of Object.entries(especies)) {
    const todos = Object.keys(e.coringa ? CORINGAS : CENARIOS);
    const lista = cenarios ?? todos.filter((c) => RODADA_1.includes(c));
    for (const c of lista) {
      for (let n = 1; n <= porCenario; n++) {
        const id = `${e.slug}-${c}-${n}`;
        fila.push({ id, especie: chave, nome: e.nome, prompt: promptDaCapa(e, c) });
      }
    }
  }
  return fila;
}
