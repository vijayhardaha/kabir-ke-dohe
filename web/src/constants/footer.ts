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
  {
    href: 'https://www.youtube.com/watch?v=T0ICrGkG5bc&list=PLA-W1ItUPL9KtLlS65k_4V_FN3v8tFluO',
    label: 'Kabir Saheb Bhajan',
  },
  {
    href: 'https://www.youtube.com/watch?v=aKpiEXdLIrs&list=PLA-W1ItUPL9LN948SLoXxCl7PSSlNVzOV',
    label: 'Kabir Saheb Dohe',
  },
  { href: 'https://kabirdoheapi.vercel.app/', label: 'API Documentation' },
  { href: 'https://kabirdoheimages.vercel.app/', label: 'Couplets Images' },
] as const;

/**
 * Popular categories shown in the footer (first 10).
 */
export const POPULAR_CATEGORIES = CATEGORIES.slice(0, 10);
