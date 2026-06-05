import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';

interface PopularCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Popular couplets page that displays a paginated list of the most loved dohas.
 *
 * @param {PopularCoupletsPageProps} props - Component props
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for pagination and sorting.
 *
 * @returns {Promise<JSX.Element>} The popular couplets listing page.
 */
export default async function PopularCoupletsPage({ searchParams }: PopularCoupletsPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'number';
  const sortOrder = typeof params.sort_order === 'string' ? params.sort_order : 'asc';
  const perPage = 10;

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    isPopular: true,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl="/popular-couplets"
          title="Popular Couplets"
          description="The most loved dohas of Sant Kabir"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
