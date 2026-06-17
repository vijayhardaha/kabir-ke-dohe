import type { SortOption } from './types';

// ── Sort options ──────────────────────────────────────────────────────────

/**
 * Available sort combinations for the archive listing.
 */
export const SORT_OPTIONS: SortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'popular', label: 'Popular' },
  { value: 'couplet_asc', label: 'Couplet (अ - ज्ञ)' },
  { value: 'couplet_desc', label: 'Couplet (ज्ञ - अ)' },
];

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Maps URL sort params to the corresponding dropdown option value.
 *
 * @param {string} sortBy - Current sort_by query param.
 * @param {string} sortOrder - Current sort_order query param.
 * @param {string | null} isPopular - Whether is_popular=true is in the URL.
 *
 * @returns {string} The matching dropdown option value.
 */
export function getSortValue(sortBy: string, sortOrder: string, isPopular: string | null): string {
  if (isPopular === 'true') return 'popular';
  if (sortBy === 'text_hi' && sortOrder === 'asc') return 'couplet_asc';
  if (sortBy === 'text_hi' && sortOrder === 'desc') return 'couplet_desc';
  return 'default';
}
