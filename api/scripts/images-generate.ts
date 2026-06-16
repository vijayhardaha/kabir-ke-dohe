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

/* ── Color palette ── */
interface ColorPalette {
  background: string;
}

const COLOR_PALETTES: Record<string, ColorPalette> = {
  'color-1': { background: '#4B0082' },
  'color-2': { background: '#006064' },
  'color-3': { background: '#8B0000' },
  'color-4': { background: '#B8860B' },
  'color-5': { background: '#2E8B57' },
  'color-6': { background: '#C71585' },
  'color-7': { background: '#483D8B' },
  'color-8': { background: '#c96b17' },
  'color-9': { background: '#1A5276' },
  'color-10': { background: '#556B2F' },
};

/**
 * Converts HSL values to a hex color string.
 *
 * @param {number} h - Hue (0–360).
 * @param {number} s - Saturation (0–100).
 * @param {number} l - Lightness (0–100).
 *
 * @returns {string} Hex color string (uppercase, e.g. "#FFDADA").
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number): string => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Derives heading and description colors from a base hex background color.
 *
 * Converts the base color to HSL, then generates:
 * - heading: same hue + saturation, lightness boosted to 96% (near white)
 * - description: same hue + saturation, lightness boosted to 88% (soft tint)
 *
 * @param {string} hex - Base hex color (e.g. "#8B0000").
 *
 * @returns {{ heading: string; description: string }} Derived heading and description hex colors.
 */
function generateVariants(hex: string): { heading: string; description: string } {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Normalize to 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  return { heading: hslToHex(h * 360, s * 100, 96), description: hslToHex(h * 360, s * 100, 88) };
}

/**
 * Generates 5 progressive shades from a base hex color by blending with white.
 * Returns from lightest (index 0) to darkest (index 4, which is the base color).
 *
 * @param {string} hexColor - Base hex color (e.g. "#4B0082").
 *
 * @returns {string[]} Array of 5 hex colors from lightest to darkest.
 */
function generateSvgShades(hexColor: string): string[] {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const blend = (amount: number): string => {
    const nr = Math.round(r + (255 - r) * amount);
    const ng = Math.round(g + (255 - g) * amount);
    const nb = Math.round(b + (255 - b) * amount);
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  };

  // 5 shades: blend factors give a smooth progression from light to dark
  return [blend(0.6), blend(0.4), blend(0.25), blend(0.1), hexColor];
}

const WEBSITE_URL = 'kabirdohehub.vercel.app';

/**
 * Returns a color palette based on the post number using modulo arithmetic.
 *
 * @param {number} postNumber - The sequential post number from the database.
 *
 * @returns {ColorPalette} A color palette from the predefined set.
 */
function getPalette(postNumber: number): ColorPalette {
  // postNumber is 1-based. Use (postNumber - 1) % 10 + 1 to get 1-10.
  const index = ((postNumber - 1) % 10) + 1;
  return COLOR_PALETTES[`color-${index}`];
}

/**
 * Represents a couplet entry parsed from the data file.
 */
interface CoupletEntry {
  text: string;
  meaning: string | null;
  post_number: number;
}

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
