#!/usr/bin/env bun
/**
 * Uploads optimized couplet images to Supabase Storage.
 *
 * Reads all WebP files from dist/images/optimized/ and uploads each to the
 * `couplet-images` bucket with the slug as the file name (e.g. `balihari-guru-....webp`).
 *
 * Usage:
 *   bun run couplets:images:upload            # dev (uses .env.local)
 *   bun run couplets:images:upload:prod       # production (uses .env.production)
 */

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ora from 'ora';

import type { Spinner } from '../lib/cli';
import { loadScriptEnv } from '../lib/env';
import { readFilesWithExtension } from '../lib/storage';
import { createSupabaseClient } from '../lib/supabase';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
 * Main function for uploading images to Supabase Storage.
 *
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  /* ── 1. Load environment variables ── */
  spinner = ora('Loading environment...').start();

  let env;
  try {
    env = loadScriptEnv();
    spinner.succeed('Environment loaded (' + env.NODE_ENV + ' mode)');
  } catch (error) {
    spinner.fail('Failed to load environment: ' + (error as Error).message);
    process.exit(1);
  }

  /* ── 2. Create Supabase client ── */
  spinner.start('Creating Supabase client...');
  const supabase = createSupabaseClient(env);
  spinner.succeed('Supabase client created');

  /* ── 3. Read optimized images ── */
  spinner.start('Scanning optimized images...');

  const srcDir = resolve(__dirname, '..', '..', 'dist', 'images', 'optimized');
  const files = await readFilesWithExtension(srcDir, '.webp');

  if (files.length === 0) {
    spinner.fail("No WebP files found in dist/images/optimized/. Run 'couplets:images:optimize' first.");
    process.exit(1);
  }

  /* ── 4. Upload each image ── */
  const BUCKET = 'couplet-images';
  let success = 0;
  let failed = 0;

  spinner.start(`Uploading ${files.length} WebP images...`);

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = resolve(srcDir, fileName);
    const { readFile } = await import('node:fs/promises');
    const fileBuffer = await readFile(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, fileBuffer, { contentType: 'image/webp', upsert: true });

    if (error) {
      failed++;
    } else {
      success++;
    }

    spinner.text = `Uploading... (${success + failed}/${files.length})`;
  }

  if (failed > 0) {
    spinner.fail(`${success} uploaded, ${failed} failed.`);
  } else {
    spinner.succeed(`${success} images uploaded to bucket '${BUCKET}'.`);
  }
  process.exit(0);
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
