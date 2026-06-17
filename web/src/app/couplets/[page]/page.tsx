import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { buildArchivePageSchema, COUPLETS_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';

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

export default async function CoupletsPage({ params, searchParams }: CoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  const pageSchema = buildArchivePageSchema(COUPLETS_CONFIG, { posts, pagination, page, perPage, extraKeywords: ['paginated'] });

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
