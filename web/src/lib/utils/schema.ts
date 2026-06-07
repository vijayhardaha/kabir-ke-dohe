import { personSchema, organizationSchema, webSiteSchema } from '@vijayhardaha/schema-builder';

import { SITE_CONFIG } from '@/constants/seo';
import { siteUrl } from '@/lib/utils/seo';

/** Default keywords used across all pages. */
export const BASE_KEYWORDS = [
  'Kabir Das',
  'Sant Kabir',
  'Kabir ke dohe',
  'Kabir dohas',
  'Kabir couplets',
  'Hindi poetry',
  'spiritual wisdom',
  'Indian philosophy',
  'Kabir teachings',
];

/**
 * Breadcrumb item structure.
 *
 * @type {BreadcrumbItem}
 * @property {string} name - Name of the page or breadcrumb label.
 * @property {string} path - URL path for the breadcrumb link.
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Build breadcrumb items for a given page path.
 *
 * Automatically prepends Home breadcrumb.
 *
 * @param {string} path - The page path (e.g., '/about').
 * @param {string} currentPage - The name of the current page.
 *
 * @returns {BreadcrumbItem[]} Array of breadcrumb items.
 */
export function buildBreadcrumbs(path: string, currentPage: string): BreadcrumbItem[] {
  return [
    { name: 'Home', path: '' },
    { name: currentPage, path },
  ];
}

/**
 * Build the global Schema.org entities that appear on every page.
 *
 * Includes Person, Organization, and WebSite entities.
 *
 * @returns {Record<string, unknown>[]} An array of schema objects for global use.
 */
export function globalSchema(): Record<string, unknown>[] {
  const rootUrl = siteUrl();
  const commonOptions = { rootUrl };

  return [
    personSchema(commonOptions),
    organizationSchema(commonOptions, { ...SITE_CONFIG.organization }),
    webSiteSchema(commonOptions, {
      name: SITE_CONFIG.organization.name,
      alternateName: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
    }),
  ];
}
