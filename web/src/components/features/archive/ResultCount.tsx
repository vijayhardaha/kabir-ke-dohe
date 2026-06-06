import type { JSX } from 'react';

import type { PaginationMeta } from '@/types';

/**
 * Displays the current result range and total count (e.g. "Showing 1–10 of 2295 results").
 *
 * @param {{ pagination: PaginationMeta }} props - Component props.
 * @param {PaginationMeta} props.pagination - Pagination metadata with page, perPage, and total.
 *
 * @returns {JSX.Element} A paragraph displaying the result range.
 */
export function ResultCount({ pagination }: { pagination: PaginationMeta }): JSX.Element {
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
