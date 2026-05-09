import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { posts } from '@/data/posts';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post não encontrado' };

  return {
    title: `${post.title} - ${SITE_NAME}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
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

        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            priority
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-10"
          />
        )}

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
              // Fallback pro logo grande quando o post nao tem foto propria.
              image: post.image
                ? new URL(post.image, SITE_URL).href
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
