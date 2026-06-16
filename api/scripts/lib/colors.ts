/**
 * Color palette definitions for OG image generation.
 * Used across image generation and template preview scripts.
 */

/**
 * Represents a color palette with a background hex color.
 *
 * @interface ColorPalette
 * @property {string} background - Hex color code for the background (e.g. "#4B0082").
 */
export interface ColorPalette {
  background: string;
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
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
 * Returns a color palette based on post number using modulo arithmetic.
 *
 * @param {number} postNumber - The sequential post number from the database (1-based).
 *
 * @returns {ColorPalette} A color palette from the predefined set.
 */
export function getPalette(postNumber: number): ColorPalette {
  const index = ((postNumber - 1) % 10) + 1;
  return COLOR_PALETTES[`color-${index}`];
}

/**
 * Derives heading and description colors from a base hex background color.
 *
 * Converts the base color to HSL, then generates:
 * - heading: same hue + saturation, lightness 96% (near white)
 * - description: same hue + saturation, lightness 88% (soft tint)
 *
 * @param {string} hex - Base hex color (e.g. "#8B0000").
 *
 * @returns {{ heading: string; description: string }} Derived heading and description hex colors.
 */
export function generateVariants(hex: string): { heading: string; description: string } {
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

  return { heading: hslToHex(h * 360, s * 100, 96), description: hslToHex(h * 360, s * 100, 88) };
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
 * Generates 5 progressive shades from a base hex color by blending with white.
 *
 * Returns from lightest (index 0) to darkest (index 4, which is the base color).
 *
 * @param {string} hexColor - Base hex color (e.g. "#4B0082").
 *
 * @returns {string[]} Array of 5 hex colors from lightest to darkest.
 */
export function generateSvgShades(hexColor: string): string[] {
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
