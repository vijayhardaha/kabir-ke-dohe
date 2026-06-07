#!/usr/bin/env bun
/**
 * Uploads optimized couplet images from images/optimized/ to Supabase Storage.
 *
 * Reads all WebP files from output/images/optimized/, uploads each to the `couplet-images`
 * bucket with the slug as the file name (e.g. `balihari-guru-....webp`).
 *
 * Usage:
 *   bun run couplets:images:upload            # dev (uses .env.local)
 *   bun run couplets:images:upload:prod       # production (uses .env.production)
 */

import { readdir, readFile } from 'node:fs/promises';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  /* ── 1. Load environment variables ── */
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = resolve(process.cwd(), nodeEnv === 'production' ? '.env.production' : '.env.local');

  dotenv.config({ path: envFile, override: true });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
    process.exit(1);
  }

  /* ── 2. Create Supabase client (service role for storage write access) ── */
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  /* ── 3. Read optimized images from images/optimized/ ── */
  const spinner = ora('Scanning optimized images…').start();

  const srcDir = resolve(__dirname, 'output', 'images', 'optimized');

  let files: string[];
  try {
    files = (await readdir(srcDir)).filter((f) => extname(f).toLowerCase() === '.webp').sort();
  } catch {
    spinner.fail("No output/images/optimized/ directory found. Run 'couplets:images:optimize' first.");
    process.exit(1);
  }

  if (files.length === 0) {
    spinner.fail("No WebP files found in output/images/optimized/. Run 'couplets:images:optimize' first.");
    return;
  }

  /* ── 4. Upload each image ── */
  const BUCKET = 'couplet-images';
  let success = 0;
  let failed = 0;

  spinner.text = `Uploading ${files.length} WebP images to bucket '${BUCKET}'…`;

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = resolve(srcDir, fileName);
    const fileBuffer = await readFile(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, fileBuffer, { contentType: 'image/webp', upsert: true });

    if (error) {
      spinner.text = `✗ ${fileName} — ${error.message}`;
      failed++;
    } else {
      spinner.text = `${i + 1}/${files.length}  ✓ ${fileName}`;
      success++;
    }
  }

  if (failed > 0) {
    spinner.fail(`${success} uploaded, ${failed} failed.`);
  } else {
    spinner.succeed(`${success} images uploaded to bucket '${BUCKET}'.`);
  }
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
