/**
 * Unit tests for getOgImageUrl utility.
 *
 * Tests URL construction from slug and environment variable handling.
 */

import { describe, it, expect, beforeEach } from 'vitest';

const ORIGINAL_ENV = process.env;

describe('getOgImageUrl', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it('returns null when NEXT_PUBLIC_SUPABASE_URL is not set', async () => {
    const { getOgImageUrl } = await import('../og-image');
    expect(getOgImageUrl('test-slug')).toBeNull();
  });

  it('constructs a valid Supabase storage URL', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc123.supabase.co';
    const { getOgImageUrl } = await import('../og-image');
    const url = getOgImageUrl('balihari-guru-aapno');
    expect(url).toBe('https://abc123.supabase.co/storage/v1/object/public/couplet-images/balihari-guru-aapno.webp');
  });

  it('handles local Supabase URLs', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
    const { getOgImageUrl } = await import('../og-image');
    const url = getOgImageUrl('test-slug');
    expect(url).toBe('http://127.0.0.1:54321/storage/v1/object/public/couplet-images/test-slug.webp');
  });

  it('uses .webp extension for all slugs', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { getOgImageUrl } = await import('../og-image');
    const url = getOgImageUrl('some-slug');
    expect(url).toMatch(/\.webp$/);
  });
});
