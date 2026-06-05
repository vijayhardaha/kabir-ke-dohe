/**
 * Lazily loads environment variables on first access.
 * Next.js handles .env.local automatically — no explicit dotenv call needed.
 */

let envCache: { supabaseUrl: string; supabaseKey: string } | null = null;

/**
 * Reads and caches Supabase environment variables.
 *
 * @returns {{ supabaseUrl: string; supabaseKey: string }} The validated Supabase configuration.
 *
 * @throws {Error} When either required environment variable is missing.
 */
function loadEnv(): { supabaseUrl: string; supabaseKey: string } {
  if (envCache) return envCache;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY are set.'
    );
  }

  envCache = { supabaseUrl, supabaseKey };
  return envCache;
}

/**
 * Returns the Supabase environment configuration, loading it lazily.
 *
 * @returns {{ supabaseUrl: string; supabaseKey: string }} The Supabase URL and publishable key.
 */
export function getEnv(): { supabaseUrl: string; supabaseKey: string } {
  return loadEnv();
}
