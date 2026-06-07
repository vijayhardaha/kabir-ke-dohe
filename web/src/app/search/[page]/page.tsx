import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import type { Metadata } from 'next';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { parseSortParams, validatePageParam } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema, BASE_KEYWORDS } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

const rootUrl = siteUrl();
const searchPaginatedSchema = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl, path: 'search' },
    {
      name: 'Search — Kabir Ke Dohe',
      keywords: [...BASE_KEYWORDS, 'search couplets', 'find dohas', 'paginated'].join(', '),
    }
  ),
];

/**
 * Prevent search engines from indexing paginated search pages.
 */
export const metadata: Metadata = {
  ...buildMetadata({ title: 'Search', description: 'Find couplets by keyword, theme, or meaning.', path: 'search' }),
  robots: { index: false, follow: false },
};

/**
 * Props for the paginated search page.
 *
 * @type {SearchPageProps}
 * @property {Promise<{ page: string }>} params - Route parameters containing the page number.
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters including `q` for search query.
 */
interface SearchPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paginated search results page — handles `/search/2`, `/search/3`, etc.
 * Redirects to `/search` when page is 1 or invalid.
 *
 * @param {SearchPageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The paginated search results page.
 */
export default async function SearchPage({ params, searchParams }: SearchPageProps): Promise<JSX.Element> {
  const { page: pageStr } = await params;
  const sp = await searchParams;
  const page = validatePageParam(pageStr, '/search', sp);

  const query = typeof sp.q === 'string' ? sp.q.trim() : '';
  const { sortBy, sortOrder, perPage } = parseSortParams(sp);

  const { posts, pagination } = await getCouplets({
    page,
    perPage,
    searchQuery: query,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  const title = query ? `Search results for "${query}" — Page ${page}` : `Search — Page ${page}`;

  return (
    <>
      <JsonLd data={searchPaginatedSchema} />
      <PageLayout>
        <Container>
          <PageHeader title={title} description="Find couplets by keyword, theme, or meaning" />

          <ArchiveListing
            posts={posts}
            pagination={pagination}
            baseUrl="/search"
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            hideSort={false}
          />
        </Container>
      </PageLayout>
    </>
  );
}
