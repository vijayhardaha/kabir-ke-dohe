import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { FEATURED_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: FEATURED_CONFIG.seoTitle,
  description: FEATURED_CONFIG.seoDescription,
  path: FEATURED_CONFIG.seoPath,
});

/**
 * Props for the featured couplets archive page.
 *
 * @type {FeaturedCoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
interface FeaturedCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

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

  const { posts, pagination } = await getCouplets({ page: 1, perPage, ...FEATURED_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(FEATURED_CONFIG, { posts, pagination, page: 1, perPage });

  return (
    <ArchivePageLayout
      pageSchema={pageSchema}
      pageTitle={FEATURED_CONFIG.pageTitle}
      pageDescription={FEATURED_CONFIG.pageDescription}
      posts={posts}
      pagination={pagination}
      baseUrl="/featured-couplets"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
