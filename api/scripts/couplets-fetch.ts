/**
 * Fetch Couplets Script
 *
 * Fetches published couplets (slug, text_hi, meaning_hi, and post_number) from
 * the Supabase database and writes them to `api/scripts/output/data/couplets.json`
 * as a map: slug → { text, meaning, post_number }.
 *
 * Usage:
 *   bun run couplets:fetch        - Run in development mode
 *   bun run couplets:fetch:prod   - Run in production mode
 */

import { initSpinner, handleScriptError, fetchPaginated } from './lib/cli';
import { loadScriptEnv } from './lib/env';
import { writeJsonFile } from './lib/storage';
import { createSupabaseClient } from './lib/supabase';
import { CoupletEntrySchema } from './lib/types';

/**
 * Represents a couplet entry fetched from the database.
 *
 * @interface CoupletRow
 * @property {string} slug - URL-friendly slug.
 * @property {string} text_hi - Hindi text.
 * @property {string | null} meaning_hi - Hindi meaning.
 * @property {number} post_number - Sequential post number.
 */
interface CoupletRow {
  slug: string;
  text_hi: string;
  meaning_hi: string | null;
  post_number: number;
}

/**
 * Main function that fetches couplets and writes them to a JSON file.
 *
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const spinner = initSpinner('[fetch-couplets] Loading environment...');

  const env = loadScriptEnv();
  spinner.succeed('[fetch-couplets] Environment loaded');

  spinner.start('[fetch-couplets] Creating Supabase client...');
  const supabase = createSupabaseClient(env);
  spinner.succeed('[fetch-couplets] Supabase client created');

  spinner.start('[fetch-couplets] Fetching couplets from database...');

  const allRows = await fetchPaginated(async (from, pageSize) => {
    const { data, error } = await supabase
      .from('posts')
      .select('slug, text_hi, meaning_hi, post_number')
      .eq('post_status', 'publish')
      .order('post_order', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      handleScriptError(spinner, '[fetch-couplets] Failed to fetch couplets', error);
    }

    return (data ?? []) as CoupletRow[];
  }, 1000);

  if (allRows.length === 0) {
    handleScriptError(spinner, '[fetch-couplets] No couplets found in the database');
  }

  // Build map: slug → { text, meaning, post_number }
  const coupletsMap: Record<string, any> = {};
  for (const row of allRows) {
    const entry = CoupletEntrySchema.parse({
      text: row.text_hi,
      meaning: row.meaning_hi,
      post_number: row.post_number,
    });
    coupletsMap[row.slug] = entry;
  }

  // Write to file
  const outputPath = new URL('output/data/couplets.json', import.meta.url);
  await writeJsonFile(outputPath.pathname, coupletsMap);

  spinner.succeed(`[fetch-couplets] Successfully wrote ${allRows.length} couplets to output/data/couplets.json`);
}

main().catch((error) => {
  console.error('[fetch-couplets] Unexpected error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
