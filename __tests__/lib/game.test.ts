import { describe, it, expect } from 'vitest';
import { sanitizeNickname, buildGameUrl } from '@/lib/game';
import { GAME_URL } from '@/lib/constants';

describe('sanitizeNickname', () => {
  it('uppercases and accepts valid', () => {
    expect(sanitizeNickname('andre')).toBe('ANDRE');
    expect(sanitizeNickname('joao_77')).toBe('JOAO_77');
    expect(sanitizeNickname('TG_PLAYER')).toBe('TG_PLAYER');
  });

  it('strips invalid chars', () => {
    expect(sanitizeNickname('jose-da silva!')).toBe('JOSEDASILVA');
    expect(sanitizeNickname('  ANA  ')).toBe('ANA');
  });

  it('strips accents (would be invalid for the game otherwise)', () => {
    expect(sanitizeNickname('joão')).toBe('JOO');
  });

  it('returns null when too short or too long after sanitization', () => {
    expect(sanitizeNickname('ab')).toBeNull();
    expect(sanitizeNickname('a'.repeat(13))).toBeNull();
    expect(sanitizeNickname('!!')).toBeNull();
  });

  it('returns null for non-string input', () => {
    expect(sanitizeNickname(undefined)).toBeNull();
    expect(sanitizeNickname(null)).toBeNull();
    expect(sanitizeNickname(123)).toBeNull();
    expect(sanitizeNickname(['ANDRE'])).toBeNull();
  });

  it('accepts boundary lengths 3 and 12', () => {
    expect(sanitizeNickname('ABC')).toBe('ABC');
    expect(sanitizeNickname('ABCDEFGHIJKL')).toBe('ABCDEFGHIJKL');
  });
});

describe('buildGameUrl', () => {
  it('returns base url when no nickname', () => {
    expect(buildGameUrl()).toBe(GAME_URL);
    expect(buildGameUrl('')).toBe(GAME_URL);
    expect(buildGameUrl(undefined)).toBe(GAME_URL);
  });

  it('returns base url when nickname cannot be sanitized', () => {
    expect(buildGameUrl('!!')).toBe(GAME_URL);
    expect(buildGameUrl('a'.repeat(20))).toBe(GAME_URL);
  });

  it('appends nickname when valid', () => {
    const url = new URL(buildGameUrl('andre'));
    expect(url.searchParams.get('nickname')).toBe('ANDRE');
  });

  it('preserves the base URL pathname (with trailing slash)', () => {
    const url = new URL(buildGameUrl('andre'));
    const baseUrl = new URL(GAME_URL);
    expect(url.origin).toBe(baseUrl.origin);
    expect(url.pathname).toBe(baseUrl.pathname);
  });
});
