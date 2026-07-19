import type { JSX } from 'react';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildArchivePageSchema } from '@/lib/utils/schema';

import { PAGE_CONFIG } from '../_config';
import { type PopularCoupletsPaginatedPageProps } from '../_utils/shared';

export { metadata } from '../_config';

/**
 * Paginated popular couplets page — handles `/popular-couplets/2`, etc.
 *
 * @param {PopularCoupletsPaginatedPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The paginated popular couplets page.
 */
export default async function PopularCoupletsPage({
  params,
  searchParams,
}: PopularCoupletsPaginatedPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/popular-couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({ page, perPage, ...PAGE_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(PAGE_CONFIG, {
    posts,
    pagination,
    page,
    perPage,
    extraKeywords: ['paginated'],
  });

  return (
    <ArchiveContent
      pageSchema={pageSchema}
      pageTitle={PAGE_CONFIG.pageTitle}
      pageDescription={PAGE_CONFIG.pageDescription}
      posts={posts}
      pagination={pagination}
      baseUrl="/popular-couplets"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
