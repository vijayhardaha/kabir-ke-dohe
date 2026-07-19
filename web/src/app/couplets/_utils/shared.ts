/**
 * Props for the base couplets archive page.
 *
 * @type {CoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
export interface CoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Props for the paginated couplets archive page.
 * Extends the base props with a `params` object containing the page number.
 *
 * @type {CoupletsPaginatedPageProps}
 * @extends {CoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 */
export interface CoupletsPaginatedPageProps extends CoupletsPageProps {
  params: Promise<{ page: string }>;
}
