import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import type { ArchivePageConfig } from '@/lib/utils/schema';

/** Config for the featured couplets archive page. */
export const PAGE_CONFIG: ArchivePageConfig = {
  seoTitle: 'Featured Couplets',
  seoDescription:
    "Best Kabir ke Dohe: A curated collection of Sant Kabir's most profound dohas. जीवन के गहरे सच और spiritual wisdom, Hindi and English meanings के साथ।",
  seoPath: 'featured-couplets',
  seoKeywords: ['featured couplets', 'handpicked dohas', 'best Kabir dohe'],
  filter: { isFeatured: true },
  breadcrumbLabel: 'Featured Couplets',
  pageTitle: 'चुनिंदा दोहे (Featured Couplets)',
  pageDescription:
    "कबीर के सबसे गहन और प्रभावशाली दोहों का विशेष संग्रह — आध्यात्मिक ज्ञान और जीवन की सीख, हिंदी और अंग्रेज़ी में (A handpicked collection of Kabir's most profound and impactful dohas — spiritual wisdom and life lessons in Hindi and English)",
};

/** SEO metadata for the featured couplets page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
