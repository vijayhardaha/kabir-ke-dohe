/**
 * Unit tests for SEO utility functions.
 *
 * Tests the siteUrl() and getPermaLink() functions which handle
 * URL construction and normalization.
 */

import { describe, it, expect, beforeEach } from 'vitest';

const ORIGINAL_ENV = process.env;

describe('siteUrl', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    // Clear all relevant env vars for a clean test
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_BRANCH_URL;
    delete process.env.VERCEL_URL;
    delete process.env.PORT;
  });

  it('returns localhost fallback when no env vars are set', async () => {
    const { siteUrl } = await import('../seo');
    expect(siteUrl()).toBe('http://localhost:3000');
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const { siteUrl } = await import('../seo');
    expect(siteUrl()).toBe('https://example.com');
  });

  it('strips trailing slashes', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/';
    const { siteUrl } = await import('../seo');
    expect(siteUrl()).toBe('https://example.com');
  });

  it('prepends https:// when scheme is missing', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'example.com';
    const { siteUrl } = await import('../seo');
    expect(siteUrl()).toBe('https://example.com');
  });

  it('uses PORT env var for localhost fallback', async () => {
    process.env.PORT = '4000';
    const { siteUrl } = await import('../seo');
    expect(siteUrl()).toBe('http://localhost:4000');
  });
});

describe('getPermaLink', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_BRANCH_URL;
    delete process.env.VERCEL_URL;
  });

  it('returns base URL for empty path', async () => {
    const { getPermaLink } = await import('../seo');
    expect(getPermaLink('')).toBe('http://localhost:3000');
  });

  it('appends a path to the base URL', async () => {
    const { getPermaLink } = await import('../seo');
    expect(getPermaLink('about')).toBe('http://localhost:3000/about');
  });

  it('normalizes leading slash', async () => {
    const { getPermaLink } = await import('../seo');
    expect(getPermaLink('/about')).toBe('http://localhost:3000/about');
  });

  it('normalizes trailing slash', async () => {
    const { getPermaLink } = await import('../seo');
    expect(getPermaLink('/about/')).toBe('http://localhost:3000/about');
  });
});
