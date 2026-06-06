import type { JSX } from 'react';

import Link from 'next/link';

import { WIDGET_CATEGORIES } from '@/constants/widgets';

import { Widget, WidgetContent, WidgetHeader } from './Widget';

/**
 * Categories widget for the archive sidebar.
 * Displays a list of category links with Hindi+English names.
 *
 * @returns {JSX.Element} Categories widget component
 */
export function CategoriesWidget(): JSX.Element {
  return (
    <Widget>
      <WidgetHeader>श्रेणियाँ (Categories)</WidgetHeader>

      <WidgetContent>
        <ul className="flex flex-col gap-3">
          {WIDGET_CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="text-muted-foreground hover:text-primary block text-sm font-medium no-underline transition-colors duration-200"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </WidgetContent>
    </Widget>
  );
}
