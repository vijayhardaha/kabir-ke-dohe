import type { JSX } from 'react';

import Link from 'next/link';
import { RiDoubleQuotesL } from 'react-icons/ri';

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
      <RiDoubleQuotesL
        size={208}
        className="text-primary/10 pointer-events-none absolute top-2 right-8 z-0"
        aria-hidden="true"
      />

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
        <h3 className="text-foreground mb-3 text-xl font-bold md:text-2xl">{formatDoha(text_hi)}</h3>

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
