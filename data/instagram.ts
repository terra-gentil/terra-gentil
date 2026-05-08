// Lista de posts do Instagram a embedar.
// shortcode = parte final da URL: instagram.com/p/<shortcode>/ ou
// instagram.com/reel/<shortcode>/.
// Quando shortcode for null, o tile renderiza placeholder colorido.
//
// Quando o INSTAGRAM_ACCESS_TOKEN estiver configurado na Vercel, lib/instagram.ts
// sobrescreve essa lista com os posts mais recentes via Graph API. Esses
// shortcodes ficam como fallback estatico.
export interface IgPost {
  shortcode: string | null;
  kind: 'reel' | 'photo' | 'carousel';
  tag: string;
  title: string;
}

export const igHome: IgPost[] = [
  { shortcode: 'DTGEUGSgWjT', kind: 'reel', tag: 'transformação', title: 'Quintal abandonado vira jardim' },
  { shortcode: 'DSbMB37l0Zj', kind: 'photo', tag: 'antes/depois', title: 'A diferença que uma poda faz' },
  { shortcode: 'DUqe1pyj7FF', kind: 'reel', tag: 'dica rápida', title: 'Como saber se sua planta tem sede' },
  { shortcode: 'DUk5N2KFDYB', kind: 'reel', tag: 'bastidor', title: 'No quintal com André' },
  { shortcode: 'DUV3yw3j5p3', kind: 'reel', tag: 'tutorial', title: 'Cuidado com as plantas' },
  { shortcode: 'DT2hwxlFOZn', kind: 'reel', tag: 'transformação', title: 'Mato alto vira jardim' },
];

export const igFull: IgPost[] = [
  ...igHome,
  { shortcode: 'DTxTP6Minva', kind: 'reel', tag: 'dica rápida', title: 'Plantar com gentileza' },
  { shortcode: 'DTSgOaiEUtQ', kind: 'reel', tag: 'doutor', title: 'Diagnosticando a planta' },
  { shortcode: 'DTGAN8NleG2', kind: 'photo', tag: 'planta do dia', title: 'Plantas do canal' },
  { shortcode: 'DSudOCmFFtR', kind: 'reel', tag: 'tutorial', title: 'Cuidado e tutorial' },
  { shortcode: 'DSgm1xjFLeB', kind: 'reel', tag: 'transformação', title: 'Antes e depois real' },
  { shortcode: null, kind: 'photo', tag: 'planta do dia', title: 'Antúrio florido o ano todo' },
];
