'use client';

import type { JSX } from 'react';

import { Analytics } from '@vercel/analytics/next';

/**
 * Client wrapper for Vercel Analytics.
 * Extracted to a client component so it works properly
 * within the server component layout.
 *
 * @returns {JSX.Element} The Vercel Analytics component.
 */
export function VercelAnalytics(): JSX.Element {
  return <Analytics mode="production" />;
}
