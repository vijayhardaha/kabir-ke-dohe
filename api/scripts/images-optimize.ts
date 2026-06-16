#!/usr/bin/env bun
/**
 * Optimizes original couplet images with sharp and outputs WebP versions.
 *
 * Reads all JPEG files from output/images/original/, compresses them with sharp
 * (WebP, quality 85), and writes to output/images/optimized/.
 *
 * Usage:
 *   bun run couplets:images:optimize
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { initSpinner, handleScriptError } from './lib/cli';
import { readFilesWithExtension, ensureDir } from './lib/storage';

/**
 * Optimize a single image buffer to WebP.
 *
 * @param {Buffer} input - Input image buffer (JPEG/PNG/etc).
 *
 * @returns {Promise<Buffer>} WebP-encoded buffer.
 */
export async function optimizeImage(input: Buffer): Promise<Buffer> {
  return sharp(input).resize(1200, 630).webp({ quality: 100 }).toBuffer();
}

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const spinner = initSpinner('Scanning original images...');

  const srcDir = resolve(__dirname, 'output', 'images', 'original');
  const files = await readFilesWithExtension(srcDir, '.jpg');

  if (files.length === 0) {
    handleScriptError(spinner, "No JPEG files found in output/images/original/. Run 'couplets:images' first.");
  }

  /* ── 2. Ensure optimized output directory ── */
  const destDir = resolve(__dirname, 'output', 'images', 'optimized');
  await ensureDir(destDir);

  spinner.start(`Optimizing ${files.length} images to WebP...`);

  /* ── 3. Optimize each image ── */
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const inputPath = resolve(srcDir, fileName);
    const webpName = basename(fileName, '.jpg') + '.webp';
    const outputPath = resolve(destDir, webpName);

    const buffer = await readFile(inputPath);
    const optimized = await optimizeImage(buffer);

    await writeFile(outputPath, optimized);

    spinner.text = `Optimizing... (${i + 1}/${files.length})`;
  }

  spinner.succeed(`${files.length} WebP images written to output/images/optimized/`);
  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  main().catch((error: Error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
