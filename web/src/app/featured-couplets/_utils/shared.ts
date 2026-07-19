/**
 * Props for the base featured couplets archive page.
 *
 * @type {FeaturedCoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
export interface FeaturedCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Props for the paginated featured couplets archive page.
 * Extends the base props with a `params` object containing the page number.
 *
 * @type {FeaturedCoupletsPaginatedPageProps}
 * @extends {FeaturedCoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 */
export interface FeaturedCoupletsPaginatedPageProps extends FeaturedCoupletsPageProps {
  params: Promise<{ page: string }>;
}
