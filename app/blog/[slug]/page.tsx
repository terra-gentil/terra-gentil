import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { posts, type Post } from '@/data/posts';
import { SITE_NAME, SITE_URL, YOUTUBE_URL } from '@/lib/constants';
import LiteYouTubeEmbed from '@/components/ui/LiteYouTubeEmbed';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

function postImage(post: Post): string | null {
  if (post.image) return post.image;
  if (post.youtubeId) return `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post não encontrado' };

  // Pra og:image preferimos maxresdefault (1280x720, ideal pra Twitter/Facebook).
  // Quando nao existe, hqdefault (480x360) sempre existe e funciona.
  const ogImage = post.image
    ? post.image
    : post.youtubeId
      ? `https://i.ytimg.com/vi/${post.youtubeId}/maxresdefault.jpg`
      : null;

  return {
    title: `${post.title} · ${SITE_NAME}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const heroImage = postImage(post);
  const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="bp-article">
      <div className="bp-inner">
        <Link href="/blog" className="bp-back">
          <ArrowLeft size={16} />
          Voltar para o blog
        </Link>

        <div className="bp-eyebrow">
          <time dateTime={post.date}>{formattedDate}</time>
          <span aria-hidden="true">·</span>
          <span>História do canal</span>
        </div>

        <h1 className="bp-title">{post.title}</h1>

        <p className="bp-excerpt">{post.excerpt}</p>

        {post.youtubeId ? (
          <figure className="bp-media">
            <div className="bp-video-frame">
              <LiteYouTubeEmbed videoId={post.youtubeId} title={post.title} />
            </div>
            <figcaption>
              <a
                href={`https://www.youtube.com/watch?v=${post.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bp-video-link"
              >
                Abrir no YouTube
                <ArrowUpRight size={14} />
              </a>
            </figcaption>
          </figure>
        ) : post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            priority
            className="bp-image"
          />
        ) : null}

        {/*
          dangerouslySetInnerHTML aqui e SEGURO porque post.content vem de
          data/posts.ts (versionado em git, escrito por nos). Se um dia migrar
          pra CMS ou input do usuario, sanitizar com DOMPurify ou similar antes.
        */}
        <div
          className="bp-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="bp-footer">
          <Link href="/blog" className="bp-back">
            <ArrowLeft size={16} />
            Outras histórias
          </Link>
          <a
            className="btn-yt"
            href={post.youtubeId ? `https://www.youtube.com/watch?v=${post.youtubeId}` : YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {post.youtubeId ? 'Ver no canal →' : 'Ir pro YouTube →'}
          </a>
        </div>

        {/* JSON-LD Article schema. Permite Google enriquecer o resultado de busca
            com data, autor, imagem. Inline porque os dados vem do mesmo render. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              dateModified: post.date,
              // image e campo obrigatorio pra Article rich snippet do Google.
              // Pra posts com video usa thumbnail YouTube; senao logo grande.
              image: heroImage
                ? new URL(heroImage, SITE_URL).href
                : `${SITE_URL}/images/logo/full.jpg`,
              author: { '@type': 'Organization', name: SITE_NAME },
              publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${SITE_URL}/blog/${post.slug}`,
              },
            }),
          }}
        />
      </div>
    </article>
  );
}
