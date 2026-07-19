import type { JSX } from 'react';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { PAGE_CONFIG } from '@/app/couplets/_config';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildArchivePageSchema } from '@/lib/utils/schema';

import { type CoupletsPaginatedPageProps } from '../_utils/shared';

export { metadata } from '../_config';

/**
 * Paginated couplets archive page — handles `/couplets/2`, `/couplets/3`, etc.
 *
 * @param {CoupletsPaginatedPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The paginated archive page.
 */
export default async function CoupletsPage({ params, searchParams }: CoupletsPaginatedPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({ page, perPage, sortBy, sortOrder });

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
      baseUrl="/couplets"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
