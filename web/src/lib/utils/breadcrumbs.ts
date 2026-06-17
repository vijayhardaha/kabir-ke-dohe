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
