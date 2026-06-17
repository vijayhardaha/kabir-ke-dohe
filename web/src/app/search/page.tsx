import type { JSX } from 'react';

import { webPageSchema } from '@vijayhardaha/schema-builder';
import type { Metadata } from 'next';
import { RiSearch2Line } from 'react-icons/ri';

import { ArchivePageLayout } from '@/app/couplets/_components/ArchivePageLayout';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect } from '@/lib/server/page-utils';
import { buildMetadata } from '@/lib/utils/meta';
import { buildKeywords, globalSchema } from '@/lib/utils/schema';
import { siteUrl } from '@/lib/utils/seo';

// ── SEO ───────────────────────────────────────────────────────────────────

const seoPath = 'search';
const seoKeywords = ['search couplets', 'find dohas', 'Kabir search'];

const rootUrl = siteUrl();
const searchSchema = [
  ...globalSchema(),
  webPageSchema(
    { rootUrl, path: seoPath },
    {
      name: 'Search — Kabir Ke Dohe',
      keywords: buildKeywords(seoKeywords),
    }
  ),
];

/** SEO metadata for the page. */
export const metadata: Metadata = {
  ...buildMetadata({ title: 'Search', description: 'Find couplets by keyword, theme, or meaning.', path: seoPath }),
  robots: { index: false, follow: false },
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/search');

  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'number';
  const sortOrder = typeof params.sort_order === 'string' ? params.sort_order : 'asc';
  const perPage = 10;

  const { posts, pagination } = await getCouplets({
    page: 1,
    perPage,
    searchQuery: query,
    sortBy: sortBy as 'number' | 'text_en' | 'text_hi',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  const title = query ? `Search results for "${query}"` : 'Search';

  return (
    <ArchivePageLayout
      pageSchema={searchSchema}
      pageTitle={title}
      pageDescription="Find couplets by keyword, theme, or meaning"
      posts={posts}
      pagination={pagination}
      baseUrl="/search"
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
      showSidebar={false}
      searchForm={<SearchForm initialQuery={query} />}
    />
  );
}

// ── Search form component ─────────────────────────────────────────────────

/**
 * Search form with input and submit button.
 * Submits to `/search?q={query}` via native form action.
 *
 * @param {{ initialQuery: string }} props - Component props.
 * @param {string} props.initialQuery - Pre-filled search query from the URL.
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
          <RiSearch2Line size={20} />
        </button>
      </div>
    </form>
  );
}
