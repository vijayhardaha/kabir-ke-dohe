import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { buildArchivePageSchema, POPULAR_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';

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

export default async function PopularCoupletsPage({
  params,
  searchParams,
}: PopularCoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/popular-couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    ...POPULAR_CONFIG.filter,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  const pageSchema = buildArchivePageSchema(POPULAR_CONFIG, { posts, pagination, page, perPage, extraKeywords: ['paginated'] });

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
