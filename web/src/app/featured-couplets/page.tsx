import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { buildArchivePageSchema, FEATURED_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: FEATURED_CONFIG.seoTitle,
  description: FEATURED_CONFIG.seoDescription,
  path: FEATURED_CONFIG.seoPath,
});

interface FeaturedCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FeaturedCoupletsPage({
  searchParams,
}: FeaturedCoupletsPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/featured-couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    ...FEATURED_CONFIG.filter,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

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
