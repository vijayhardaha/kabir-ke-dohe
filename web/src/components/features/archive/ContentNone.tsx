import type { JSX } from 'react';

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
      <svg
        className="text-muted-foreground mb-4 size-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <p className="text-muted-foreground text-lg font-medium">{message}</p>
      <p className="text-muted-foreground mt-1 text-sm">Try adjusting your filters or browse the full archive.</p>
    </div>
  );
}
