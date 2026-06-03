/**
 * Unit tests for slugifyText utility function.
 *
 * @package
 */

import { describe, it, expect } from 'vitest';

import { slugifyText } from '../slug';

// Test suite for slugifyText function
describe('slugifyText', () => {
  // Should convert text to lowercase slug with spaces
  it('should convert text to lowercase slug', () => {
    expect(slugifyText('Hello World')).toBe('hello-world');
  });

  // Should remove special characters like & and keep text readable
  it('should remove special characters', () => {
    expect(slugifyText('Spiritual & Devotional')).toBe('spiritual-devotional');
  });

  // Should collapse multiple consecutive spaces into single hyphen
  it('should handle multiple spaces', () => {
    expect(slugifyText('Hello    World')).toBe('hello-world');
  });

  // Should return the same text if already lowercase
  it('should handle already slugified text', () => {
    expect(slugifyText('philosophy')).toBe('philosophy');
  });

  // Should return empty string for empty input
  it('should handle empty string', () => {
    expect(slugifyText('')).toBe('');
  });

  // Should convert underscores to hyphens
  it('should convert underscores to hyphens', () => {
    expect(slugifyText('hello_world')).toBe('hello-world');
  });

  // Should preserve numbers in the slug
  it('should handle numbers in text', () => {
    expect(slugifyText('Chapter 1 Introduction')).toBe('chapter-1-introduction');
  });

  // Should trim leading and trailing whitespace
  it('should handle text with leading/trailing spaces', () => {
    expect(slugifyText('  Hello World  ')).toBe('hello-world');
  });

  // Should convert tabs and newlines to spaces then to hyphens
  it('should handle text with tabs and newlines', () => {
    expect(slugifyText('Hello\tWorld\nTest')).toBe('hello-world-test');
  });

  // Should collapse multiple consecutive hyphens into single hyphen
  it('should convert multiple hyphens to single hyphen', () => {
    expect(slugifyText('Hello--World')).toBe('hello-world');
  });

  // Should remove special characters but preserve word boundaries
  it('should handle mixed special characters', () => {
    expect(slugifyText('Hello!@#$%World^&*')).toBe('helloworld');
  });

  // Should handle single word without modification
  it('should handle single word', () => {
    expect(slugifyText('Philosophy')).toBe('philosophy');
  });

  // Should return empty string when only special characters present
  it('should handle text with only special characters', () => {
    expect(slugifyText('!@#$%')).toBe('');
  });

  // Should remove punctuation while preserving word structure
  it('should handle text with dots and commas', () => {
    expect(slugifyText('Hello, World. Test!')).toBe('hello-world-test');
  });

  // Should convert hyphen-underscore combinations to hyphens
  it('should convert hyphen-underscore combinations to hyphens', () => {
    expect(slugifyText('hello-world_test')).toBe('hello-world-test');
  });

  // Should convert underscores to hyphens
  it('should convert underscores to hyphens', () => {
    expect(slugifyText('hello_world')).toBe('hello-world');
  });
});
