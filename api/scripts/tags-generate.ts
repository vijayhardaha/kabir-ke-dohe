#!/usr/bin/env bun
/**
 * Tags Generate Script
 *
 * Fetches all tag names with their published post counts from the Supabase
 * database and writes them to `api/scripts/output/data/tags.txt` in a
 * `name: count` format, sorted alphabetically.
 *
 * Usage:
 *   bun run tags:generate
 *   NODE_ENV=production bun run tags:generate
 */

import ora from 'ora';

import type { Spinner } from './lib/cli';
import { loadScriptEnv } from './lib/env';
import { writeTextFile } from './lib/storage';
import { createSupabaseClient } from './lib/supabase';
import { TagResponseSchema, type TagResponse } from './lib/types';

// Module-level spinner reference so the Ctrl+C handler can access it
let spinner: Spinner = null;

// Listen for raw Ctrl+C on stdin — works even when ora puts stdin in raw mode
// (which suppresses the SIGINT signal in favour of sending the raw byte).
process.stdin.on('data', (data: Buffer) => {
  if (data.length === 1 && data[0] === 3) {
    spinner?.stop();
    process.exit(0);
  }
});

/**
 * Main function that fetches tags with post counts and writes them to a file.
 */
async function main(): Promise<void> {
  const env = loadScriptEnv();
  const supabase = createSupabaseClient(env);

  /* ── 1. Fetch tags with post count ── */
  spinner = ora('Fetching tags from database...').start();

  const { data, error } = await supabase
    .from('tags')
    .select('name, post_tags!inner(post:posts!inner(post_status))')
    .eq('post_tags.post.post_status', 'publish')
    .order('name', { ascending: true });

  if (error) {
    spinner.fail(`Failed to fetch tags: ${error.message}`);
    process.exit(1);
  }

  const tags = (data ?? []) as any[];
  const validated = tags
    .map((tag) => {
      try {
        return TagResponseSchema.parse(tag);
      } catch {
        return null;
      }
    })
    .filter((tag): tag is TagResponse => tag !== null);

  spinner.succeed(`Fetched ${validated.length} tags`);

  /* ── 2. Build content ── */
  spinner.start('Writing tags file...');

  const lines = validated.map((tag) => `${tag.name}: ${tag.post_tags.length}`);
  const content = lines.join('\n');

  /* ── 3. Write to file ── */
  const outputPath = new URL('output/data/tags.txt', import.meta.url);
  await writeTextFile(outputPath.pathname, content + '\n');

  spinner.succeed(`Wrote ${validated.length} tags to tags.txt`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
