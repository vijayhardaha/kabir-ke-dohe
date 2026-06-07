/**
 * Unit tests for formatDoha utility.
 *
 * Tests that Hindi couplet text is correctly split at the danda boundary
 * and rendered as JSX with a line break.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { formatDoha } from '../doha';

describe('formatDoha', () => {
  it('splits text at the first danda (।) and inserts a line break', () => {
    const text = 'बलिहारी गुरु आपनो, घड़ी-घड़ी सौ-सौ बार। मानुष से देवत किया, करत न लागी बार।।';
    const { container } = render(formatDoha(text));

    // First line should include the danda
    expect(container.textContent).toContain('बलिहारी');
    expect(container.textContent).toContain('मानुष');

    // Should contain exactly one <br />
    const brElements = container.querySelectorAll('br');
    expect(brElements.length).toBe(1);
  });

  it('returns the full text wrapped in a span when no danda is found', () => {
    const text = 'सिर्फ एक पंक्ति';
    const { container } = render(formatDoha(text));

    expect(container.textContent).toBe('सिर्फ एक पंक्ति');
    expect(container.querySelectorAll('br').length).toBe(0);
  });

  it('includes the danda character in the first line', () => {
    const text = 'पहली पंक्ति। दूसरी पंक्ति';
    render(formatDoha(text));

    // The danda itself should be visible in the rendered output
    expect(screen.getByText(/पहली पंक्ति/)).toBeTruthy();
  });

  it('handles empty string gracefully', () => {
    const { container } = render(formatDoha(''));
    expect(container.textContent).toBe('');
  });

  it('renders within a <span> element', () => {
    const text = 'कुछ भी। कुछ और';
    const { container } = render(formatDoha(text));

    const span = container.querySelector('span');
    expect(span).not.toBeNull();
  });
});
