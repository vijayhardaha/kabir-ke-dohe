import type { JSX } from 'react';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect } from '@/lib/server/page-utils';

/**
 * Props for the couplets archive page.
 *
 * @type {ArchivePageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for pagination and sorting.
 */
interface ArchivePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Archive page that displays a paginated, sortable list of all couplets.
 *
 * @param {ArchivePageProps} props - Component props
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for pagination and sorting.
 *
 * @returns {Promise<JSX.Element>} The archive/couplets listing page.
 */
export default async function ArchivePage({ searchParams }: ArchivePageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/couplets');
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'number';
  const sortOrder = typeof params.sort_order === 'string' ? params.sort_order : 'asc';
  const perPage = 10;

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="कबीर के दोहे (Kabir's Couplets)"
          description="कबीर के दोहों का संपूर्ण संग्रह — आध्यात्मिक ज्ञान, जीवन के सच और प्रेरणा से भरे Kabir ke dohe, हिंदी और अंग्रेज़ी अर्थ के साथ (Explore the complete collection of Sant Kabir Das's dohas — spiritual wisdom, life truths, and inspiration with Hindi and English meanings)"
        />
        <ArchiveListing
          posts={posts}
          pagination={pagination}
          baseUrl="/couplets"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </Container>
    </PageLayout>
  );
}
