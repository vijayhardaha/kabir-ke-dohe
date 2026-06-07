import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import { JsonLd } from '@vijayhardaha/schema-builder/react';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

import { ArchiveListing } from '@/components/features/ArchiveListing';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { globalSchema, BASE_KEYWORDS } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

const rootUrl = siteUrl();
const searchSchema = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl, path: 'search' },
    {
      name: 'Search — Kabir Ke Dohe',
      keywords: [...BASE_KEYWORDS, 'search couplets', 'find dohas', 'Kabir search'].join(', '),
    }
  ),
];

/**
 * Prevent search engines from indexing the search results page
 * since it contains dynamic, user-generated query content.
 */
export const metadata: Metadata = {
  ...buildMetadata({ title: 'Search', description: 'Find couplets by keyword, theme, or meaning.', path: 'search' }),
  robots: { index: false, follow: false },
};

/**
 * Props for the search page.
 *
 * @type {SearchPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters including `q` for search query.
 */

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Search page that displays couplets matching the search query.
 * Uses ArchiveListing without the widgets sidebar.
 *
 * @param {SearchPageProps} props - Component props.
 *
 * @returns {Promise<JSX.Element>} The search results page.
 */
export default async function SearchPage({ searchParams }: SearchPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/search');

  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'number';
  const sortOrder = typeof params.sort_order === 'string' ? params.sort_order : 'asc';
  const perPage = 10;

  // For now, just show all couplets (search via URL params handled client-side)
  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    searchQuery: query,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  const title = query ? `Search results for "${query}"` : 'Search';

  return (
    <>
      <JsonLd data={searchSchema} />
      <PageLayout>
        <Container>
          <PageHeader title={title} description="Find couplets by keyword, theme, or meaning" />

          {/* Search form before listing */}
          <div className="mb-8">
            <SearchForm initialQuery={query} />
          </div>

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

/**
 * Client-side search form component that redirects to /search?q={query}.
 *
 * @param {{ initialQuery: string }} props - Component props.
 *
 * @returns {JSX.Element} Search form component.
 */
function SearchForm({ initialQuery }: { initialQuery: string }): JSX.Element {
  return (
    <form action="/search" method="GET" className="flex" role="search">
      <div className="flex w-full max-w-lg">
        <input
          type="search"
          id="search-page-q"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search couplets…"
          className="text-foreground bg-card border-input focus:border-primary flex h-12 w-full border border-r-0 px-4 text-base transition-colors duration-200 outline-none"
          aria-label="Search couplets"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200"
          aria-label="Submit search"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}
