import type { JSX } from 'react';

import { PaginatedArchivePage } from '@/components/common/PaginatedArchivePage';

import { PAGE_CONFIG } from '../_config';

export { metadata } from '../_config';

/**
 * Paginated featured couplets page — handles `/featured-couplets/2`, etc.
 *
 * @param {{ params: Promise<{ page: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting and pagination.
 *
 * @returns {Promise<JSX.Element>} The paginated featured couplets page.
 */
export default async function FeaturedCoupletsPage(props: {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<JSX.Element> {
  return (
    <PaginatedArchivePage
      params={props.params}
      searchParams={props.searchParams}
      config={PAGE_CONFIG}
      baseUrl="/featured-couplets"
      hasFilter
    />
  );
}
