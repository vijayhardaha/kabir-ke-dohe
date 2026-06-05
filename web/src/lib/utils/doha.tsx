import type { JSX } from 'react';

/**
 * Splits a Hindi doha (couplet) at its natural verse boundary — the first
 * `। ` (danda + space) — and returns JSX with a `<br />` between the two lines.
 *
 * If no danda is found the entire text is returned as a single span.
 *
 * @param {string} text - The Hindi doha text (e.g. `text_hi`).
 *
 * @returns {JSX.Element} A `<span>` containing the lines separated by `<br />`.
 *
 * @example
 *   formatDoha('बलिहारी गुरु आपनो... बार। मानुष से देव...')
 *   // → <span>बलिहारी ... बार।<br />मानुष ... बार।।</span>
 */
export function formatDoha(text: string): JSX.Element {
  const dandaIndex = text.indexOf('। ');

  if (dandaIndex === -1) {
    return <span>{text}</span>;
  }

  const firstLine = text.slice(0, dandaIndex + 1); // include the danda
  const secondLine = text.slice(dandaIndex + 2); // skip "। "

  return (
    <span>
      {firstLine}
      <br />
      {secondLine}
    </span>
  );
}
