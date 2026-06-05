import { createClient } from '@supabase/supabase-js';

import { getEnv } from './env';

let client: ReturnType<typeof createClient> | null = null;

/**
 * Returns a lazily‑initialised Supabase client singleton.
 * The client is created on first call and cached for subsequent calls.
 *
 * @returns {ReturnType<typeof createClient>} The Supabase client instance.
 */
export function getSupabase(): ReturnType<typeof createClient> {
  if (!client) {
    const { supabaseUrl, supabaseKey } = getEnv();
    client = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  }
  return client;
}
