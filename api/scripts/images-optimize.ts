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

import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import ora from 'ora';
// @ts-ignore - sharp .mts resolution workaround
import * as sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

/**
 * Optimize a single image buffer to WebP.
 *
 * @param {Buffer} input - Input image buffer (JPEG/PNG/etc).
 *
 * @returns {Promise<Buffer>} WebP-encoded buffer.
 */
export async function optimizeImage(input: Buffer): Promise<Buffer> {
  return sharp(input).webp({ quality: 85 }).toBuffer();
}

async function main(): Promise<void> {
  /* ── 1. Read original images ── */
  const spinner = ora('Scanning original images…').start();

  const srcDir = resolve(__dirname, 'output', 'images', 'original');

  let files: string[];
  try {
    files = (await readdir(srcDir)).filter((f) => extname(f).toLowerCase() === '.jpg').sort();
  } catch {
    spinner.fail("No output/images/original/ directory found. Run 'couplets:images' first.");
    process.exit(1);
  }

  if (files.length === 0) {
    spinner.fail("No JPEG files found in output/images/original/. Run 'couplets:images' first.");
    return;
  }

  /* ── 2. Ensure optimized output directory ── */
  const destDir = resolve(__dirname, 'output', 'images', 'optimized');
  await mkdir(destDir, { recursive: true });

  spinner.text = `Optimizing ${files.length} images to WebP…`;

  /* ── 3. Optimize each image ── */
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const inputPath = resolve(srcDir, fileName);
    const webpName = basename(fileName, '.jpg') + '.webp';
    const outputPath = resolve(destDir, webpName);

    const buffer = await readFile(inputPath);
    const optimized = await optimizeImage(buffer);

    await writeFile(outputPath, optimized);

    const inKB = (buffer.length / 1024).toFixed(1);
    const outKB = (optimized.length / 1024).toFixed(1);
    const saved = ((1 - optimized.length / buffer.length) * 100).toFixed(0);

    spinner.text = `${i + 1}/${files.length}  ${webpName}  (${inKB}KB → ${outKB}KB, -${saved}%)`;
  }

  spinner.succeed(`${files.length} WebP images written to output/images/optimized/`);
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  main().catch((error: Error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
