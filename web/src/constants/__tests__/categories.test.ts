/**
 * Unit tests for category constants.
 *
 * Tests the predefined CATEGORIES list and the getCategoryBySlug helper.
 */

import { describe, it, expect } from 'vitest';

import { CATEGORIES, getCategoryBySlug } from '../categories';

describe('CATEGORIES', () => {
  it('has 20 predefined categories', () => {
    expect(CATEGORIES.length).toBe(20);
  });

  it('each category has a slug and name', () => {
    for (const cat of CATEGORIES) {
      expect(cat.slug).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(typeof cat.slug).toBe('string');
      expect(typeof cat.name).toBe('string');
    }
  });

  it('all slugs are unique', () => {
    const slugs = CATEGORIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('contains expected categories', () => {
    const slugs = CATEGORIES.map((c) => c.slug);
    expect(slugs).toContain('divine-grace');
    expect(slugs).toContain('ego-dissolution');
    expect(slugs).toContain('ultimate-reality');
    expect(slugs).toContain('final-liberation');
  });

  it('uses kebab-case for slugs', () => {
    for (const cat of CATEGORIES) {
      expect(cat.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('getCategoryBySlug', () => {
  it('returns the matching category for a known slug', () => {
    const result = getCategoryBySlug('divine-grace');
    expect(result).toBeDefined();
    expect(result?.name).toBe('Divine Grace');
  });

  it('returns undefined for an unknown slug', () => {
    const result = getCategoryBySlug('nonexistent-slug');
    expect(result).toBeUndefined();
  });

  it('is case-sensitive (lowercase only)', () => {
    const result = getCategoryBySlug('Divine-Grace');
    expect(result).toBeUndefined();
  });
});
