import { aboutPageSchema, breadcrumbSchema } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { type PageConfig } from '@/lib/utils/schema';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

/** Config for the about page. */
const PAGE_CONFIG: PageConfig = {
  seoTitle: 'About Sant Kabir Das',
  seoDescription:
    'Learn about the life, teachings, and legacy of Sant Kabir Das. Discover how his 15th-century spiritual wisdom and dohas continue to inspire millions today.',
  seoPath: 'about',
  seoKeywords: ['About Kabir', 'Sant Kabir biography', 'Kabir life story', 'Kabir Das history'],
};

/** Site URL used in JSON-LD schemas. */
const ROOT_URL = siteUrl();

/** JSON-LD schema for the about page. */
export const PAGE_SCHEMA = [
  ...globalSchema(),
  aboutPageSchema(
    { rootUrl: ROOT_URL, path: PAGE_CONFIG.seoPath },
    { name: `${PAGE_CONFIG.seoTitle} — Kabir Ke Dohe` }
  ),
  breadcrumbSchema({
    rootUrl: ROOT_URL,
    items: [
      { name: 'Home', path: '' },
      { name: PAGE_CONFIG.seoTitle, path: PAGE_CONFIG.seoPath },
    ],
  }),
];

/** SEO metadata for the about page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
