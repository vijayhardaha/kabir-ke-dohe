import type { Metadata } from 'next';

/**
 * Site‑wide configuration values for name, title, description, and URL.
 */
export const SITE_CONFIG = {
  name: 'Kabir Dohe Hub',
  title: 'Kabir Dohe Hub — Wisdom of Sant Kabir',
  description:
    "Explore the timeless wisdom of Sant Kabir through his dohas (couplets). Read, learn, and reflect on the spiritual teachings of one of India's most revered poets with Hindi and English translations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

/**
 * Default Next.js Metadata object used across all pages for SEO, Open Graph,
 * and Twitter cards.
 */
export const siteMetadata: Metadata = {
  title: { default: SITE_CONFIG.title, template: `%s — ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: SITE_CONFIG.title, description: SITE_CONFIG.description },
  robots: { index: true, follow: true },
};

/**
 * Returns the canonical site URL, falling back to localhost during development.
 *
 * Preference order:
 * 1. `NEXT_PUBLIC_SITE_URL` from `SITE_CONFIG`
 * 2. Vercel environment variables
 * 3. Fallback to `http://localhost:{PORT}` where PORT defaults to 3000
 *
 * Normalization ensures a scheme is present and removes a trailing slash.
 *
 * @returns {string} The normalized base URL.
 *
 * @example
 * // When no env vars are set
 * siteUrl() // -> 'http://localhost:3000'
 */
export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL
    || process.env.VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_BRANCH_URL
    || process.env.VERCEL_URL
    || `http://localhost:${process.env.PORT || 3000}`;

  const cleaned = url.trim().replace(/\/+$/, '');

  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
}

/**
 * Normalizes a slug for canonical usage.
 *
 * - Removes leading and trailing slashes
 * - Returns empty string for root
 *
 * @param {string} [path] - The input path or slug.
 *
 * @returns {string} A clean relative path without leading slash.
 *
 * @example
 * cleanPath("about")      // "about"
 * cleanPath("/about")     // "about"
 * cleanPath("/about/")    // "about"
 * cleanPath("")           // ""
 * cleanPath("/")          // ""
 */
export function cleanPath(path: string = ''): string {
  return path.trim().replace(/^\/+/, '').replace(/\/+$/, '');
}

/**
 * Generates a fully qualified permalink.
 *
 * Combines the application's base URL with a normalized path.
 * Leading and trailing slashes in the path are handled safely.
 * If no path is provided, the base URL is returned.
 *
 * @param {string} [path] - Optional path segment to append to the base URL.
 *
 * @returns {string} The permalink absolute URL.
 *
 * @example
 * // Assuming siteUrl() returns "https://example.com"
 * getPermaLink("about")     // → "https://example.com/about"
 * getPermaLink("/about")    // → "https://example.com/about"
 * getPermaLink("/about/")   // → "https://example.com/about"
 * getPermaLink("")          // → "https://example.com"
 * getPermaLink("/")         // → "https://example.com"
 */
export function getPermaLink(path: string = ''): string {
  return [siteUrl(), cleanPath(path)].filter(Boolean).join('/');
}
