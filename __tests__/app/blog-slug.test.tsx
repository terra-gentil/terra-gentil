import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const { notFoundSpy } = vi.hoisted(() => ({
  notFoundSpy: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
vi.mock('next/navigation', () => ({ notFound: notFoundSpy }));

import PostPage, { generateMetadata, generateStaticParams } from '@/app/blog/[slug]/page';
import { posts } from '@/data/posts';

describe('app/blog/[slug]', () => {
  it('generateStaticParams returns one entry per post', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(posts.length);
    expect(params).toEqual(posts.map((p) => ({ slug: p.slug })));
  });

  it('generateMetadata returns title+description for valid slug', async () => {
    const post = posts[0];
    const meta = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
    expect(meta.title).toContain(post.title);
    expect(meta.description).toBe(post.excerpt);
  });

  it('generateMetadata returns fallback for unknown slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nope' }) });
    expect(meta.title).toMatch(/n[ãa]o encontrado/i);
  });

  it('renders post content for valid slug', async () => {
    const post = posts[0];
    const ui = await PostPage({ params: Promise.resolve({ slug: post.slug }) });
    render(ui);
    expect(screen.getByRole('heading', { level: 1, name: post.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o blog/i })).toHaveAttribute('href', '/blog');
  });

  it('calls notFound for unknown slug', async () => {
    notFoundSpy.mockClear();
    await expect(PostPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow();
    expect(notFoundSpy).toHaveBeenCalled();
  });
});
