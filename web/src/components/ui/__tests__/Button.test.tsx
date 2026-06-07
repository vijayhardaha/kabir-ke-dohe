/**
 * Unit tests for Button and ButtonLink components.
 *
 * Tests rendering with different variants, sizes, and states.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Button, ButtonLink } from '../Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('applies the primary variant by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('primary');
  });

  it('applies a custom variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('secondary');
  });

  it('applies the md size by default', () => {
    render(<Button>Default Size</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('text-sm');
  });

  it('applies a custom size', () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('text-base');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('passes additional className', () => {
    render(<Button className="extra-class">Styled</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('extra-class');
  });

  it('renders as a <button> element', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
  });
});

describe('ButtonLink', () => {
  it('renders as an anchor element', () => {
    render(<ButtonLink href="/test">Link</ButtonLink>);
    const link = screen.getByRole('link', { name: /link/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/test');
  });

  it('applies variant and size classes', () => {
    render(
      <ButtonLink href="/" variant="outline-primary" size="sm">
        Small Outline
      </ButtonLink>
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('border-primary');
    expect(link.className).toContain('text-xs');
  });
});
