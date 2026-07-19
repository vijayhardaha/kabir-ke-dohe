import { webPageSchema } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { buildKeywords, globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

/** Path segment for search routes. */
export const SEO_PATH = 'search';

/** Keywords used in search page schema. */
export const SEO_KEYWORDS = ['search couplets', 'find dohas', 'Kabir search'];

/** Site URL used in JSON-LD schemas. */
export const ROOT_URL = siteUrl();

/** JSON-LD schema for search pages. */
export const PAGE_SCHEMA = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl: ROOT_URL, path: SEO_PATH },
    { name: 'Search — Kabir Ke Dohe', keywords: buildKeywords(SEO_KEYWORDS) }
  ),
];

/** SEO metadata for search pages. */
export const metadata: Metadata = {
  ...buildMetadata({ title: 'Search', description: 'Find couplets by keyword, theme, or meaning.', path: SEO_PATH }),
  robots: { index: false, follow: false },
};
