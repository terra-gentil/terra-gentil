import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { posts, type Post } from '@/data/posts';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
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
    title: `${post.title} - ${SITE_NAME}`,
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

  return (
    <article className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-terra-600 hover:text-terra-800 mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Voltar para o blog
        </Link>

        <time dateTime={post.date} className="text-sm text-terra-600">
          {new Date(post.date).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
        <h1 className="text-3xl md:text-4xl font-bold text-terra-900 mt-3 mb-8 leading-tight">
          {post.title}
        </h1>

        {post.youtubeId ? (
          <div className="mb-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden">
              <LiteYouTubeEmbed videoId={post.youtubeId} title={post.title} />
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${post.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-terra-700 hover:text-terra-900"
            >
              Abrir no YouTube →
            </a>
          </div>
        ) : post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            priority
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-10"
          />
        ) : null}

        {/*
          dangerouslySetInnerHTML aqui e SEGURO porque post.content vem de
          data/posts.ts (versionado em git, escrito por nos). Se um dia migrar
          pra CMS ou input do usuario, sanitizar com DOMPurify ou similar antes.
        */}
        <div
          className="prose prose-terra max-w-none text-terra-800 leading-relaxed space-y-4 [&>p]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-terra-800 [&>h3]:mt-8 [&>h3]:mb-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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
