/**
 * Props for the base popular couplets archive page.
 *
 * @type {PopularCoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
export interface PopularCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Props for the paginated popular couplets archive page.
 * Extends the base props with a `params` object containing the page number.
 *
 * @type {PopularCoupletsPaginatedPageProps}
 * @extends {PopularCoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 */
export interface PopularCoupletsPaginatedPageProps extends PopularCoupletsPageProps {
  params: Promise<{ page: string }>;
}
