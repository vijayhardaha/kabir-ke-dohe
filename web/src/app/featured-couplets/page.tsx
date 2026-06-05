import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect } from '@/lib/server/page-utils';

/**
 * Props for the featured couplets page.
 *
 * @type {FeaturedCoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
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
  handlePageRedirect(params, '/featured-couplets');
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'number';
  const sortOrder = typeof params.sort_order === 'string' ? params.sort_order : 'asc';
  const perPage = 10;

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    isFeatured: true,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="चुनिंदा दोहे (Featured Couplets)"
          description="कबीर के सबसे गहन और प्रभावशाली दोहों का विशेष संग्रह — आध्यात्मिक ज्ञान और जीवन की सीख, हिंदी और अंग्रेज़ी में (A handpicked collection of Kabir's most profound and impactful dohas — spiritual wisdom and life lessons in Hindi and English)"
        />
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl="/featured-couplets"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
