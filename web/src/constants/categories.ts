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
 */
export const CATEGORIES: CategoryConstant[] = [
  { slug: 'divine-grace', name: 'Divine Grace' },
  { slug: 'social-critique', name: 'Social Critique' },
  { slug: 'ego-dissolution', name: 'Ego Dissolution' },
  { slug: 'witness-awareness', name: 'Witness Awareness' },
  { slug: 'sacred-devotion', name: 'Sacred Devotion' },
  { slug: 'inner-integrity', name: 'Inner Integrity' },
  { slug: 'maya-time', name: 'Maya & Time' },
  { slug: 'ultimate-reality', name: 'Ultimate Reality' },
  { slug: 'final-liberation', name: 'Final Liberation' },
  { slug: 'silent-sound', name: 'Silent Sound' },
  { slug: 'karmic-law', name: 'Karmic Law' },
  { slug: 'still-consciousness', name: 'Still Consciousness' },
  { slug: 'selfless-action', name: 'Selfless Action' },
  { slug: 'emotional-mastery', name: 'Emotional Mastery' },
  { slug: 'true-detachment', name: 'True Detachment' },
  { slug: 'noble-company', name: 'Noble Company' },
  { slug: 'inner-purification', name: 'Inner Purification' },
  { slug: 'heart-vs-mind', name: 'Heart vs Mind' },
  { slug: 'direct-experience', name: 'Direct Experience' },
  { slug: 'lower-vices', name: 'Lower Vices' },
];

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
