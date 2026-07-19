import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { POPULAR_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: POPULAR_CONFIG.seoTitle,
  description: POPULAR_CONFIG.seoDescription,
  path: POPULAR_CONFIG.seoPath,
});

/**
 * Props for the popular couplets archive page.
 *
 * @type {PopularCoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
interface PopularCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Popular couplets archive page — paginated listing filtered by popularity.
 *
 * @param {PopularCoupletsPageProps} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The popular couplets page.
 */
export default async function PopularCoupletsPage({ searchParams }: PopularCoupletsPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/popular-couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({ page: 1, perPage, ...POPULAR_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(POPULAR_CONFIG, { posts, pagination, page: 1, perPage });

  return (
    <ArchivePageLayout
      pageSchema={pageSchema}
      pageTitle={POPULAR_CONFIG.pageTitle}
      pageDescription={POPULAR_CONFIG.pageDescription}
      posts={posts}
      pagination={pagination}
      baseUrl="/popular-couplets"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
