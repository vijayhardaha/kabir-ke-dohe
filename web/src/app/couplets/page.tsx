import type { JSX } from 'react';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { PAGE_CONFIG } from '@/app/couplets/_config';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildArchivePageSchema } from '@/lib/utils/schema';

import { type CoupletsPageProps } from './_utils/shared';

export { metadata } from './_config';

/**
 * All couplets archive page — paginated listing of published couplets.
 *
 * @param {CoupletsPageProps} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The archive page.
 */
export default async function CoupletsPage({ searchParams }: CoupletsPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({ page: 1, perPage, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(PAGE_CONFIG, { posts, pagination, page: 1, perPage });

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
