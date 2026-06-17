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

const seoTitle = 'Featured Couplets';
const seoDescription =
  "A handpicked collection of Kabir's most profound and impactful dohas — spiritual wisdom and life lessons in Hindi and English.";
const seoPath = 'featured-couplets';

export const metadata: Metadata = buildMetadata({ title: seoTitle, description: seoDescription, path: seoPath });

const rootUrl = siteUrl();
const pageSchema = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl, path: seoPath },
    {
      name: `${seoTitle} — Kabir Ke Dohe`,
      description: seoDescription,
      keywords: [...BASE_KEYWORDS, 'featured couplets', 'handpicked dohas', 'best Kabir dohe'].join(', '),
    }
  ),
];

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
  const { sortBy, sortOrder, perPage } = parseSortParams(params);

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    isFeatured: true,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return (
    <>
      <JsonLd data={pageSchema} />
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
    </>
  );
}
