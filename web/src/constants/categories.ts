/**
 * A predefined category with slug and display name.
 */
export interface CategoryConstant {
  slug: string;
  name: string;
}

/**
 * Predefined categories for Kabir's couplets.
 * Each entry provides a unique slug and human-readable name.
 * Names are in Hindi with English translation in parentheses.
 */
export const CATEGORIES: CategoryConstant[] = [
  { slug: 'nirguna-brahman', name: 'निर्गुण ब्रह्म (Nirguna Brahman)' },
  { slug: 'the-gurus-importance', name: "गुरु महत्व (The Guru's Importance)" },
  { slug: 'bhakti', name: 'भक्ति (Bhakti)' },
  { slug: 'maya', name: 'माया (Maya)' },
  { slug: 'satsang', name: 'सत्संग (Satsang)' },
  { slug: 'meditation', name: 'ध्यान (Meditation)' },
  { slug: 'truth', name: 'सत्य (Truth)' },
  { slug: 'non-violence', name: 'अहिंसा (Non-Violence)' },
  { slug: 'humility', name: 'विनम्रता (Humility)' },
  { slug: 'patience', name: 'धैर्य (Patience)' },
  { slug: 'forgiveness', name: 'क्षमा (Forgiveness)' },
  { slug: 'compassion', name: 'करुणा (Compassion)' },
  { slug: 'religious-hypocrisy', name: 'धार्मिक पाखंड (Religious Hypocrisy)' },
  { slug: 'the-ego', name: 'अहंकार (The Ego)' },
  { slug: 'anger', name: 'क्रोध (Anger)' },
  { slug: 'greed', name: 'लोभ (Greed)' },
  { slug: 'lust', name: 'काम (Lust)' },
  { slug: 'attachment', name: 'मोह (Attachment)' },
  { slug: 'pride', name: 'अभिमान (Pride)' },
  { slug: 'fear', name: 'भय (Fear)' },
  { slug: 'karma', name: 'कर्म (Karma)' },
  { slug: 'reincarnation', name: 'पुनर्जन्म (Reincarnation)' },
  { slug: 'detachment', name: 'वैराग्य (Detachment)' },
  { slug: 'sorrow-and-joy', name: 'दुख और सुख (Sorrow and Joy)' },
  { slug: 'the-wake-up-call', name: 'जागृति (The Wake-up Call)' },
  { slug: 'liberation', name: 'मुक्ति (Liberation)' },
];

/**
 * Widget-specific categories displayed in the sidebar (16 categories).
 * Subset of all categories for the categories widget.
 *
 * @type {CategoryConstant[]}
 */
const WIDGET_SLUGS = [
  'bhakti',
  'maya',
  'truth',
  'non-violence',
  'humility',
  'patience',
  'forgiveness',
  'compassion',
  'religious-hypocrisy',
  'the-ego',
  'anger',
  'greed',
  'lust',
  'fear',
  'karma',
  'liberation',
] as const;

export const WIDGET_CATEGORIES: CategoryConstant[] = WIDGET_SLUGS.map((slug) =>
  CATEGORIES.find((c) => c.slug === slug)
).filter((c): c is CategoryConstant => c !== undefined);

/**
 * Looks up a category constant by its slug.
 *
 * @param {string} slug - The slug to search for.
 *
 * @returns {CategoryConstant | undefined} The matching category, or undefined.
 */
export function getCategoryBySlug(slug: string): CategoryConstant | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}
