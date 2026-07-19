import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { buildPageSchema, type PageConfig } from '@/lib/utils/schema';

/** Config for the 404 page. */
export const PAGE_CONFIG: PageConfig = {
  seoTitle: '404 - Page Not Found',
  seoDescription: 'The requested page could not be found.',
  seoPath: '404',
  seoKeywords: ['404', 'not found', 'page missing'],
};

/** JSON-LD schema for the 404 page. */
export const PAGE_SCHEMA = buildPageSchema(PAGE_CONFIG);

/** SEO metadata for the 404 page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
