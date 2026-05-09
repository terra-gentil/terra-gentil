import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { posts, type Post } from '@/data/posts';
import { YOUTUBE_URL } from '@/lib/constants';
import PageHero from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'Blog · Terra Gentil',
  description:
    'Histórias por trás de cada quintal transformado. As reações, os encontros, os detalhes que não couberam no corte do vídeo.',
};

function postImage(post: Post): string | null {
  if (post.image) return post.image;
  if (post.youtubeId) return `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`;
  return null;
}

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow={`Blog · ${posts.length} histórias`}
        title={
          <>
            Histórias por <span className="ital">trás</span>
            <br />
            de cada quintal.
          </>
        }
        sub="Cada vídeo do canal vira uma história escrita aqui. As reações, os encontros, os detalhes que não couberam no corte. Tudo das transformações reais."
        mascot="/images/mascot/laptop.webp"
        mascotAlt="Brotinho com laptop"
      />

      <section className="section-pad">
        <div className="blog-grid">
          {posts.map((post) => {
            const img = postImage(post);
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                {img ? (
                  <div className="blog-thumb">
                    <Image
                      src={img}
                      alt={post.title}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="blog-thumb blog-thumb-fallback" aria-hidden="true">
                    <span>Terra Gentil</span>
                  </div>
                )}
                <div className="blog-body">
                  <time dateTime={post.date} className="blog-date">
                    {new Date(post.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <span className="blog-read">
                    Ler história <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-cta">
        <h2>
          Quer ver as <span className="ital">transformações</span> em vídeo?
        </h2>
        <p>Cada história aqui veio de um vídeo no canal. E toda terça tem vídeo novo.</p>
        <a className="btn-yt" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          Inscrever no YouTube →
        </a>
      </section>
    </>
  );
}
