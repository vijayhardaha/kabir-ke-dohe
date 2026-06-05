import type { CategoryConstant } from './categories';
import { CATEGORIES } from './categories';

/**
 * A single navigation link item. When `children` is provided, the item
 * acts as a grouping label with a dropdown of nested links.
 *
 * @type {NavLink}
 * @property {string} href - URL or path for the link
 * @property {string} label - Display text for the link
 * @property {NavLink[]} [children] - Optional nested submenu items
 */
export interface NavLink {
  href: string;
  label: string;
  children?: NavLink[];
}

/**
 * Converts a {@link CategoryConstant} into a navigation link.
 *
 * @param {CategoryConstant} cat - The category constant.
 *
 * @returns {NavLink} A navigation link pointing to the category page.
 */
function categoryToNavLink(cat: CategoryConstant): NavLink {
  return { href: `/category/${cat.slug}`, label: cat.name };
}

/**
 * Primary navigation menu items used in the Header and Footer.
 */
export const MAIN_MENU: NavLink[] = [
  { href: '/couplets', label: 'All Dohe' },
  { href: '/popular-couplets', label: 'Popular Dohe' },
  { href: '/featured-couplets', label: 'Featured Dohe' },
  { href: '/categories', label: 'Categories', children: CATEGORIES.map(categoryToNavLink) },
  { href: '/about', label: 'About Kabir' },
];
