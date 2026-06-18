import type { ReactNode } from 'react';

import type { PaginationMeta, Post, SortBy, SortOrder } from '@/types';

/**
 * A single sort option in the dropdown.
 *
 * @type {SortOption}
 * @property {string} value - Composite value combining sortBy and sortOrder (e.g. "number_asc")
 * @property {string} label - Human-readable label shown in the dropdown
 */
export interface SortOption {
  value: string;
  label: string;
}

/**
 * Props for the ArchiveListing component.
 *
 * @type {ArchiveListingProps}
 * @property {Post[]} posts - The list of posts to display
 * @property {PaginationMeta} pagination - Pagination metadata
 * @property {string} baseUrl - Base URL for pagination and sort links
 * @property {string} [emptyMessage] - Message shown when no posts are found
 * @property {SortBy} [currentSortBy] - Current sort-by field value
 * @property {SortOrder} [currentSortOrder] - Current sort order value
 * @property {boolean} [hideSort] - When true, hides the sort dropdown
 * @property {boolean} [showQuotes=true] - When true, injects spiritual quote messages between posts
 * @property {boolean} [showSidebar] - When true, renders alongside a sidebar with widgets (md+)
 * @property {ReactNode} [sidebar] - Sidebar content to render alongside the listing
 */
export interface ArchiveListingProps {
  posts: Post[];
  pagination: PaginationMeta;
  baseUrl: string;
  emptyMessage?: string;
  currentSortBy?: SortBy;
  currentSortOrder?: SortOrder;
  hideSort?: boolean;
  showQuotes?: boolean;
  showSidebar?: boolean;
  sidebar?: ReactNode;
}
