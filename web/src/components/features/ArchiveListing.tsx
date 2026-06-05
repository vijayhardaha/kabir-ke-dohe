'use client';

import { useCallback, type JSX } from 'react';

import { Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Combobox } from '@/components/ui/Combobox';
import { Pagination } from '@/components/ui/Pagination';
import { formatDoha } from '@/lib/utils/doha';
import type { Post, PaginationMeta } from '@/types';

// ---------------------------------------------------------------------------
// Sort configuration
// ---------------------------------------------------------------------------

/**
 * A single sort option in the dropdown.
 *
 * @type {SortOption}
 * @property {string} value - Composite value combining sortBy and sortOrder (e.g. "number_asc")
 * @property {string} label - Human‑readable label shown in the dropdown
 */
interface SortOption {
  value: string;
  label: string;
}

/**
 * Available sort combinations for the archive listing.
 */
const SORT_OPTIONS: SortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'popular', label: 'Popular' },
  { value: 'couplet_asc', label: 'Couplet (अ - ज्ञ)' },
  { value: 'couplet_desc', label: 'Couplet (ज्ञ - अ)' },
];

/**
 * Maps URL sort params to the corresponding dropdown option value.
 *
 * @param {string} sortBy - Current sort_by query param.
 * @param {string} sortOrder - Current sort_order query param.
 * @param {string} isPopular - Whether is_popular=true is in the URL.
 *
 * @returns {string} The matching dropdown option value.
 */
