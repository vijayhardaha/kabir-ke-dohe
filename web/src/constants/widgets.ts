import type { CategoryConstant } from './categories';

/**
 * Widget-specific categories displayed in the sidebar (12 categories).
 * Subset of all categories for the categories widget.
 *
 * @type {CategoryConstant[]}
 */
export const WIDGET_CATEGORIES: CategoryConstant[] = [
  { slug: 'bhakti', name: 'भक्ति (Bhakti)' },
  { slug: 'maya', name: 'माया (Maya)' },
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
  { slug: 'fear', name: 'भय (Fear)' },
  { slug: 'karma', name: 'कर्म (Karma)' },
  { slug: 'liberation', name: 'मुक्ति (Liberation)' },
];
