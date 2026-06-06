import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';

/**
 * Props for the popular couplets page.
 *
 * @type {PopularCoupletsPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
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
  handlePageRedirect(params, '/popular-couplets');
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    isPopular: true,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="लोकप्रिय दोहे (Popular Couplets)"
          description="सबसे अधिक पसंद किए जाने वाले कबीर के दोहे — जिन्होंने लाखों दिलों को छुआ है, हिंदी और अंग्रेज़ी अर्थ के साथ (The most loved and cherished dohas of Sant Kabir that have touched millions of hearts, with Hindi and English meanings)"
        />
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl="/popular-couplets"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          showSidebar
          sidebar={<ArchiveSidebar />}
        />
      </Container>
    </PageLayout>
  );
}
