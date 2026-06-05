import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';

interface FeaturedCoupletsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Featured couplets page that displays a paginated list of featured dohas.
 *
 * @param {FeaturedCoupletsPageProps} props - Component props
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for pagination and sorting.
 *
 * @returns {Promise<JSX.Element>} The featured couplets listing page.
 */
export default async function FeaturedCoupletsPage({ searchParams }: FeaturedCoupletsPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'number';
  const sortOrder = typeof params.sort_order === 'string' ? params.sort_order : 'asc';
  const perPage = 10;

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    isFeatured: true,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl="/featured-couplets"
          title="Featured Couplets"
          description="A handpicked selection of Kabir&rsquo;s most profound dohas"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
