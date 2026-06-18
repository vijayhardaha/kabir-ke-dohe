import type { JSX } from 'react';

import Link from 'next/link';

import { formatDoha } from '@/lib/utils/doha';

/**
 * Adjacent couplet data for the navigation links.
 *
 * @type {AdjacentData}
 * @property {{ slug: string; text_hi: string } | null} prev - Previous couplet, or null if at start.
 * @property {{ slug: string; text_hi: string } | null} next - Next couplet, or null if at end.
 */
export interface AdjacentData {
  prev: { slug: string; text_hi: string } | null;
  next: { slug: string; text_hi: string } | null;
}

/**
 * Previous / next navigation links between adjacent couplets.
 *
 * @param {{ adjacent: AdjacentData }} props - Component props.
 * @param {AdjacentData} props.adjacent - Adjacent couplet data containing prev and next entries.
 *
 * @returns {JSX.Element} The navigation links.
 */
export function CoupletNavigation({ adjacent }: { adjacent: AdjacentData }): JSX.Element {
  return (
    <nav className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-between">
      {adjacent.prev ? (
        <Link
          href={`/couplet/${adjacent.prev.slug}`}
          className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground flex flex-1 flex-col px-5 py-4 no-underline transition-colors"
        >
          <span className="text-xs font-bold tracking-wide uppercase">&larr; Previous</span>
          <span className="mt-1 text-sm leading-snug font-medium">{formatDoha(adjacent.prev.text_hi)}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {adjacent.next ? (
        <Link
          href={`/couplet/${adjacent.next.slug}`}
          className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground flex flex-1 flex-col px-5 py-4 text-right no-underline transition-colors"
        >
          <span className="text-xs font-bold tracking-wide uppercase">Next &rarr;</span>
          <span className="mt-1 text-sm leading-snug font-medium">{formatDoha(adjacent.next.text_hi)}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
