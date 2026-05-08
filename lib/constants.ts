export const SITE_URL = 'https://terragentil.com.br';
export const SITE_NAME = 'Terra Gentil';

export const WHATSAPP_NUMBER = '5511920938591';
export const WHATSAPP_DEFAULT_MESSAGE =
  'Olá! Vi o site Terra Gentil e gostaria de saber mais.';

export const YOUTUBE_HANDLE = '@TerraGentil';
export const YOUTUBE_URL = 'https://www.youtube.com/@TerraGentil';
export const YOUTUBE_PLAYLIST_ID = 'PLo0P-qaOD_PSJ24_1Z5d9JbwVs2Y3oDS8';

export const INSTAGRAM_HANDLE = '@canalterragentil';
export const INSTAGRAM_URL = 'https://instagram.com/canalterragentil';

export const TIKTOK_HANDLE = '@terragentil';
export const TIKTOK_URL = 'https://www.tiktok.com/@terragentil';

export const FACEBOOK_URL = 'https://www.facebook.com/share/1LQQwU7saS/';

export const CONTACT_EMAIL = 'canalterragentil@gmail.com';

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Game subproject (terra-gentil-game). Iframe embed via /jogo enquanto G10 nao fecha.
export const GAME_URL = 'https://terra-gentil.github.io/terra-gentil-game/';
export const GAME_REPO_URL = 'https://github.com/terra-gentil/terra-gentil-game';
// Espelha exatamente o regex do jogo (jogo/src/types/Ranking.ts) e do backend.
// Se mudar la, mudar aqui — ou perdemos prefill silenciosamente.
export const GAME_NICKNAME_REGEX = /^[A-Z0-9_]{3,12}$/;
// Flag pra liberar a rota /jogo. Setada via NEXT_PUBLIC_GAME_ENABLED=true (server e client).
export const GAME_ENABLED = process.env.NEXT_PUBLIC_GAME_ENABLED === 'true';
