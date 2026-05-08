import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';

describe('app/robots', () => {
  it('permite tudo, bloqueia /api e aponta o sitemap', () => {
    const r = robots();
    expect(Array.isArray(r.rules) ? r.rules : [r.rules]).toHaveLength(1);
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule.userAgent).toBe('*');
    expect(rule.allow).toBe('/');
    expect(rule.disallow).toEqual(['/api/']);
    expect(r.sitemap).toBe('https://terragentil.com.br/sitemap.xml');
    expect(r.host).toBe('https://terragentil.com.br');
  });
});
