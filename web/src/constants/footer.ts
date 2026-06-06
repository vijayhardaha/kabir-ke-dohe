import { CATEGORIES } from '@/constants/categories';

/**
 * Quick-link items for column navigation.
 */
export const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/couplets', label: 'Couplets' },
  { href: '/featured-couplets', label: 'Featured Couplets' },
  { href: '/popular-couplets', label: 'Popular Couplets' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
] as const;

/**
 * Useful links column.
 */
export const USEFUL_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/docs', label: 'API Documentation' },
] as const;

/**
 * Popular categories shown in the footer (first 10).
 */
export const POPULAR_CATEGORIES = CATEGORIES.slice(0, 10);
