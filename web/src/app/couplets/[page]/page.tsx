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
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
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
      keywords: [...BASE_KEYWORDS, 'all couplets', 'Kabir dohe collection', 'paginated'].join(', '),
    }
  ),
];

/**
 * Props for the paginated couplets archive page.
 *
 * @type {CoupletsPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters for sorting.
 */
interface CoupletsPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated archive page — handles `/couplets/2`, `/couplets/3`, etc.
 * Redirects to `/couplets` when page is 1 or invalid.
 *
 * @param {CoupletsPageProps} props - Component props.
 * @param {Promise<{ page: string }>} props.params - Route parameters containing the page number.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters for sorting.
 *
 * @returns {Promise<JSX.Element>} The paginated couplets archive page.
 */
export default async function CoupletsPage({ params, searchParams }: CoupletsPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/couplets', sp);
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({
    page,
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
