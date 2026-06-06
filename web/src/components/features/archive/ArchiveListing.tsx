'use client';

import { useCallback, type JSX } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/components/ui/Pagination';

import { ContentNone } from './ContentNone';
import { InjectedMessage } from './InjectedMessage';
import { KABIR_MESSAGES } from './kabirMessages';
import { PostCard } from './PostCard';
import { ResultCount } from './ResultCount';
import { getSortValue } from './SortControls';
import { SortDropdown } from './SortDropdown';
import type { ArchiveListingProps } from './types';

/**
 * Reusable archive listing component following the WordPress loop pattern.
 * Renders a sort dropdown, post cards, and pagination.
 * When no posts match, displays a "content‑none" empty state.
 * Optionally renders a sidebar with widgets when `showSidebar` is true.
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
  showSidebar = false,
  sidebar,
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

  const listingContent = (
    <div>
      {/* Toolbar: sort + result count */}
      {!hideSort && posts.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <ResultCount pagination={pagination} />
          <SortDropdown value={currentSortValue} onChangeAction={handleSortChange} />
        </div>
      )}

      {/* Post listing / empty state (WordPress loop pattern) */}
      {posts.length === 0 ? (
        <ContentNone message={emptyMessage} />
      ) : (
        <>
          <div className="divide-muted divide-y-2">
            {posts.flatMap((post, index) => {
              const elements = [<PostCard key={post.id} post={post} />];

              // Inject a spiritual message after every 2 posts (at indices 1, 3, 5, 7)
              // Only inject up to 4 messages and skip if no more posts remain
              if ((index + 1) % 2 === 0) {
                const messageIndex = Math.floor((index + 1) / 2) - 1;
                if (messageIndex < KABIR_MESSAGES.length && index + 1 < posts.length) {
                  elements.push(
                    <InjectedMessage
                      key={`msg-${messageIndex}`}
                      message={KABIR_MESSAGES[messageIndex]}
                      colorIndex={messageIndex % 3}
                    />
                  );
                }
              }

              return elements;
            })}
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

  // Wrap in grid when sidebar is enabled
  if (showSidebar && sidebar) {
    return (
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9">{listingContent}</div>
        <aside className="sticky top-10 hidden lg:col-span-4 lg:block xl:col-span-3">{sidebar}</aside>
      </div>
    );
  }

  return listingContent;
}
