import type { JSX } from 'react';

import Link from 'next/link';

import { formatDoha } from '@/lib/utils/doha';
import type { TagRef } from '@/types';

/**
 * Lightweight couplet reference used in related couplets display.
 *
 * @type {RelatedCouplet}
 * @property {string} slug - URL‑friendly unique slug
 * @property {string} text_hi - Couplet text in Hindi
 * @property {TagRef[]} tags - Associated tag references
 */
interface RelatedCouplet {
  slug: string;
  text_hi: string;
  tags: TagRef[];
}

/**
 * Related couplets grid section for a couplet detail page.
 *
 * @param {{ couplets: RelatedCouplet[] }} props - Component props.
 * @param {RelatedCouplet[]} props.couplets - Array of related couplets to display.
 *
 * @returns {JSX.Element | null} The related couplets section, or null if empty.
 */
export function RelatedCouplets({ couplets }: { couplets: RelatedCouplet[] }): JSX.Element | null {
  if (couplets.length === 0) {
    return null;
  }

  return (
    <>
      <hr className="border-border my-12" />
      <section>
        <h2 className="text-foreground mb-6 text-2xl font-bold">संबंधित दोहे (Related Couplets)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {couplets.map((couplet) => (
            <Link
              key={couplet.slug}
              href={`/couplet/${couplet.slug}`}
              className="bg-muted text-foreground hover:bg-muted/80 group px-5 py-4 no-underline transition-colors"
            >
              <h3 className="group-hover:text-primary mb-2 text-base leading-snug font-bold transition-colors">
                {formatDoha(couplet.text_hi)}
              </h3>
              {couplet.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {couplet.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.slug}
                      className="bg-secondary/65 text-secondary-foreground inline-block px-1.5 py-0.5 text-[10px] leading-tight font-medium tracking-wide uppercase"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
