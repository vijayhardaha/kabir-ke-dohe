import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import type { Metadata } from 'next';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArchiveSidebar } from '@/components/widgets/ArchiveSidebar';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect, parseSortParams } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema, BASE_KEYWORDS } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

const seoTitle = "Kabir's Couplets";
const seoDescription =
  "Explore the complete collection of Sant Kabir Das's dohas — spiritual wisdom, life truths, and inspiration with Hindi and English meanings.";
const seoPath = 'couplets';

export const metadata: Metadata = buildMetadata({ title: seoTitle, description: seoDescription, path: seoPath });

const rootUrl = siteUrl();
const pageSchema = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl, path: seoPath },
    {
      name: `${seoTitle} — Kabir Ke Dohe`,
      description: seoDescription,
      keywords: [...BASE_KEYWORDS, 'all couplets', 'Kabir dohe collection', 'complete dohas'].join(', '),
    }
  ),
];

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
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <>
      <JsonLd data={pageSchema} />
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
            showSidebar
            sidebar={<ArchiveSidebar />}
          />
        </Container>
      </PageLayout>
    </>
  );
}
