/**
 * Unit tests for getFeaturedImageUrl and getOgImageUrl utilities.
 *
 * Tests featured image URL construction from slug and path-aware OG image resolution.
 */

import { describe, it, expect, beforeEach } from 'vitest';

const ORIGINAL_ENV = process.env;

// ---------------------------------------------------------------------------
// getFeaturedImageUrl
// ---------------------------------------------------------------------------

describe('getFeaturedImageUrl', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it('returns null when NEXT_PUBLIC_SUPABASE_URL is not set', async () => {
    const { getFeaturedImageUrl } = await import('../og-image');
    expect(getFeaturedImageUrl('test-slug')).toBeNull();
  });

  it('constructs a valid Supabase storage URL', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc123.supabase.co';
    const { getFeaturedImageUrl } = await import('../og-image');
    const url = getFeaturedImageUrl('balihari-guru-aapno');
    expect(url).toBe('https://abc123.supabase.co/storage/v1/object/public/couplet-images/balihari-guru-aapno.webp');
  });

  it('handles local Supabase URLs', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
    const { getFeaturedImageUrl } = await import('../og-image');
    const url = getFeaturedImageUrl('test-slug');
    expect(url).toBe('http://127.0.0.1:54321/storage/v1/object/public/couplet-images/test-slug.webp');
  });

  it('uses .webp extension for all slugs', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { getFeaturedImageUrl } = await import('../og-image');
    const url = getFeaturedImageUrl('some-slug');
    expect(url).toMatch(/\.webp$/);
  });
});

// ---------------------------------------------------------------------------
// getOgImageUrl
// ---------------------------------------------------------------------------

describe('getOgImageUrl', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it('returns null when NEXT_PUBLIC_SUPABASE_URL is not set', async () => {
    const { getOgImageUrl } = await import('../og-image');
    expect(getOgImageUrl('couplet/test-slug')).toBeNull();
  });

  it('returns a Supabase storage URL for couplet paths', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc123.supabase.co';
    const { getOgImageUrl } = await import('../og-image');
    expect(getOgImageUrl('couplet/balihari-guru')).toBe(
      'https://abc123.supabase.co/storage/v1/object/public/couplet-images/balihari-guru.webp'
    );
  });

  it('handles couplet paths with a leading slash', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { getOgImageUrl } = await import('../og-image');
    expect(getOgImageUrl('/couplet/some-slug')).toBe(
      'https://abc.supabase.co/storage/v1/object/public/couplet-images/some-slug.webp'
    );
  });

  it('returns null for non-couplet paths', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { getOgImageUrl } = await import('../og-image');
    expect(getOgImageUrl('about')).toBeNull();
    expect(getOgImageUrl('categories')).toBeNull();
    expect(getOgImageUrl('')).toBeNull();
    expect(getOgImageUrl('/')).toBeNull();
  });

  it('uses .webp extension for couplet paths', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { getOgImageUrl } = await import('../og-image');
    expect(getOgImageUrl('couplet/some-slug')).toMatch(/\.webp$/);
  });
});
