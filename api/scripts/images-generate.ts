#!/usr/bin/env bun
/**
 * Generates OG-style images for couplets from data/couplets.json.
 *
 * Reads slug → text_hi pairs, renders each through the quote-card Handlebars
 * template, and outputs 1200×630 JPEG images to output/images/original/.
 *
 * Usage:
 *   bun run couplets:images --all               generate images for all couplets
 *   bun run couplets:images balihari-guru-...    generate for a single slug
 */

import { existsSync } from 'node:fs';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import juice from 'juice';
import ora from 'ora';

import { generateVariants, generateSvgShades, getPalette } from './lib/colors';
import type { CoupletEntry } from './lib/types';

const WEBSITE_URL = 'kabirdohehub.vercel.app';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

// Module-level spinner reference so the Ctrl+C handler can access it
let spinner: ReturnType<typeof ora> | null = null;

// Listen for raw Ctrl+C on stdin — works even when ora puts stdin in raw mode
// (which suppresses the SIGINT signal in favour of sending the raw byte).
process.stdin.on('data', (data: Buffer) => {
  if (data.length === 1 && data[0] === 3) {
    spinner?.stop();
    process.exit(0);
  }
});

async function main(): Promise<void> {
  /* ── 1. Parse CLI args ── */
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const slug = isAll ? null : args[0];

  if (!isAll && !slug) {
    console.error('Usage: bun run couplets:images [--all | <slug>]');
    console.error();
    console.error('  --all     Generate images for every couplet in output/data/couplets.json');
    console.error('  <slug>    Generate image for a single couplet (e.g. balihari-guru-...)');
    process.exit(1);
  }

  /* ── 2. Read couplets data ── */
  spinner = ora('Reading couplets data…').start();

  const dataPath = resolve(__dirname, 'output', 'data', 'couplets.json');
  const raw = await readFile(dataPath, 'utf-8');
  const couplets = JSON.parse(raw) as Record<string, CoupletEntry>;
  const entries = Object.entries(couplets);

  if (entries.length === 0) {
    spinner.fail("No couplets found in output/data/couplets.json. Run 'couplets:fetch' first.");
    return;
  }

  /* ── 3. Filter entries ── */
  const filtered = isAll ? entries : entries.filter(([s]) => s === slug);

  if (filtered.length === 0) {
    spinner.fail(`No couplet found with slug "${slug}".`);
    process.exit(1);
  }

  /* ── 4. Read template & CSS ── */
  const templatePath = resolve(__dirname, 'templates/quote-card.hbs');
  const template = await readFile(templatePath, 'utf-8');

  const cssPath = resolve(__dirname, 'templates/card.css');
  const cssTemplate = await readFile(cssPath, 'utf-8');

  /* ── 5. Ensure original output directory ── */
  const outputDir = resolve(__dirname, 'output', 'images', 'original');
  await mkdir(outputDir, { recursive: true });

  /* ── 6. Detect Chrome path ── */
  const chromePath = await findChromePath();
  if (chromePath) {
    spinner.text = `Using Chrome: ${chromePath}`;
  }

  /* ── 7. Import node-html-to-image ── */

  const { default: generate }: { default: (...args: any[]) => any } = await import('node-html-to-image');

  spinner.text = 'Generating images…';

  /* ── 8. Generate each image (sequential to avoid multiple Puppeteer instances) ── */
  for (let i = 0; i < filtered.length; i++) {
    const [s, entry] = filtered[i];
    const output = resolve(outputDir, `${s}.jpg`);

    // Insert line breaks at natural doha line endings (। + space → । + newline)
    const textWithBreaks = entry.text.replace(/। /g, '।\n');

    // Pick color palette based on post_number
    const palette = getPalette(entry.post_number);

    // Generate heading/description variants and SVG layer shades from the background
    const variants = generateVariants(palette.background);
    const svgColors = generateSvgShades(palette.background);

    // Resolve CSS color variables with generated variant colors.
    const resolvedCss = cssTemplate
      .replaceAll('{{heading_color}}', variants.heading)
      .replaceAll('{{description_color}}', variants.description);

    // Inline the CSS into the HTML via juice
    const inlinedHtml = (juice as (html: string, opts: { extraCss: string }) => string)(template, {
      extraCss: resolvedCss,
    });

    await generate({
      output,
      html: inlinedHtml,
      content: {
        couplet_text: textWithBreaks,
        couplet_meaning: entry.meaning ?? '',
        website_url: WEBSITE_URL,
        svg_color_1: svgColors[0],
        svg_color_2: svgColors[1],
        svg_color_3: svgColors[2],
        svg_color_4: svgColors[3],
        svg_color_5: svgColors[4],
      },
      type: 'jpeg',
      quality: 100,
      puppeteerArgs: {
        executablePath: chromePath ?? undefined,
        defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 2 },
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    spinner.text = `Generating images… (${i + 1}/${filtered.length})`;
  }

  spinner.succeed(`${filtered.length} image(s) generated in output/images/original/`);
  process.exit(0);
}

/**
 * Scans a puppeteer Chrome cache directory for a valid Chrome executable.
 *
 * Looks inside the revision directories and checks known platform paths.
 *
 * @param {string} cacheDir - Path to the `chrome/` directory inside puppeteer's cache.
 *
 * @returns {Promise<string | null>} The path to the Chrome executable, or null if not found.
 */
export async function findChromeInCache(cacheDir: string): Promise<string | null> {
  if (!existsSync(cacheDir)) {
    return null;
  }

  try {
    const entries = await readdir(cacheDir, { withFileTypes: true });
    const revisions = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ name: e.name, dir: join(cacheDir, e.name) }));

    // Sort by revision number descending (latest first)
    revisions.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

    for (const revision of revisions) {
      // Look for Chrome.app on macOS, or chrome on Linux/Windows
      const candidates = [
        join(
          revision.dir,
          'chrome-mac-arm64',
          'Google Chrome for Testing.app',
          'Contents',
          'MacOS',
          'Google Chrome for Testing'
        ),
        join(
          revision.dir,
          'chrome-mac-x64',
          'Google Chrome for Testing.app',
          'Contents',
          'MacOS',
          'Google Chrome for Testing'
        ),
        join(revision.dir, 'chrome-linux64', 'chrome'),
        join(revision.dir, 'chrome-win64', 'chrome.exe'),
      ];

      for (const candidate of candidates) {
        try {
          await stat(candidate);
          return candidate;
        } catch {
          // Candidate doesn't exist, try next
        }
      }
    }
  } catch {
    // Cache dir is unreadable or unexpected structure
  }

  return null;
}

/**
 * Finds the Chrome executable path.
 *
 * Checks in order:
 *  1. PUPPETEER_EXECUTABLE_PATH environment variable
 *  2. Local cache at   api/.cache/puppeteer/chrome/  (project-local install)
 *  3. Global cache at  ~/.cache/puppeteer/chrome/     (system-wide install)
 *
 * @returns {Promise<string | null>} The path to the Chrome executable, or null if not found.
 */
export async function findChromePath(): Promise<string | null> {
  // 1. Explicit env var
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  // 2. Local cache (project-local puppeteer config)
  const localCache = resolve(__dirname, '.cache', 'puppeteer', 'chrome');
  const local = await findChromeInCache(localCache);
  if (local) return local;

  // 3. Global cache (~/.cache/puppeteer/chrome/)
  const homedir = process.env.HOME ?? process.env.USERPROFILE ?? process.env.HOMEPATH ?? '';
  const globalCache = resolve(homedir, '.cache/puppeteer/chrome');
  const global = await findChromeInCache(globalCache);
  if (global) return global;

  return null;
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  main().catch((error: Error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
