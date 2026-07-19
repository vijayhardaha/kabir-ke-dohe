import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { buildPageSchema, type PageConfig } from '@/lib/utils/schema';

/** Config for the terms page. */
export const PAGE_CONFIG: PageConfig = {
  seoTitle: 'Terms & Conditions',
  seoDescription:
    'Terms and Conditions for Kabir Ke Dohe: Detailed rules, disclaimers, and usage guidelines governing the use of our website and services.',
  seoPath: 'terms',
  seoKeywords: ['terms of service', 'terms and conditions'],
};

/** JSON-LD schema for the terms page. */
export const PAGE_SCHEMA = buildPageSchema(PAGE_CONFIG);

/** SEO metadata for the terms page. */
export const metadata: Metadata = {
  ...buildMetadata({ title: PAGE_CONFIG.seoTitle, description: PAGE_CONFIG.seoDescription, path: PAGE_CONFIG.seoPath }),
  robots: { index: false, follow: false },
};
