import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving conflicts with the last‑win strategy.
 *
 * @param {(string | string[] | boolean | undefined | null | { [key: string]: boolean | undefined | null })[]} inputs - Class name
 *   values passed through to clsx for conditional logic.
 *
 * @returns {string} A single resolved class string free of conflicting Tailwind utilities.
 */
export function cn(
  ...inputs: (string | string[] | boolean | undefined | null | { [key: string]: boolean | undefined | null })[]
): string {
  return twMerge(clsx(inputs));
}
