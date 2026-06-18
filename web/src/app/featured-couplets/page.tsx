import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { PAGE_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: PAGE_CONFIG.seoTitle,
  description: PAGE_CONFIG.seoDescription,
  path: PAGE_CONFIG.seoPath,
});

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

  const { posts, pagination } = await getCouplets({ page: 1, perPage, ...PAGE_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(PAGE_CONFIG, { posts, pagination, page: 1, perPage });

  return (
    <ArchivePageLayout
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
