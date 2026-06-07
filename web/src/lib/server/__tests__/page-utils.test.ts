/**
 * Unit tests for pagination utility functions.
 *
 * Tests parseSortParams and validatePageParam functions.
 * handlePageRedirect is tested via its side-effect (redirect throws).
 */

import { describe, it, expect } from 'vitest';

import { parseSortParams, validatePageParam } from '../page-utils';

describe('parseSortParams', () => {
  it('returns defaults when no params are provided', () => {
    const result = parseSortParams({});
    expect(result).toEqual({ sortBy: 'number', sortOrder: 'asc', perPage: 10 });
  });

  it('uses provided sort_by and sort_order', () => {
    const result = parseSortParams({ sort_by: 'title', sort_order: 'desc' });
    expect(result.sortBy).toBe('title');
    expect(result.sortOrder).toBe('desc');
    expect(result.perPage).toBe(10);
  });

  it('ignores non-string param values', () => {
    const result = parseSortParams({ sort_by: ['a', 'b'], sort_order: undefined });
    expect(result.sortBy).toBe('number');
    expect(result.sortOrder).toBe('asc');
  });
});

describe('validatePageParam', () => {
  it('returns page number for valid input >= 2', () => {
    expect(validatePageParam('3', '/base')).toBe(3);
    expect(validatePageParam('10', '/base')).toBe(10);
  });

  it('returns page number for valid input >= 2 with searchParams', () => {
    expect(validatePageParam('5', '/base', { sort_by: 'title' })).toBe(5);
  });

  it('redirects for page 1', () => {
    expect(() => validatePageParam('1', '/base')).toThrow();
  });

  it('redirects for non-numeric input', () => {
    expect(() => validatePageParam('abc', '/base')).toThrow();
  });

  it('redirects for NaN input', () => {
    expect(() => validatePageParam('NaN', '/base')).toThrow();
  });

  it('redirects for negative numbers', () => {
    expect(() => validatePageParam('-1', '/base')).toThrow();
  });

  it('redirects for page 0', () => {
    expect(() => validatePageParam('0', '/base')).toThrow();
  });
});
