import type { JSX } from 'react';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildArchivePageSchema } from '@/lib/utils/schema';

import { PAGE_CONFIG } from './_config';
import { type FeaturedCoupletsPageProps } from './_utils/shared';

export { metadata } from './_config';

/**
 * Featured couplets archive page — paginated listing filtered by featured status.
 *
 * @param {FeaturedCoupletsPageProps} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The featured couplets page.
 */
export default async function FeaturedCoupletsPage({ searchParams }: FeaturedCoupletsPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/featured-couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({ page: 1, perPage, ...PAGE_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(PAGE_CONFIG, { posts, pagination, page: 1, perPage });

  return (
    <ArchiveContent
      pageSchema={pageSchema}
      pageTitle={PAGE_CONFIG.pageTitle}
      pageDescription={PAGE_CONFIG.pageDescription}
      posts={posts}
      pagination={pagination}
      baseUrl="/featured-couplets"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
