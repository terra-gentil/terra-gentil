export const SITE_URL = 'https://terragentil.com.br';
export const SITE_NAME = 'Terra Gentil';

export const WHATSAPP_NUMBER = '5511920938591';
export const WHATSAPP_DEFAULT_MESSAGE =
  'Olá! Vi o site Terra Gentil e gostaria de saber mais.';

export const YOUTUBE_URL = 'https://www.youtube.com/@TerraGentil';
export const YOUTUBE_PLAYLIST_ID = 'PLo0P-qaOD_PSJ24_1Z5d9JbwVs2Y3oDS8';
export const YOUTUBE_CHANNEL_ID = 'UCX3xUnHpQrhSUJUGjqMAN2A';

export const INSTAGRAM_HANDLE = '@canalterragentil';
export const INSTAGRAM_URL = 'https://instagram.com/canalterragentil';

export const TIKTOK_URL = 'https://www.tiktok.com/@terragentil';

export const CONTACT_EMAIL = 'canalterragentil@gmail.com';

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Backend Doutor Gentileza (terra-gentil-app/backend, FastAPI no Railway).
// Mesma API consumida pelo app mobile. Substitui chamada direta ao Gemini que
// existia neste repo, centralizando prompt e schema em um lugar so.
export const DIAGNOSE_API_URL =
  process.env.DIAGNOSE_API_URL ?? 'https://terra-gentil-app-production.up.railway.app';

// Game subproject (terra-gentil-game). Iframe embed via /jogo enquanto G10 nao fecha.
export const GAME_URL = 'https://terra-gentil.github.io/terra-gentil-game/';
// Flag pra liberar a rota /jogo. Setada via NEXT_PUBLIC_GAME_ENABLED=true (server e client).
export const GAME_ENABLED = process.env.NEXT_PUBLIC_GAME_ENABLED === 'true';
