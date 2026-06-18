import { CREATOR, type CreatorConfig } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';

/**
 * Site-wide configuration values for SEO and metadata.
 */
export const SITE_CONFIG = {
  name: 'Kabir Ke Dohe',
  title: 'Kabir Ke Dohe — Wisdom of Sant Kabir',
  url: 'https://kabirdohehub.vercel.app',
  description:
    "Explore the timeless wisdom of Sant Kabir through his dohas (couplets). Read, learn, and reflect on the spiritual teachings of one of India's most revered poets with Hindi and English translations.",
  category: 'Spirituality',
  classification: 'Couplet Archive, Spiritual Poetry, Hindi Literature, Kabir Dohas, Devotional Content',
  creator: CREATOR as CreatorConfig,
  organization: {
    name: 'Kabir Dohe Hub',
    description:
      'Kabir Dohe Hub is a digital platform offering curated collections of Kabir ke dohe, along with tools and APIs to make this knowledge easily accessible.',
    url: 'https://kabirdohehub.vercel.app',
    sameAs: [
      'https://kabirdohehub.vercel.app',
      'https://kabirdoheapi.vercel.app',
      'https://kabirdoheimages.vercel.app',
    ],
    foundingDate: 2024,
  },
};

/**
 * SEO keywords for the website.
 */
const SEO_KEYWORDS = [
  'Kabir Das',
  'Sant Kabir',
  'Kabir ke dohe',
  'Kabir dohas',
  'Kabir couplets',
  'Sant Kabir dohas in Hindi',
  'Kabir spiritual quotes',
  'Hindi poetry of Kabir',
  'Kabir teachings in Hindi and English',
  'spiritual wisdom of Kabir',
  'Indian philosophy',
  'Kabir dohe with meaning',
  'Kabir Das biography',
  'Kabir poetry collection',
  'best Kabir dohas',
  'famous Kabir couplets',
  'inspirational Kabir quotes',
  'Kabir love quotes',
  'Kabir life lessons',
  'read Kabir dohas online',
  'Kabir couplets with translation',
  'Sant Kabir Das quotes',
  'Hindi spiritual poetry',
  'meditation quotes Kabir',
  'Kabir motivational quotes',
  'Kabir poetry in English',
  'Kabir Das teachings',
  'Kabir dohe in Hindi',
  'Kabir bhajans and dohas',
];

/**
 * Google Search Console verification code for the site.
 */
const GOOGLE_SITE_VERIFICATION = '4CyrCxZi9TWgvS-GzB1QUhgEl0bKoIzT36368e_vlx0';

/**
 * Google Analytics measurement ID for site traffic tracking.
 */
export const GOOGLE_ANALYTICS_ID = 'G-GM50Y47GMH';

/**
 * Title and description used for SEO, Open Graph, and Twitter cards.
 */
const titleAndDescription = { title: SITE_CONFIG.title, description: SITE_CONFIG.description };

/**
 * Default image metadata used for Open Graph and Twitter cards.
 */
const seoImage = {
  url: '/preview.png',
  secureUrl: '/preview.png',
  alt: 'Kabir Ke Dohe — Wisdom of Sant Kabir',
  width: 1200,
  height: 630,
  type: 'image/png',
};

/**
 * The main metadata object containing all SEO-related information for the website.
 */
export const SITE_METADATA: Metadata = {
  ...titleAndDescription,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: { canonical: new URL(SITE_CONFIG.url) },
  keywords: SEO_KEYWORDS,
  applicationName: SITE_CONFIG.name,
  generator: 'Next.js 14 | Vercel Deployment',
  referrer: 'origin-when-cross-origin',
  authors: [{ name: SITE_CONFIG.creator.name, url: SITE_CONFIG.creator.urls.gravatar }],
  creator: SITE_CONFIG.creator.name,
  publisher: SITE_CONFIG.organization.name,
  robots: { index: true, follow: true },
  category: SITE_CONFIG.category,
  classification: SITE_CONFIG.classification,
  verification: { google: GOOGLE_SITE_VERIFICATION },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    ...titleAndDescription,
    images: seoImage,
    type: 'website',
    siteName: SITE_CONFIG.organization.name,
    locale: 'en_US',
    url: SITE_CONFIG.url,
  },
  twitter: {
    ...titleAndDescription,
    card: 'summary_large_image',
    images: seoImage,
    creator: SITE_CONFIG.creator.handles[0],
  },
  other: { lang: 'en' },
};
