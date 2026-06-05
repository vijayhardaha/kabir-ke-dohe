/**
 * A predefined tag with slug and display name.
 */
export interface TagConstant {
  slug: string;
  name: string;
}

/**
 * Predefined tags for Kabir's couplets.
 * Each entry provides a unique slug and human-readable name.
 */
export const TAGS: TagConstant[] = [
  { slug: 'bhakti', name: 'Bhakti' },
  { slug: 'gyan', name: 'Gyan' },
  { slug: 'vairagya', name: 'Vairagya' },
  { slug: 'seva', name: 'Seva' },
  { slug: 'satsang', name: 'Satsang' },
  { slug: 'dhyana', name: 'Dhyana' },
  { slug: 'karma', name: 'Karma' },
  { slug: 'prema', name: 'Prema' },
  { slug: 'yoga', name: 'Yoga' },
  { slug: 'satya', name: 'Satya' },
];

/**
 * Looks up a tag constant by its slug.
 *
 * @param {string} slug - The slug to search for.
 *
 * @returns {TagConstant | undefined} The matching tag, or undefined.
 */
export function getTagBySlug(slug: string): TagConstant | undefined {
  return TAGS.find((t) => t.slug === slug);
}
