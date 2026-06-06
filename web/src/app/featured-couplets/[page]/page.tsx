import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';

/**
 * Props for the paginated featured couplets page.
 *
 * @type {FeaturedCoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface FeaturedCoupletsPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated featured couplets page — handles `/featured-couplets/2`, etc.
 * Redirects to `/featured-couplets` when page is 1 or invalid.
 *
 * @param {FeaturedCoupletsPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting.
 *
 * @returns {Promise<JSX.Element>} The paginated featured couplets listing page.
 */
export default async function FeaturedCoupletsPage({
  params,
  searchParams,
}: FeaturedCoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/featured-couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

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
          showSidebar
          sidebar={<ArchiveSidebar />}
        />
      </Container>
    </PageLayout>
  );
}
