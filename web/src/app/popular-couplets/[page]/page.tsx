import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { POPULAR_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: POPULAR_CONFIG.seoTitle,
  description: POPULAR_CONFIG.seoDescription,
  path: POPULAR_CONFIG.seoPath,
});

interface PopularCoupletsPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated popular couplets page — handles `/popular-couplets/2`, etc.
 *
 * @param {PopularCoupletsPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The paginated popular couplets page.
 */
export default async function PopularCoupletsPage({
  params,
  searchParams,
}: PopularCoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/popular-couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({ page, perPage, ...POPULAR_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(POPULAR_CONFIG, {
    posts,
    pagination,
    page,
    perPage,
    extraKeywords: ['paginated'],
  });

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
