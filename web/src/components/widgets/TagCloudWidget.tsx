import type { JSX } from 'react';

import Link from 'next/link';

import { Widget, WidgetContent, WidgetHeader } from './Widget';

/**
 * Props for the TagCloudWidget component.
 *
 * @type {TagCloudWidgetProps}
 * @property {Array<{ slug: string; name: string; post_count: number }>} tags - List of tags with their post counts.
 */
interface TagCloudWidgetProps {
  tags: Array<{ slug: string; name: string; post_count: number }>;
}

/**
 * Tag cloud widget for the archive sidebar.
 * Displays tag chips with post counts, sorted by popularity.
 *
 * @param {TagCloudWidgetProps} props - Component props.
 *
 * @returns {JSX.Element} Tag cloud widget component
 */
export function TagCloudWidget({ tags }: TagCloudWidgetProps): JSX.Element {
  return (
    <Widget>
      <WidgetHeader>Tag Cloud</WidgetHeader>

      <WidgetContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="text-muted-foreground bg-muted hover:bg-secondary hover:text-secondary-foreground group inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium whitespace-nowrap no-underline transition-colors duration-200"
            >
              {tag.name}
              <span className="text-muted-foreground/60 group-hover:bg-secondary-foreground group-hover:text-secondary text-xs transition-colors duration-200">
                ({tag.post_count})
              </span>
            </Link>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}
