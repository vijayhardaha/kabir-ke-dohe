'use client';

import { useCallback, useRef, type JSX, type SubmitEvent } from 'react';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Widget, WidgetContent } from './Widget';

/**
 * Search widget component for the archive sidebar.
 * Displays an input group with a Search icon button that redirects to /search?q={query}.
 *
 * @returns {JSX.Element} Search form widget
 */
export function SearchWidget(): JSX.Element {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles form submission by redirecting to the search page with the query.
   *
   * @param {SubmitEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = inputRef.current?.value.trim();
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    },
    [router]
  );

  return (
    <Widget>
      <WidgetContent>
        <form onSubmit={handleSubmit} className="flex" role="search">
          <div className="flex w-full">
            <input
              ref={inputRef}
              id="sidebar-search"
              name="q"
              type="search"
              placeholder="Search couplets…"
              className="text-foreground bg-card border-input focus:border-primary flex h-11 w-full border border-r-0 px-3 text-sm transition-colors duration-200 outline-none"
              aria-label="Search couplets"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200"
              aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </div>
        </form>
      </WidgetContent>
    </Widget>
  );
}
