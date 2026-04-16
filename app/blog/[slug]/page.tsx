import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { posts } from '@/data/posts';
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
    title: `${post.title} — Terra Gentil`,
    description: post.excerpt,
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

        <time className="text-sm text-terra-600">
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
          <img
            src={post.image}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-10"
          />
        )}

        <div
          className="prose prose-terra max-w-none text-terra-800 leading-relaxed space-y-4 [&>p]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-terra-800 [&>h3]:mt-8 [&>h3]:mb-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
