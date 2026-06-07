import type { JSX } from 'react';

import Link from 'next/link';

import { formatDoha } from '@/lib/utils/doha';

/**
 * Props for the {@link QuoteCard} component.
 *
 * @type {QuoteCardProps}
 * @property {string} slug - URL slug for the couplet.
 * @property {string} text_hi - Hindi couplet text.
 * @property {string | null} meaning_hi - Hindi meaning/translation.
 * @property {{ name: string; slug: string } | null} category - Category reference, or null.
 * @property {number} index - Display index (1‑based) shown as 01, 02, etc.
 */
interface QuoteCardProps {
  slug: string;
  text_hi: string;
  meaning_hi: string | null;
  category: { name: string; slug: string } | null;
  index: number;
}

/**
 * Modern quote-style card for displaying a couplet in a grid layout.
 *
 * Shows a numbered badge, Hindi doha text, Hindi meaning, and category tag.
 *
 * @param {QuoteCardProps} props - Component props.
 *
 * @returns {JSX.Element} A clickable quote card.
 */
export default function QuoteCard({ slug, text_hi, meaning_hi, category, index }: QuoteCardProps): JSX.Element {
  const paddedIndex = String(index).padStart(2, '0');

  return (
    <Link
      href={`/couplet/${slug}`}
      className="border-border/50 bg-card relative block overflow-hidden border p-6 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Decorative quote icon — absolute top-right, behind content */}
      <svg
        className="text-primary/10 pointer-events-none absolute top-2 right-8 z-0 h-52 w-52"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Content — above the decorative icon */}
      <div className="relative z-10">
        {/* Number + category line */}
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-medium tracking-wide">
          <span>⸻</span>
          <span>K&ordm; {paddedIndex}</span>
          {category && (
            <>
              <span>&middot;</span>
              <span className="uppercase">{category.name}</span>
            </>
          )}
        </div>

        {/* Hindi text */}
        <p className="text-foreground mb-3 text-base font-bold md:text-lg">{formatDoha(text_hi)}</p>

        {/* Hindi meaning */}
        {meaning_hi && (
          <div className="border-primary border-l-2 pl-3">
            <p className="text-muted-foreground text-sm leading-relaxed">{meaning_hi}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
