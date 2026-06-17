import type { JSX } from 'react';

import type { Metadata } from 'next';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { buildArchivePageSchema, COUPLETS_CONFIG } from '@/app/couplets/_utils/archive';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';

/** SEO metadata for the page. */
export const metadata: Metadata = buildMetadata({
  title: COUPLETS_CONFIG.seoTitle,
  description: COUPLETS_CONFIG.seoDescription,
  path: COUPLETS_CONFIG.seoPath,
});

interface ArchivePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

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
