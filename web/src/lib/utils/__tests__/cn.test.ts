/**
 * Unit tests for cn() class name utility.
 *
 * The function merges Tailwind classes, resolving conflicts with
 * tailwind-merge so the last value for any utility wins.
 */

import { describe, it, expect } from 'vitest';

import { cn } from '../cn';

describe('cn', () => {
  it('joins simple class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles conditional classes via object syntax', () => {
    expect(cn('a', false && 'b')).toBe('a');
    expect(cn('a', true && 'b')).toBe('a b');
  });

  it('filters out falsy values', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b');
  });

  it('merges conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('merges conflicting color utilities', () => {
    expect(cn('text-red-500', 'text-blue-700')).toBe('text-blue-700');
  });

  it('merges spacing utilities', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('preserves non-conflicting classes', () => {
    expect(cn('flex', 'items-center', 'gap-2')).toBe('flex items-center gap-2');
  });

  it('accepts arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles object syntax with conditional keys', () => {
    expect(cn({ 'is-active': true, 'is-disabled': false })).toBe('is-active');
  });
});
