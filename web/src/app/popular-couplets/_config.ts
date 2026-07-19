import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import type { ArchivePageConfig } from '@/lib/utils/schema';

/** Config for the popular couplets archive page. */
export const PAGE_CONFIG: ArchivePageConfig = {
  seoTitle: 'Popular Couplets',
  seoDescription:
    'Popular Kabir ke Dohe: सबसे पसंदीदा और heart-touching dohas of Sant Kabir. Explore the most loved couplets with Hindi and English meanings.',
  seoPath: 'popular-couplets',
  seoKeywords: ['popular couplets', 'most loved dohas', 'famous Kabir dohe'],
  filter: { isPopular: true },
  breadcrumbLabel: 'Popular Couplets',
  pageTitle: 'लोकप्रिय दोहे (Popular Couplets)',
  pageDescription:
    'सबसे अधिक पसंद किए जाने वाले कबीर के दोहे — जिन्होंने लाखों दिलों को छुआ है, हिंदी और अंग्रेज़ी अर्थ के साथ (The most loved and cherished dohas of Sant Kabir that have touched millions of hearts, with Hindi and English meanings)',
};

/** SEO metadata for the popular couplets page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
