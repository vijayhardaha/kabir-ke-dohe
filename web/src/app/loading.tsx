import type { JSX } from 'react';

/**
 * Root loading component — shows a full‑screen overlay with a pulsing spinner
 * while page content is being fetched or streamed.
 *
 * @returns {JSX.Element} Full‑screen loading overlay.
 */
export default function Loading(): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85">
      <span className="loader" aria-label="Loading" />
    </div>
  );
}
