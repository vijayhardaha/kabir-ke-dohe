import type { Metadata } from 'next';

import { buildMetadata } from '@/lib/utils/meta';
import { type ArchivePageConfig } from '@/lib/utils/schema';

/** Config for the all couplets archive page. */
export const PAGE_CONFIG: ArchivePageConfig = {
  seoTitle: "Kabir's Couplets",
  seoDescription:
    "Sant Kabir ke Dohe का संपूर्ण संग्रह। आध्यात्मिक ज्ञान और life truths, सरल Hindi and English meaning के साथ। Read Kabir Das's inspirational dohas here.",
  seoPath: 'couplets',
  seoKeywords: ['all couplets', 'Kabir dohe collection', 'complete dohas'],
  breadcrumbLabel: "Kabir's Couplets",
  pageTitle: "कबीर के दोहे (Kabir's Couplets)",
  pageDescription:
    "कबीर के दोहों का संपूर्ण संग्रह — आध्यात्मिक ज्ञान, जीवन के सच और प्रेरणा से भरे Kabir ke dohe, हिंदी और अंग्रेज़ी अर्थ के साथ (Explore the complete collection of Sant Kabir Das's dohas — spiritual wisdom, life truths, and inspiration with Hindi and English meanings)",
};

/** SEO metadata for the couplets page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});
