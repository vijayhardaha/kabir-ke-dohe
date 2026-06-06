import type { JSX } from 'react';

import Link from 'next/link';

import { formatDoha } from '@/lib/utils/doha';

import { Widget, WidgetContent, WidgetHeader } from './Widget';

/**
 * A popular couplet item for the widget.
 *
 * @type {PopularCoupletItem}
 * @property {string} slug - URL slug for the couplet.
 * @property {string} text_hi - Hindi text of the couplet.
 */
interface PopularCoupletItem {
  slug: string;
  text_hi: string;
}

/**
 * Props for the PopularCoupletsWidget component.
 *
 * @type {PopularCoupletsWidgetProps}
 * @property {PopularCoupletItem[]} couplets - List of popular couplets to display.
 */
interface PopularCoupletsWidgetProps {
  couplets: PopularCoupletItem[];
}

/**
 * Popular couplets widget for the archive sidebar.
 * Displays a numbered list of popular couplets with formatted doha text.
 *
 * @param {PopularCoupletsWidgetProps} props - Component props.
 *
 * @returns {JSX.Element} Popular couplets widget component
 */
export function PopularCoupletsWidget({ couplets }: PopularCoupletsWidgetProps): JSX.Element | null {
  if (couplets.length === 0) return null;

  const displayNumber = (index: number): string => String(index + 1).padStart(2, '0');

  return (
    <Widget>
      <WidgetHeader>लोकप्रिय दोहे (Popular Couplets)</WidgetHeader>

      <WidgetContent>
        <div className="flex flex-col">
          {couplets.map((couplet, index) => (
            <div
              key={couplet.slug}
              className="border-border flex items-start gap-3 border-b py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              <span className="text-muted-foreground mt-0.5 shrink-0 text-xs font-semibold">
                {displayNumber(index)}
              </span>
              <Link
                href={`/couplet/${couplet.slug}`}
                className="text-foreground hover:text-primary text-sm leading-relaxed no-underline transition-colors duration-200"
              >
                {formatDoha(couplet.text_hi)}
              </Link>
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}
