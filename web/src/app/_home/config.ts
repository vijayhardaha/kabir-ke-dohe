import { webPageSchema, breadcrumbSchema } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

// ── Home page config ──────────────────────────────────────────────────────

/** Site URL used in JSON-LD schemas. */
const ROOT_URL = siteUrl();

/** JSON-LD schema for the home page. */
export const PAGE_SCHEMA = [
  ...globalSchema(),
  webPageSchema({ rootUrl: ROOT_URL, path: '' }),
  breadcrumbSchema({
    rootUrl: ROOT_URL,
    items: [
      { name: 'Home', path: '' },
      { name: 'Wisdom of Sant Kabir', path: '' },
    ],
  }),
];

/** SEO metadata for the home page. */
export const metadata: Metadata = buildMetadata({
  title: 'Kabir Ke Dohe - Wisdom of Sant Kabir',
  description:
    'Sant Kabir ke Dohe: Explore timeless spiritual wisdom and life lessons. कबीर के दोहे, सरल Hindi and English meanings के साथ। Read, learn, and reflect today.',
  path: '',
  postfix: false,
});
