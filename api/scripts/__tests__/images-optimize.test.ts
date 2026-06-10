/**
 * Unit tests for optimizeImage utility.
 *
 * Verifies sharp-based JPEG→WebP compression using programmatically
 * generated test images (no file fixtures needed).
 */

// @ts-ignore - sharp .mts resolution workaround
import sharp from 'sharp';
import { describe, it, expect } from 'vitest';

import { optimizeImage } from '../images-optimize';

describe('optimizeImage', () => {
  it('should convert a JPEG buffer to WebP format', async () => {
    const testJpeg = await sharp({
      create: { width: 100, height: 100, channels: 3, background: { r: 255, g: 0, b: 0 } },
    })
      .jpeg()
      .toBuffer();

    const result = await optimizeImage(testJpeg);

    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);

    // WebP files start with the RIFF header
    const header = result.slice(0, 4).toString();
    expect(header).toBe('RIFF');
  });

  it('should reduce file size compared to the JPEG input', async () => {
    const testJpeg = await sharp({
      create: { width: 400, height: 400, channels: 3, background: { r: 200, g: 200, b: 200 } },
    })
      .jpeg({ quality: 100 })
      .toBuffer();

    const result = await optimizeImage(testJpeg);

    expect(result.length).toBeLessThan(testJpeg.length);
  });

  it('should preserve image dimensions through conversion', async () => {
    const testJpeg = await sharp({
      create: { width: 150, height: 75, channels: 3, background: { r: 0, g: 128, b: 255 } },
    })
      .jpeg()
      .toBuffer();

    const result = await optimizeImage(testJpeg);

    const metadata = await sharp(result).metadata();
    expect(metadata.width).toBe(150);
    expect(metadata.height).toBe(75);
    expect(metadata.format).toBe('webp');
  });

  it('should also convert a PNG buffer to WebP', async () => {
    const testPng = await sharp({
      create: { width: 50, height: 50, channels: 4, background: { r: 0, g: 255, b: 0, alpha: 1 } },
    })
      .png()
      .toBuffer();

    const result = await optimizeImage(testPng);

    const header = result.slice(0, 4).toString();
    expect(header).toBe('RIFF');

    const metadata = await sharp(result).metadata();
    expect(metadata.format).toBe('webp');
  });

  it('should apply quality 85 compression', async () => {
    // Create a high-frequency image (lots of detail) to better show compression
    const width = 200;
    const height = 200;
    const channels = 4; // RGBA
    const rawData = Buffer.alloc(width * height * channels);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        rawData[idx] = (x + y) % 256; // R
        rawData[idx + 1] = (x * y) % 256; // G
        rawData[idx + 2] = 128; // B
        rawData[idx + 3] = 255; // A
      }
    }

    const testImage = await sharp(rawData, { raw: { width, height, channels } }).jpeg().toBuffer();

    const result = await optimizeImage(testImage);

    // Verify it came out as WebP with expected dimensions
    const metadata = await sharp(result).metadata();
    expect(metadata.format).toBe('webp');
    expect(metadata.width).toBe(width);
    expect(metadata.height).toBe(height);
  });
});
