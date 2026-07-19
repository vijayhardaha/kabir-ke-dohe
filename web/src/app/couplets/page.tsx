import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { COUPLETS_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: COUPLETS_CONFIG.seoTitle,
  description: COUPLETS_CONFIG.seoDescription,
  path: COUPLETS_CONFIG.seoPath,
});

/**
 * Props for the all couplets archive page.
 *
 * @type {ArchivePageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
interface ArchivePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * All couplets archive page — paginated listing of published couplets.
 *
 * @param {ArchivePageProps} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The archive page.
 */
export default async function ArchivePage({ searchParams }: ArchivePageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({ page: 1, perPage, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(COUPLETS_CONFIG, { posts, pagination, page: 1, perPage });

  return (
    <ArchivePageLayout
      pageSchema={pageSchema}
      pageTitle={COUPLETS_CONFIG.pageTitle}
      pageDescription={COUPLETS_CONFIG.pageDescription}
      posts={posts}
      pagination={pagination}
      baseUrl="/couplets"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
    />
  );
}
