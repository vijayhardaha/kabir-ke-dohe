/**
 * Unit tests for server string helpers, ensuring normalization logic stays predictable across input variants.
 *
 * @package
 */

import { describe, it, expect } from 'vitest';

import { sanitizeTitle, toSentenceCase } from '@/lib/server/utils';

// Group related test behavior in this suite.
describe('sanitizeTitle', () => {
  // Define a focused test case for one behavior.
  it('should use kebab-case', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitizeTitle('Hello World')).toBe('hello-world');
  });

  // Define a focused test case for one behavior.
  it('should handle whitespace', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitizeTitle('  spaces  ')).toBe('spaces');
  });
});

// Group related test behavior in this suite.
describe('toSentenceCase', () => {
  // Define a focused test case for one behavior.
  it('should capitalize first letter', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('hello')).toBe('Hello');
  });

  // Define a focused test case for one behavior.
  it('should lowercase the rest', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
  });

  // Define a focused test case for one behavior.
  it('should handle empty string', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('')).toBe('');
  });
});
