import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { posts } from '@/data/posts';

export const metadata: Metadata = {
  title: 'Blog — Terra Gentil',
  description: 'Dicas de jardinagem, bastidores das transformações e histórias reais do Terra Gentil.',
};

export default function BlogPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-terra-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-terra-900 mb-4">Blog</h1>
          <p className="text-terra-700 text-lg">
            Histórias, dicas e bastidores das transformações Terra Gentil.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-2xl border border-terra-100 overflow-hidden hover:border-terra-300 hover:shadow-lg transition-all"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="md:flex">
                    {post.image && (
                      <div className="md:w-1/3 h-48 md:h-auto bg-terra-100 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 md:flex-1">
                      <time className="text-sm text-terra-600">
                        {new Date(post.date).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                      <h2 className="text-xl md:text-2xl font-bold text-terra-900 mt-2 mb-3 group-hover:text-terra-600 transition">
                        {post.title}
                      </h2>
                      <p className="text-terra-700 leading-relaxed mb-4">{post.excerpt}</p>
                      <div className="inline-flex items-center gap-1 text-terra-700 font-medium text-sm group-hover:gap-2 transition-all">
                        Ler mais <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
