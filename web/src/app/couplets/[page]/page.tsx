import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { COUPLETS_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildArchivePageSchema } from '@/lib/utils/schema';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: COUPLETS_CONFIG.seoTitle,
  description: COUPLETS_CONFIG.seoDescription,
  path: COUPLETS_CONFIG.seoPath,
});

interface CoupletsPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated couplets archive page — handles `/couplets/2`, `/couplets/3`, etc.
 *
 * @param {CoupletsPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The paginated archive page.
 */
export default async function CoupletsPage({ params, searchParams }: CoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({ page, perPage, sortBy, sortOrder });

  const pageSchema = buildArchivePageSchema(COUPLETS_CONFIG, {
    posts,
    pagination,
    page,
    perPage,
    extraKeywords: ['paginated'],
  });

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
