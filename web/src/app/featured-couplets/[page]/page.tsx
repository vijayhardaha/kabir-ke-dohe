import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { FEATURED_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: FEATURED_CONFIG.seoTitle,
  description: FEATURED_CONFIG.seoDescription,
  path: FEATURED_CONFIG.seoPath,
});

/**
 * Props for the paginated featured couplets page.
 *
 * @type {FeaturedCoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting and pagination.
 */
interface FeaturedCoupletsPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated featured couplets page — handles `/featured-couplets/2`, etc.
 *
 * @param {FeaturedCoupletsPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The paginated featured couplets page.
 */
export default async function FeaturedCoupletsPage({
  params,
  searchParams,
}: FeaturedCoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/featured-couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({ page, perPage, ...FEATURED_CONFIG.filter, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(FEATURED_CONFIG, {
    posts,
    pagination,
    page,
    perPage,
    extraKeywords: ['paginated'],
  });

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