function getSortValue(sortBy: string, sortOrder: string, isPopular: string | null): string {
  if (isPopular === 'true') return 'popular';
  if (sortBy === 'text_hi' && sortOrder === 'asc') return 'couplet_asc';
  if (sortBy === 'text_hi' && sortOrder === 'desc') return 'couplet_desc';
  return 'default';
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * Props for the ArchiveListing component.
 *
 * @type {ArchiveListingProps}
 * @property {Post[]} posts - The list of posts to display
 * @property {PaginationMeta} pagination - Pagination metadata
 * @property {string} baseUrl - Base URL for pagination and sort links
 * @property {string} [emptyMessage] - Message shown when no posts are found
 * @property {string} [currentSortBy] - Current sort‑by field value
 * @property {string} [currentSortOrder] - Current sort order value
 * @property {boolean} [hideSort] - When true, hides the sort dropdown
 */
interface ArchiveListingProps {
  posts: Post[];
  pagination: PaginationMeta;
  baseUrl: string;
  emptyMessage?: string;
  currentSortBy?: string;
  currentSortOrder?: string;
  hideSort?: boolean;
}

// ---------------------------------------------------------------------------
// Toolbar components
// ---------------------------------------------------------------------------

/**
 * Displays the current result range and total count (e.g. "Showing 1–10 of 2295 results").
 *
 * @param {{ pagination: PaginationMeta }} props - Component props.
 * @param {PaginationMeta} props.pagination - Pagination metadata with page, perPage, and total.
 *
 * @returns {JSX.Element} A paragraph displaying the result range.
 */
function ResultCount({ pagination }: { pagination: PaginationMeta }): JSX.Element {
  const start = (pagination.page - 1) * pagination.perPage + 1;
  const end = Math.min(pagination.page * pagination.perPage, pagination.total);

  return (
    <p className="text-foreground mb-0 text-sm font-semibold">
      {start === end
        ? `Showing ${start} of ${pagination.total} result`
        : `Showing ${start}–${end} of ${pagination.total} results`}
    </p>
  );
}

/**
 * Sort dropdown that lets users change the ordering of the archive listing.
 *
 * @param {{ value: string; onChange: (value: string) => void }} props - Component props.
 * @param {string} props.value - Currently selected sort option value.
 * @param {(value: string) => void} props.onChange - Callback fired when a new sort option is selected.
 *
 * @returns {JSX.Element} A Combobox with sort options.
 */
function SortDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }): JSX.Element {
  return <Combobox label="Sort by" options={SORT_OPTIONS} value={value} onChange={onChange} className="w-46" />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Reusable archive listing component following the WordPress loop pattern.
 * Renders a sort dropdown, post cards, and pagination.
 * When no posts match, displays a "content‑none" empty state.
 *
 * @param {ArchiveListingProps} props - Component props
 *
 * @returns {JSX.Element} Archive listing component with sort dropdown and pagination.
 */
export function ArchiveListing({
  posts,
  pagination,
  baseUrl,
  emptyMessage = 'No couplets found.',
  currentSortBy = 'number',
  currentSortOrder = 'asc',
  hideSort = false,
}: ArchiveListingProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortValue = getSortValue(currentSortBy, currentSortOrder, searchParams.get('is_popular'));

  /**
   * Handles sort dropdown changes by updating URL params and resetting to page 1.
   */
  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page'); // Reset to page 1 on sort change

      switch (value) {
        case 'popular':
          params.set('is_popular', 'true');
          params.delete('sort_by');
          params.delete('sort_order');
          break;
        case 'couplet_asc':
          params.set('sort_by', 'text_hi');
          params.set('sort_order', 'asc');
          params.delete('is_popular');
          break;
        case 'couplet_desc':
          params.set('sort_by', 'text_hi');
          params.set('sort_order', 'desc');
          params.delete('is_popular');
          break;
        case 'default':
        default:
          params.delete('sort_by');
          params.delete('sort_order');
          params.delete('is_popular');
          break;
      }
      router.push(`${baseUrl}?${params.toString()}`);
    },
    [router, searchParams, baseUrl]
  );

  return (
    <div>
      {/* Toolbar: sort + result count */}
      {!hideSort && posts.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <ResultCount pagination={pagination} />
          <SortDropdown value={currentSortValue} onChange={handleSortChange} />
        </div>
      )}

      {/* Post listing / empty state (WordPress loop pattern) */}
      {posts.length === 0 ? (
        <ContentNone message={emptyMessage} />
      ) : (
        <>
          <div className="divide-muted divide-y-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              baseUrl={baseUrl}
              searchParams={Object.fromEntries(searchParams.entries())}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Single post card used within the archive loop — one card per row.
 *
 * @param {{ post: Post }} props - Component props
 * @param {Post} props.post - The post to display
 *
 * @returns {JSX.Element} Post card component
 */
function PostCard({ post }: { post: Post }): JSX.Element {
  /**
   * Shares the couplet URL using the Web Share API or clipboard fallback.
   */
  async function handleShare() {
    const url = `${window.location.origin}/couplet/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Kabir Doha', text: post.text_hi, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User dismissed share dialog or clipboard write failed — no action needed
    }
  }

  return (
    <article className="bg-card flex flex-col gap-4 p-6 md:p-8">
      {/* ---- Doha heading ---- */}
      <h2 className="text-foreground text-3xl leading-snug tracking-normal whitespace-pre-line lg:text-4xl">
        <Link href={`/couplet/${post.slug}`} className="text-secondary hover:text-primary hover:underline">
          {formatDoha(post.text_hi)}
        </Link>
      </h2>

      {/* ---- Meta: author + tags ---- */}
      <div className="text-foreground flex flex-wrap items-center gap-y-1 text-base font-medium">
        <span>
          By{' '}
          <a
            href="https://en.wikipedia.org/wiki/Kabir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Sant Kabir Das
          </a>
        </span>
        {post.tags.length > 0 && (
          <>
            <span aria-hidden="true" className="mx-2 text-xs">
              |
            </span>{' '}
            <span className="flex flex-wrap items-center">
              {post.tags.map((tag, idx) => (
                <span key={tag.slug} className="mr-1 last:mr-0">
                  <Link href={`/tag/${tag.slug}`} className="text-foreground hover:text-primary underline">
                    {tag.name}
                  </Link>
                  {idx < post.tags.length - 1 && <span>, </span>}
                </span>
              ))}
            </span>
          </>
        )}
      </div>

      {/* ---- Meanings ---- */}
      {(post.meaning_hi || post.meaning_en) && (
        <div className="bg-muted flex flex-col p-4">
          {post.meaning_hi && (
            <p className="text-foreground leading-relaxed">
              <strong className="text-foreground font-bold">अर्थ:</strong> {post.meaning_hi}
            </p>
          )}
          {post.meaning_en && (
            <p className="text-foreground leading-relaxed">
              <strong className="text-foreground font-bold">Meaning:</strong> {post.meaning_en}
            </p>
          )}
        </div>
      )}

      {/* ---- Actions ---- */}
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href={`/couplet/${post.slug}`} variant="primary" size="md">
          Read More
        </ButtonLink>
        <Button variant="outline-primary" size="md" onClick={handleShare}>
          <Share2 size={16} aria-label="Share" />
          Share
        </Button>
      </div>
    </article>
  );
}

/**
 * WordPress "content‑none" template — shown when no posts match the query.
 * Displays an icon, a message, and a suggestion to adjust filters.
 *
 * @param {{ message: string }} props - Component props
 * @param {string} props.message - Message to display instead of the default
 *
 * @returns {JSX.Element} Empty state component
 */
function ContentNone({ message }: { message: string }): JSX.Element {
  return (
    <div className="flex flex-col items-center border border-dashed py-20 text-center">
      <svg
        className="text-muted-foreground mb-4 size-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <p className="text-muted-foreground text-lg font-medium">{message}</p>
      <p className="text-muted-foreground mt-1 text-sm">Try adjusting your filters or browse the full archive.</p>
    </div>
  );
}
