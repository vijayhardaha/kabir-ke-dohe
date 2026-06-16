#!/usr/bin/env bun
/**
 * Development server for the quote card template.
 *
 * Watches templates/quote-card.hbs for changes, compiles it to
 * templates/index.html with sample content (sample doha + background image),
 * and serves it via Browsersync with live reload.
 *
 * Usage:
 *   bun run couplets:template:serve
 *
 * Then edit templates/quote-card.hbs — the browser will auto-reload
 * on every save, giving you instant feedback at 1200×630.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import browserSync from 'browser-sync';
import { watch } from 'chokidar';
import juice from 'juice';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, 'templates');
const HBS_PATH = resolve(TEMPLATES_DIR, 'quote-card.hbs');
const CSS_PATH = resolve(TEMPLATES_DIR, 'card.css');
const HTML_PATH = resolve(TEMPLATES_DIR, 'index.html');

/** Sample doha with a line break for visual preview. */
const SAMPLE_TEXT = `बलिहारी गुरु आपनो, घड़ी-घड़ी सौ-सौ बार।
मानुष से देवत किया, करत न लागी बार।।`;

/** Sample meaning for visual preview. */
const SAMPLE_MEANING = `कबीर दास जी कहते हैं कि मैं अपने गुरु पर बार-बार न्योछावर होता हूँ, क्योंकि उन्होंने मुझे मनुष्य की सीमित चेतना से उठाकर देवत्व की उच्च अवस्था तक पहुँचा दिया है, और इस महान आध्यात्मिक रूपांतरण में उन्होंने जरा भी समय नहीं लगाया।`;

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

/** Sample color palette for visual preview (color-3: dark red). */
const SAMPLE_PALETTE = COLOR_PALETTES['color-9'];

/**
 * Generates 5 progressive shades from a base hex color by blending with white.
 *
 * Uses blend factors 0.6, 0.4, 0.25, 0.1, and 0 to produce a smooth
 * visual progression from the lightest tint to the original base color.
 * The output is used to color each layer of the 5-path SVG background.
 *
 * @param {string} hexColor - Base hex color (e.g. "#4B0082").
 *
 * @returns {string[]} Array of 5 hex colors from lightest (index 0) to darkest (index 4, the base color).
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

  return [blend(0.6), blend(0.4), blend(0.25), blend(0.1), hexColor];
}

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
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

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

  return { heading: hslToHex(h * 360, s * 100, 96), description: hslToHex(h * 360, s * 100, 90) };
}

const WEBSITE_URL = 'kabirdohehub.vercel.app';

/**
 * Compiles the Handlebars template into a standalone HTML file.
 *
 * Reads card.css, replaces color variables with sample values, then uses
 * juice to inline all CSS into style attributes on the HTML elements.
 */
async function compile(): Promise<void> {
  const [template, cssRaw] = await Promise.all([readFile(HBS_PATH, 'utf-8'), readFile(CSS_PATH, 'utf-8')]);

  // Generate heading/description variants and SVG shades from the sample background
  const variants = generateVariants(SAMPLE_PALETTE.background);
  const svgColors = generateSvgShades(SAMPLE_PALETTE.background);

  // Resolve CSS color variables with generated variant colors.
  const css = cssRaw
    .replaceAll('{{heading_color}}', variants.heading)
    .replaceAll('{{description_color}}', variants.description);

  // Strip Handlebars helpers ({{#if ...}} / {{/if}}) and replace content + SVG vars
  let html = template
    .replace(/\{\{#if\s+\w+\}\}/g, '')
    .replace(/\{\{\/if\}\}/g, '')
    .replace('{{couplet_text}}', SAMPLE_TEXT)
    .replace('{{couplet_meaning}}', SAMPLE_MEANING)
    .replace('{{website_url}}', WEBSITE_URL)
    .replace('{{svg_color_1}}', svgColors[0])
    .replace('{{svg_color_2}}', svgColors[1])
    .replace('{{svg_color_3}}', svgColors[2])
    .replace('{{svg_color_4}}', svgColors[3])
    .replace('{{svg_color_5}}', svgColors[4]);

  // Inline the CSS into the HTML
  html = (juice as (html: string, opts: { extraCss: string }) => string)(html, { extraCss: css });

  await writeFile(HTML_PATH, html);
}

async function main(): Promise<void> {
  try {
    await compile();
    console.log(`✓ Compiled to ${HTML_PATH}`);
  } catch (error) {
    console.error(`✗ Failed to compile template: ${(error as Error).message}`);
    process.exit(1);
  }

  // Start Browsersync (serves templates/ and reloads on HTML changes)
  const bs = browserSync.create();

  bs.init({ server: TEMPLATES_DIR, port: 2580, open: true, files: [HTML_PATH, CSS_PATH], ui: false, notify: false });

  // Watch both the .hbs and .css files for changes and recompile
  const watcher = watch([HBS_PATH, CSS_PATH], { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200 } });

  watcher.on('change', async (changedPath: string) => {
    try {
      await compile();
      const label = changedPath.endsWith('.css') ? '.css change' : '.hbs change';
      console.log(`✓ Recompiled on ${label}`);
    } catch (error) {
      console.error(`✗ Compile error: ${(error as Error).message}`);
    }
  });

  console.log(`\nWatching ${HBS_PATH} and ${CSS_PATH} for changes…`);
  console.log(`Preview at http://localhost:2580\n`);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down…');
    await watcher.close();
    bs.exit();
  });
}

main().catch((error) => {
  console.error('Error:', (error as Error).message);
  process.exit(1);
});
