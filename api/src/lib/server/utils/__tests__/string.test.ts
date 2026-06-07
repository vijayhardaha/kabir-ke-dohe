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
  it('should capitalize each word by default', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('HELLO WORLD')).toBe('Hello World');
  });

  // Define a focused test case for one behavior.
  it('should handle empty string', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('')).toBe('');
  });

  // Define a focused test case for one behavior.
  it('should lowercase articles in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('The Tale OF Two Cities')).toBe('The Tale of Two Cities');
  });

  // Define a focused test case for one behavior.
  it('should lowercase prepositions in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Lord OF The Rings')).toBe('Lord of the Rings');
  });

  // Define a focused test case for one behavior.
  it('should lowercase "and", "vs" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('War AND Peace VS Hate')).toBe('War and Peace vs Hate');
  });

  // Define a focused test case for one behavior.
  it('should keep first word capitalized even if it is a lowercase word', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('A Journey To The Unknown')).toBe('A Journey to the Unknown');
  });

  // Define a focused test case for one behavior.
  it('should lowercase multiple consecutive function words', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('One In A Million')).toBe('One in a Million');
  });

  // Define a focused test case for one behavior.
  it('should replace ampersand with "and"', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Rock & Roll')).toBe('Rock and Roll');
  });

  // Define a focused test case for one behavior.
  it('should handle a word at the end from the set', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Stand BY')).toBe('Stand by');
  });

  // Define a focused test case for one behavior.
  it('should handle all lowercase words in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Life In A Day')).toBe('Life in a Day');
  });

  // Define a focused test case for one behavior.
  it('should handle mixed input with no lowercase words', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('QUICK BROWN FOX')).toBe('Quick Brown Fox');
  });

  // Define a focused test case for one behavior.
  it('should not lowercase first word even if it matches the set', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('the End')).toBe('The End');
  });

  // Define a focused test case for one behavior.
  it('should handle "of" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Heart OF Gold')).toBe('Heart of Gold');
  });

  // Define a focused test case for one behavior.
  it('should handle "for" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Search FOR Truth')).toBe('Search for Truth');
  });

  // Define a focused test case for one behavior.
  it('should handle "by" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Written BY Author')).toBe('Written by Author');
  });

  // Define a focused test case for one behavior.
  it('should handle "with" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Together WITH Friends')).toBe('Together with Friends');
  });

  // Define a focused test case for one behavior.
  it('should handle "to" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Going TO School')).toBe('Going to School');
  });

  // Define a focused test case for one behavior.
  it('should handle "at" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Arrive AT Time')).toBe('Arrive at Time');
  });

  // Define a focused test case for one behavior.
  it('should handle "an" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Such AN Honor')).toBe('Such an Honor');
  });

  // Define a focused test case for one behavior.
  it('should handle "in" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Once IN A Lifetime')).toBe('Once in a Lifetime');
  });

  // Define a focused test case for one behavior.
  it('should handle "on" in the middle', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('Focus ON Life')).toBe('Focus on Life');
  });
});
