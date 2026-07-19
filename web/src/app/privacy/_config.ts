import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { buildPageSchema, type PageConfig } from '@/lib/utils/schema';

/** Config for the privacy page. */
export const PAGE_CONFIG: PageConfig = {
  seoTitle: 'Privacy Policy',
  seoDescription:
    'Privacy Policy for Kabir Ke Dohe: Clear information on how we collect, use, and protect your data to ensure a safe browsing experience.',
  seoPath: 'privacy',
  seoKeywords: ['privacy policy', 'data protection'],
};

/** JSON-LD schema for the privacy page. */
export const PAGE_SCHEMA = buildPageSchema(PAGE_CONFIG);

/** SEO metadata for the privacy page. */
export const metadata: Metadata = {
  ...buildMetadata({ title: PAGE_CONFIG.seoTitle, description: PAGE_CONFIG.seoDescription, path: PAGE_CONFIG.seoPath }),
  robots: { index: false, follow: false },
};
