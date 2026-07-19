import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { buildPageSchema, type PageConfig } from '@/lib/utils/schema';

/** Config for the tags page. */
const PAGE_CONFIG: PageConfig = {
  seoTitle: 'Tags',
  seoDescription:
    'Explore Kabir ke Dohe by tags. Spiritual themes और जीवन के सबक, organized by tags with Hindi and English meanings. Discover the essence of Kabir.',
  seoPath: 'tags',
  seoKeywords: ['Kabir tags', 'doha topics', 'spiritual tags'],
};

/** JSON-LD schema for the tags page. */
export const PAGE_SCHEMA = buildPageSchema(PAGE_CONFIG);

/** SEO metadata for the tags page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
