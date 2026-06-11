import { type JSX } from 'react';

import Link from 'next/link';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import { cn } from '@/lib/utils/cn';

/**
 * Props for the Pagination component.
 *
 * @type {PaginationProps}
 * @property {number} page - Current active page number (1‑based)
 * @property {number} totalPages - Total number of pages
 * @property {string} baseUrl - Base URL path used to build page links
 * @property {Record<string, string>} [searchParams] - Additional query parameters to preserve in page links
 */
interface PaginationProps {
  page: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

/**
 * Pagination component displaying numbered page buttons with ellipsis
 * and previous/next navigation.
 *
 * @param {PaginationProps} props - Component props
 *
 * @returns {JSX.Element | null} The pagination UI, or null when totalPages is 1 or less.
 */
export function Pagination({ page, totalPages, baseUrl, searchParams = {} }: PaginationProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  /**
   * Builds a paginated URL for a given page number, preserving existing search params.
   *
   * @param {number} pageNum - Target page number.
   *
   * @returns {string} Fully qualified URL with query parameters.
   */
  const buildUrl = (pageNum: number): string => {
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    const path = pageNum === 1 ? baseUrl : `${baseUrl}/${pageNum}`;
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  /**
   * Generates the array of page numbers and ellipsis markers for rendering.
   * Shows compact layout for small page counts and ellipsis for large ones.
   *
   * @returns {(number | 'ellipsis')[]} Ordered page numbers and ellipsis indicators.
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Collect all page numbers that must be shown — duplicates are deduped by the Set
    const visible = new Set<number>();

    // Always show page 1
    visible.add(1);

    // Window around current page: page-1, page, page+1
    const windowStart = Math.max(2, page - 1);
    const windowEnd = Math.min(totalPages - 1, page + 1);
    for (let i = windowStart; i <= windowEnd; i++) {
      visible.add(i);
    }

    // Always show page 2
    visible.add(2);

    // On early pages (1, 2), also show page 3 so leading block reads 1, 2, 3
    if (page <= 2) {
      visible.add(3);
    }

    // Always show the last two pages
    visible.add(totalPages - 1);
    visible.add(totalPages);

    // Convert to sorted array with ellipsis inserted at gaps
    const sorted = [...visible].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        pages.push('ellipsis');
      }
      pages.push(sorted[i]);
    }

    return pages;
  };

  const inactivePageClasses = 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground';
  const activePageClasses = 'bg-primary text-primary-foreground';

  const buttonBaseClasses = 'flex h-10 min-w-10 items-center justify-center px-2';
  const buttonDecoration = 'no-underline';

  const iconClasses = [buttonBaseClasses, inactivePageClasses, buttonDecoration, 'transition-all duration-200'].join(
    ' '
  );

  const disabledIconClasses = [
    buttonBaseClasses,
    'cursor-not-allowed',
    'bg-secondary text-secondary-foreground/50',
  ].join(' ');

  const pageButtonClasses = [
    buttonBaseClasses,
    'text-sm font-semibold',
    'transition-colors duration-200',
    buttonDecoration,
  ].join(' ');

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {page > 1 ? (
          <Link href={buildUrl(page - 1)} className={iconClasses} aria-label="Previous page">
            <RiArrowLeftSLine size={16} />
          </Link>
        ) : (
          <span className={disabledIconClasses}>
            <RiArrowLeftSLine size={16} />
          </span>
        )}

        {getPageNumbers().map((pageNum, idx) =>
          pageNum === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="text-muted-foreground px-2 text-sm">
              &hellip;
            </span>
          ) : (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={cn(pageButtonClasses, pageNum === page ? activePageClasses : inactivePageClasses)}
              aria-current={pageNum === page ? 'page' : undefined}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </Link>
          )
        )}

        {page < totalPages ? (
          <Link href={buildUrl(page + 1)} className={iconClasses} aria-label="Next page">
            <RiArrowRightSLine size={16} />
          </Link>
        ) : (
          <span className={disabledIconClasses}>
            <RiArrowRightSLine size={16} />
          </span>
        )}
      </nav>
    </div>
  );
}
