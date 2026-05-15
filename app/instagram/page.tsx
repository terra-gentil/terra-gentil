import type { Metadata } from 'next';
import { igFull } from '@/data/instagram';
import { fetchInstagramMedia, fetchInstagramProfile } from '@/lib/instagram';
import InstagramExperience from '@/components/sections/instagram/InstagramExperience';
import { tilesFromMedia, tilesFromFallback } from '@/components/sections/instagram/data';

export const metadata: Metadata = {
  title: 'Instagram · Terra Gentil',
  description:
    'Feed do Terra Gentil no Instagram: bastidor, transformações de quintal, dicas rápidas e o Doutor das Plantas. Atualiza sozinho.',
};

export const revalidate = 3600;

export default async function InstagramPage() {
  const [live, profile] = await Promise.all([
    fetchInstagramMedia(24),
    fetchInstagramProfile(),
  ]);

  const tiles = live.length > 0 ? tilesFromMedia(live) : tilesFromFallback(igFull);

  return <InstagramExperience tiles={tiles} profile={profile} />;
}
