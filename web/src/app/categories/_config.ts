import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { buildPageSchema, type PageConfig } from '@/lib/utils/schema';

/** Config for the categories page. */
const PAGE_CONFIG: PageConfig = {
  seoTitle: 'Categories',
  seoDescription:
    "Browse Sant Kabir Das's dohas by category. जीवन के सत्य और spiritual teachings, organised by theme with Hindi and English meanings. Explore Kabir's wisdom here.",
  seoPath: 'categories',
  seoKeywords: ['Kabir categories', 'doha themes', 'spiritual topics', 'Kabir teachings by category'],
};

/** JSON-LD schema for the categories page. */
export const PAGE_SCHEMA = buildPageSchema(PAGE_CONFIG);

/** SEO metadata for the categories page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
