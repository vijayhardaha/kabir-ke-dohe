/**
 * Supabase client factory for scripts.
 *
 * Scripts should NOT import from `@/lib/server/supabase` because that module
 * depends on Next.js `server-only` and server-side env resolution which is
 * not available in standalone scripts. This module provides a lightweight
 * alternative that reads env vars directly from `process.env`.
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Returns the configured Supabase project URL.
 *
 * @returns {string} The Supabase project URL.
 *
 * @throws {Error} When `NEXT_PUBLIC_SUPABASE_URL` is not set.
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
  }
  return url;
}

/**
 * Returns the configured Supabase publishable key.
 *
 * @returns {string} The Supabase publishable key.
 *
 * @throws {Error} When `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is not set.
 */
export function getSupabaseKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variable.');
  }
  return key;
}

/**
 * Creates a Supabase client with session persistence disabled.
 *
 * @returns {ReturnType<typeof createClient>} A new Supabase client instance.
 */
export function createSupabaseClient(): ReturnType<typeof createClient> {
  return createClient(getSupabaseUrl(), getSupabaseKey(), {
    auth: { persistSession: false },
  });
}
