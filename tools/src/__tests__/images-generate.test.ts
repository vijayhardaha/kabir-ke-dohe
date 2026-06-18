/**
 * Unit tests for findChromeInCache utility.
 *
 * Tests Chrome cache directory scanning logic using temporary directories
 * to avoid relying on an actual Puppeteer Chrome installation.
 */

import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { findChromeInCache } from '../scripts/images-generate';

describe('findChromeInCache', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'chrome-cache-test-'));
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('should return null when cache directory does not exist', async () => {
    const result = await findChromeInCache(join(tmpDir, 'nonexistent'));
    expect(result).toBeNull();
  });

  it('should return null when cache directory is empty (no revision dirs)', async () => {
    mkdirSync(join(tmpDir, 'empty-dir'));
    const result = await findChromeInCache(join(tmpDir, 'empty-dir'));
    expect(result).toBeNull();
  });

  it('should find Chrome for Testing on macOS ARM64 path', async () => {
    const chromeMacArmPath = join(
      tmpDir,
      '1234567',
      'chrome-mac-arm64',
      'Google Chrome for Testing.app',
      'Contents',
      'MacOS',
      'Google Chrome for Testing'
    );

    mkdirSync(join(tmpDir, '1234567', 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS'), {
      recursive: true,
    });
    writeFileSync(chromeMacArmPath, '');

    const result = await findChromeInCache(tmpDir);
    expect(result).toBe(chromeMacArmPath);
  });

  it('should find Chrome for Testing on Linux path', async () => {
    const chromeLinuxPath = join(tmpDir, '987654', 'chrome-linux64', 'chrome');

    mkdirSync(join(tmpDir, '987654', 'chrome-linux64'), { recursive: true });
    writeFileSync(chromeLinuxPath, '');

    const result = await findChromeInCache(tmpDir);
    expect(result).toBe(chromeLinuxPath);
  });

  it('should find Chrome for Testing on Windows path', async () => {
    const chromeWinPath = join(tmpDir, '555555', 'chrome-win64', 'chrome.exe');

    mkdirSync(join(tmpDir, '555555', 'chrome-win64'), { recursive: true });
    writeFileSync(chromeWinPath, '');

    const result = await findChromeInCache(tmpDir);
    expect(result).toBe(chromeWinPath);
  });

  it('should prefer the latest revision when multiple exist', async () => {
    // Older revision
    mkdirSync(join(tmpDir, '1000000', 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS'), {
      recursive: true,
    });
    writeFileSync(
      join(
        tmpDir,
        '1000000',
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing'
      ),
      ''
    );

    // Newer revision
    mkdirSync(join(tmpDir, '2000000', 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS'), {
      recursive: true,
    });
    writeFileSync(
      join(
        tmpDir,
        '2000000',
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing'
      ),
      ''
    );

    const result = await findChromeInCache(tmpDir);
    expect(result).toContain('2000000');
  });

  it('should skip non-matching platform directories', async () => {
    // A revision directory that exists but has no matching platform
    mkdirSync(join(tmpDir, '777777', 'some-other-dir'), { recursive: true });
    writeFileSync(join(tmpDir, '777777', 'some-other-dir', 'random-file'), '');

    const result = await findChromeInCache(tmpDir);
    expect(result).toBeNull();
  });
});
