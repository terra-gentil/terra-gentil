import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogPage, { metadata } from '@/app/blog/page';
import { posts } from '@/data/posts';

describe('app/blog (listagem)', () => {
  it('renders the page hero and one card per post', () => {
    render(<BlogPage />);
    // PageHero renderiza h1 + eyebrow "Blog · N histórias"
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Blog · ${posts.length} hist`))).toBeInTheDocument();
    for (const p of posts) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
      expect(screen.getByText(p.excerpt)).toBeInTheDocument();
    }
  });

  it('every card links to /blog/[slug]', () => {
    const { container } = render(<BlogPage />);
    for (const p of posts) {
      const link = container.querySelector(`a[href="/blog/${p.slug}"]`);
      expect(link).not.toBeNull();
    }
  });

  it('exposes Blog metadata', () => {
    expect(metadata.title).toMatch(/Blog/);
  });
});
