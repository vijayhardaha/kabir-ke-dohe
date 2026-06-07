'use client';

import { useEffect, type JSX } from 'react';

/**
 * Fires a POST request to `/api/couplets/view` on mount to record a unique view.
 * Designed as a minimal client component so server components can embed it
 * without converting to client themselves.
 *
 * @param {{ slug: string }} props - Component props
 * @param {string} props.slug - The couplet slug to track a view for.
 *
 * @returns {JSX.Element} A non-rendering element (empty fragment).
 */
export function ViewTracker({ slug }: { slug: string }): JSX.Element {
  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/couplets/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      signal: controller.signal,
    }).catch(() => {
      // Silently ignore — view tracking is non-critical
    });

    return () => {
      controller.abort();
    };
  }, [slug]);

  // Render nothing — this component is purely for side effects
  return <></>;
}
