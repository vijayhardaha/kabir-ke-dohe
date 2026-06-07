import fs from 'fs';
import path from 'path';

import { Resvg } from '@resvg/resvg-js';

import { getCoupletBySlug } from '@/lib/server/couplets';

// On Vercel, process.cwd() returns the serverless function root where public/ is bundled.
// In local dev, it points to the project root (web/ in this monorepo).
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const WIDTH = 1200;
const HEIGHT = 630;
const HEADERS = { 'Cache-Control': 'public, max-age=31536000, immutable' } as const;

const FONT_PATHS = [
  path.join(PUBLIC_DIR, 'poppins', 'Poppins-Medium.ttf'),
  path.join(PUBLIC_DIR, 'poppins', 'Poppins-SemiBold.ttf'),
  path.join(PUBLIC_DIR, 'poppins', 'Poppins-Bold.ttf'),
  path.join(PUBLIC_DIR, 'poppins', 'Poppins-ExtraBold.ttf'),
  path.join(PUBLIC_DIR, 'fonts', 'NotoSansDevanagari-Bold.ttf'),
];

/**
 * Generate an Open Graph image for a Kabir couplet.
 *
 * The route matches `/api/image/[slug].png` — the `.png` suffix is stripped
 * before fetching the post. Uses `@resvg/resvg-js` (HarfBuzz via rustybuzz)
 * for proper Devanagari text shaping.
 *
 * @param {Request} _request - Incoming HTTP request.
 * @param {{ params: Promise<{ slug: string }> }} root0 - Route context.
 * @param {Promise<{ slug: string }>} root0.params - Route parameters.
 *
 * @returns {Promise<Response>} PNG response with the OG image.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }): Promise<Response> {
  try {
    const { slug } = await params;
    const postSlug = slug.replace(/\.png$/, '');

    const post = await getCoupletBySlug(postSlug);

    // Read background image from disk for the SVG data URI
    const bgImage = await fs.promises.readFile(path.join(PUBLIC_DIR, 'background.jpg'));
    const bgBase64 = bgImage.toString('base64');

    let svg: string;

    if (!post) {
      svg = buildFallbackSvg();
    } else {
      const dandaIndex = post.text_hi.indexOf('। ');
      const firstLine = dandaIndex === -1 ? post.text_hi : post.text_hi.slice(0, dandaIndex + 1);
      const secondLine = dandaIndex === -1 ? null : post.text_hi.slice(dandaIndex + 2);
      const fontSize = post.text_hi.length > 60 ? 40 : post.text_hi.length > 40 ? 44 : 48;
      svg = buildOgSvg(bgBase64, firstLine, secondLine, fontSize);
    }

    const resvg = new Resvg(svg, { font: { fontFiles: FONT_PATHS, loadSystemFonts: false } });

    const pngData = resvg.render().asPng();

    return new Response(new Uint8Array(pngData), { headers: { 'Content-Type': 'image/png', ...HEADERS } });
  } catch (error) {
    console.error('OG image generation failed:', error);

    const svg = buildMinimalErrorSvg();
    const resvg = new Resvg(svg, { font: { fontFiles: FONT_PATHS, loadSystemFonts: false } });
    const pngData = resvg.render().asPng();

    return new Response(new Uint8Array(pngData), { status: 500, headers: { 'Content-Type': 'image/png', ...HEADERS } });
  }
}

/**
 * Build the SVG for a found couplet.
 *
 * @param {string} bgBase64 - Base64-encoded JPEG background image.
 * @param {string} firstLine - First line of the doha (may include trailing danda).
 * @param {string | null} secondLine - Second line of the doha, or null if single line.
 * @param {number} fontSize - Font size for the doha text.
 *
 * @returns {string} SVG string for the OG image.
 */
function buildOgSvg(bgBase64: string, firstLine: string, secondLine: string | null, fontSize: number): string {
  const dohaLines = secondLine
    ? `<tspan x="${WIDTH / 2}" dy="0">${escapeXml(firstLine)}</tspan>
      <tspan x="${WIDTH / 2}" dy="${fontSize * 1.5}">${escapeXml(secondLine)}</tspan>`
    : `<tspan x="${WIDTH / 2}" dy="0">${escapeXml(firstLine)}</tspan>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.3)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.6)" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.4)" />
    </filter>
  </defs>

  <image href="data:image/jpeg;base64,${bgBase64}" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" />

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#overlay)" />

  <text x="${WIDTH / 2}" y="120" font-family="Noto Sans Devanagari" font-size="28" font-weight="700" fill="rgba(255,255,255,0.55)" text-anchor="middle" letter-spacing="4">
    संत कबीर दास के दोहे
  </text>

  <text x="${WIDTH / 2}" y="310" font-family="Noto Sans Devanagari" font-size="${fontSize}" font-weight="700" fill="#ffffff" text-anchor="middle" filter="url(#shadow)">
    ${dohaLines}
  </text>

  <text x="${WIDTH / 2}" y="540" font-family="Poppins" font-size="18" font-weight="700" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2">
    kabirdohehub.vercel.app
  </text>
</svg>`;
}

/**
 * Build a fallback SVG for unknown slugs.
 *
 * @returns {string} SVG string for the fallback OG image.
 */
function buildFallbackSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff" />
  <rect x="20" y="20" width="${WIDTH - 40}" height="${HEIGHT - 40}" fill="none" stroke="#c62641" stroke-width="10" />

  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 12}" font-family="Noto Sans Devanagari" font-size="64" font-weight="700" fill="#c62641" text-anchor="middle">
    कबीर के दोहे
  </text>
</svg>`;
}

/**
 * Build a minimal error SVG when the route crashes unexpectedly.
 *
 * @returns {string} SVG string for a safe fallback image.
 */
function buildMinimalErrorSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff" />
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 12}" font-family="Noto Sans Devanagari" font-size="48" font-weight="700" fill="#c62641" text-anchor="middle">
    कबीर के दोहे
  </text>
</svg>`;
}

/**
 * Escape special XML characters to prevent SVG injection.
 *
 * @param {string} str - String to escape.
 *
 * @returns {string} Escaped string safe for XML insertion.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
