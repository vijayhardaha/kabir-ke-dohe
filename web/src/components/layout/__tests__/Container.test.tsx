/**
 * Unit tests for Container layout component.
 *
 * Tests rendering, max-width constraints, and custom class merging.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Container } from '../Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Hello World</Container>);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders children elements', () => {
    render(
      <Container>
        <span data-testid="child">Nested</span>
      </Container>
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('applies max-width and padding classes', () => {
    const { container } = render(<Container>Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('max-w-7xl');
    expect(div.className).toContain('px-4');
    expect(div.className).toContain('mx-auto');
  });

  it('merges additional className', () => {
    const { container } = render(<Container className="mt-8">Content</Container>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('mt-8');
  });

  it('renders as a <div> element', () => {
    const { container } = render(<Container>Test</Container>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
