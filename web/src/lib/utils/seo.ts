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
 * @returns {string} The fully‑qualified base URL (e.g. "https://example.com").
 */
export function siteUrl(): string {
  return SITE_CONFIG.url;
}
