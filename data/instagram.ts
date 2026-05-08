// Lista de posts do Instagram a embedar.
// shortcode = parte final da URL: instagram.com/p/<shortcode>/ ou
// instagram.com/reel/<shortcode>/.
// Quando shortcode for null, o tile renderiza placeholder colorido.
// Atualizar essa lista com o feed real assim que tivermos os shortcodes.
export interface IgPost {
  shortcode: string | null;
  kind: 'reel' | 'photo' | 'carousel';
  tag: string;
  title: string;
}

export const igHome: IgPost[] = [
  { shortcode: null, kind: 'reel', tag: 'transformação', title: 'Quintal abandonado vira jardim em 1 dia' },
  { shortcode: null, kind: 'photo', tag: 'antes/depois', title: 'A diferença que uma poda faz' },
  { shortcode: null, kind: 'reel', tag: 'dica rápida', title: 'Como saber se sua planta tem sede' },
  { shortcode: null, kind: 'photo', tag: 'bastidor', title: 'André + suculentas resgatadas' },
  { shortcode: null, kind: 'carousel', tag: 'tutorial', title: 'Compostagem em 5 passos' },
  { shortcode: null, kind: 'reel', tag: 'transformação', title: 'Mato alto → grama nova' },
];

export const igFull: IgPost[] = [
  ...igHome,
  { shortcode: null, kind: 'photo', tag: 'planta do dia', title: 'Costela-de-adão de 2m' },
  { shortcode: null, kind: 'reel', tag: 'doutor', title: 'O que essa folha amarela quer dizer' },
  { shortcode: null, kind: 'photo', tag: 'comunidade', title: 'Jardim de seguidor, Recife' },
  { shortcode: null, kind: 'carousel', tag: 'tutorial', title: '7 plantas pra apartamento sem sol' },
  { shortcode: null, kind: 'reel', tag: 'dica rápida', title: 'Substrato caseiro em 3 ingredientes' },
  { shortcode: null, kind: 'photo', tag: 'planta do dia', title: 'Antúrio florido o ano todo' },
];
