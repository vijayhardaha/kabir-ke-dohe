import { type ArchivePageConfig } from '@/lib/utils/schema';

// ── Predefined configs ─────────────────────────────────────────────────────

/**
 * Predefined configuration for the "All Couplets" archive page.
 * Lists every published couplet with no additional filter.
 *
 * @type {ArchivePageConfig}
 */
export const COUPLETS_CONFIG: ArchivePageConfig = {
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

/**
 * Predefined configuration for the "Popular Couplets" archive page.
 * Filters to couplets marked as `is_popular` in the database.
 *
 * @type {ArchivePageConfig}
 */
export const POPULAR_CONFIG: ArchivePageConfig = {
  seoTitle: 'Popular Couplets',
  seoDescription:
    'The most loved and cherished dohas of Sant Kabir that have touched millions of hearts, with Hindi and English meanings.',
  seoPath: 'popular-couplets',
  seoKeywords: ['popular couplets', 'most loved dohas', 'famous Kabir dohe'],
  filter: { isPopular: true },
  breadcrumbLabel: 'Popular Couplets',
  pageTitle: 'लोकप्रिय दोहे (Popular Couplets)',
  pageDescription:
    'सबसे अधिक पसंद किए जाने वाले कबीर के दोहे — जिन्होंने लाखों दिलों को छुआ है, हिंदी और अंग्रेज़ी अर्थ के साथ (The most loved and cherished dohas of Sant Kabir that have touched millions of hearts, with Hindi and English meanings)',
};

/**
 * Predefined configuration for the "Featured Couplets" archive page.
 * Filters to couplets marked as `is_featured` in the database.
 *
 * @type {ArchivePageConfig}
 */
export const FEATURED_CONFIG: ArchivePageConfig = {
  seoTitle: 'Featured Couplets',
  seoDescription:
    "A handpicked collection of Kabir's most profound and impactful dohas — spiritual wisdom and life lessons in Hindi and English.",
  seoPath: 'featured-couplets',
  seoKeywords: ['featured couplets', 'handpicked dohas', 'best Kabir dohe'],
  filter: { isFeatured: true },
  breadcrumbLabel: 'Featured Couplets',
  pageTitle: 'चुनिंदा दोहे (Featured Couplets)',
  pageDescription:
    "कबीर के सबसे गहन और प्रभावशाली दोहों का विशेष संग्रह — आध्यात्मिक ज्ञान और जीवन की सीख, हिंदी और अंग्रेज़ी में (A handpicked collection of Kabir's most profound and impactful dohas — spiritual wisdom and life lessons in Hindi and English)",
};
