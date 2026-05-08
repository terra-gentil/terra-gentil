import Image from 'next/image';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
  mascot?: string;
  mascotAlt?: string;
  accent?: 'leaf' | 'amber';
}

export default function PageHero({
  eyebrow,
  title,
  sub,
  mascot,
  mascotAlt = '',
  accent = 'leaf',
}: PageHeroProps) {
  return (
    <section className={`page-hero accent-${accent}`}>
      <div className="page-hero-inner">
        <div>
          <div className="page-hero-eyebrow">{eyebrow}</div>
          <h1 className="page-hero-title">{title}</h1>
          <p className="page-hero-sub">{sub}</p>
        </div>
        {mascot && (
          <Image
            className="page-hero-mascot"
            src={mascot}
            alt={mascotAlt}
            width={320}
            height={400}
          />
        )}
      </div>
    </section>
  );
}
