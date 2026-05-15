// Terra Gentil - Instagram redesign - tokens de dados e helpers de mapeamento.
// O design original trazia metricas e tags mockadas; aqui so vive o que e real
// ou curadoria honesta (Destaques). Tom e pattern sao deterministicos por indice
// pra o layout ficar estavel entre renders/revalidacoes.

import type { IgMedia } from '@/lib/instagram';
import type { IgPost } from '@/data/instagram';

export type IgKind = 'reel' | 'photo' | 'carousel';

export interface IgTile {
  key: string;
  kind: IgKind;
  permalink: string;
  title: string;
  thumbnailUrl: string | null;
  pattern: string;
  tone: [string, string]; // [bg, fg]
}

// [bg, fg] - paleta da marca, mesma do prototipo de design.
export const TONES: ReadonlyArray<readonly [string, string]> = [
  ['#0F2A1E', '#74C69D'],
  ['#1F2A20', '#E8A33D'],
  ['#2A1810', '#E8A33D'],
  ['#11201A', '#4A8C4F'],
  ['#1A1F2A', '#74C69D'],
  ['#2A1810', '#D8552B'],
  ['#11201A', '#F4C97A'],
  ['#0B1410', '#74C69D'],
  ['#1F4A2A', '#F4ECDB'],
  ['#2A1810', '#74C69D'],
  ['#11201A', '#D8552B'],
  ['#1F2A20', '#F4C97A'],
];

const PATTERN_CYCLE = [
  'leaves',
  'drops',
  'sun',
  'fronds',
  'hills',
  'monstera',
  'bloom',
  'arch',
  'circles',
  'plus',
  'lines',
  'grid',
  'shovel',
];

export function toneFor(i: number): [string, string] {
  const t = TONES[i % TONES.length];
  return [t[0], t[1]];
}

export function patternFor(i: number): string {
  return PATTERN_CYCLE[i % PATTERN_CYCLE.length];
}

// Filtro por tipo. A API expoe media_type, entao isso e real.
export const KINDS: ReadonlyArray<{ id: 'all' | IgKind; label: string; icon: string }> = [
  { id: 'all', label: 'Tudo', icon: 'grid' },
  { id: 'reel', label: 'Reels', icon: 'reel' },
  { id: 'photo', label: 'Fotos', icon: 'photo' },
  { id: 'carousel', label: 'Carrosséis', icon: 'carousel' },
];

// "12.4k", "186k", "4.8M" - mesmo estilo do prototipo.
export function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const v = n / 1000;
    return `${v < 100 ? v.toFixed(1) : Math.round(v)}k`;
  }
  return `${(n / 1_000_000).toFixed(1)}M`;
}

// Caption do Instagram costuma vir multi-linha, com emoji e bloco de hashtags.
// Pega a primeira linha com conteudo de verdade, tira hashtags soltas e corta.
export function deriveTitle(caption: string): string {
  const lines = caption
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  let line =
    lines.find((l) => !/^(#\S+\s*)+$/.test(l)) ?? lines[0] ?? '';
  line = line.replace(/#[^\s#]+/g, '').replace(/\s{2,}/g, ' ').trim();
  if (!line) return 'No quintal com a gente';
  if (line.length <= 90) return line;
  const cut = line.slice(0, 90);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 50 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

// Ritmo do mosaico recriado por posicao (o design usava flags do mock que a
// API nao tem). Primeiro tile e destaque grande, depois pinga wide/tall.
export function mosaicSizeClass(i: number): '' | 'is-feature' | 'is-wide' | 'is-tall' {
  if (i === 0) return 'is-feature';
  if (i % 7 === 3) return 'is-wide';
  if (i % 9 === 5) return 'is-tall';
  return '';
}

export function tilesFromMedia(media: IgMedia[]): IgTile[] {
  return media.map((m, i) => ({
    key: m.id,
    kind: m.kind,
    permalink: m.permalink,
    title: deriveTitle(m.caption),
    thumbnailUrl: m.thumbnailUrl || null,
    pattern: patternFor(i),
    tone: toneFor(i),
  }));
}

export function tilesFromFallback(posts: IgPost[]): IgTile[] {
  return posts
    .filter((p): p is IgPost & { shortcode: string } => Boolean(p.shortcode))
    .map((p, i) => ({
      key: p.shortcode,
      kind: p.kind,
      permalink: `https://www.instagram.com/p/${p.shortcode}/`,
      title: p.title,
      thumbnailUrl: null,
      pattern: patternFor(i),
      tone: toneFor(i),
    }));
}
