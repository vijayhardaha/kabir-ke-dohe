import type { JSX } from 'react';

import { RiBookOpenLine } from 'react-icons/ri';

/**
 * WordPress "content‑none" template — shown when no posts match the query.
 * Displays an icon, a message, and a suggestion to adjust filters.
 *
 * @param {{ message: string }} props - Component props
 * @param {string} props.message - Message to display instead of the default
 *
 * @returns {JSX.Element} Empty state component
 */
export function ContentNone({ message }: { message: string }): JSX.Element {
  return (
    <div className="flex flex-col items-center border border-dashed py-20 text-center">
      <RiBookOpenLine size={48} className="text-muted-foreground mb-4" aria-hidden="true" />
      <p className="text-muted-foreground text-lg font-medium">{message}</p>
      <p className="text-muted-foreground mt-1 text-sm">Try adjusting your filters or browse the full archive.</p>
    </div>
  );
}
