import type { JSX } from 'react';

import { RiSearch2Line } from 'react-icons/ri';

import { ArchiveContent } from '@/app/couplets/_components/ArchiveContent';
import { getCouplets } from '@/lib/server/couplets';
import { handlePageRedirect } from '@/lib/server/page-utils';
import type { SortBy, SortOrder } from '@/types';

import { PAGE_SCHEMA } from './_config';

export { metadata } from './_config';

/**
 * Props for the search archive page.
 *
 * @type {SearchPageProps}
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - URL search parameters including search query and filters.
 */
interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Search page — displays full-text search results with a search form.
 *
 * @param {SearchPageProps} props - Component props.
 * @param {Promise<Record<string, string | string[] | undefined>>} props.searchParams - URL search parameters.
 *
 * @returns {Promise<JSX.Element>} The search results page.
 */
export default async function SearchPage({ searchParams }: SearchPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  handlePageRedirect(params, '/search');

  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const sortBy: SortBy = typeof params.sort_by === 'string' ? (params.sort_by as SortBy) : 'number';
  const sortOrder: SortOrder = typeof params.sort_order === 'string' ? (params.sort_order as SortOrder) : 'asc';
  const perPage = 10;

  const { posts, pagination } = await getCouplets({ page: 1, perPage, searchQuery: query, sortBy, sortOrder });

  const title = query ? `Search results for "${query}"` : 'Search';

  return (
    <ArchiveContent
      pageSchema={PAGE_SCHEMA}
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
