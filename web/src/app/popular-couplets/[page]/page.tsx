import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { validatePageParam } from '@/lib/server/page-utils';

/**
 * Props for the paginated popular couplets page.
 *
 * @type {PopularCoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface PopularCoupletsPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated popular couplets page — handles `/popular-couplets/2`, etc.
 * Redirects to `/popular-couplets` when page is 1 or invalid.
 *
 * @param {PopularCoupletsPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting.
 *
 * @returns {Promise<JSX.Element>} The paginated popular couplets listing page.
 */
export default async function PopularCoupletsPage({
  params,
  searchParams,
}: PopularCoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/popular-couplets', sp);
  const sortBy = typeof sp.sort_by === 'string' ? sp.sort_by : 'number';
  const sortOrder = typeof sp.sort_order === 'string' ? sp.sort_order : 'asc';
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
        />
      </Container>
    </PageLayout>
  );
}
