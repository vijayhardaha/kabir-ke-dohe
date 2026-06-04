/**
 * Unit tests for the CodeBlock component, verifying it renders code snippets correctly.
 *
 * @package
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CodeBlock } from '@/components/ui/CodeBlock';

describe('CodeBlock', () => {
  it('should render the code snippet', () => {
    render(<CodeBlock code="console.log('test');" language="javascript" />);

    expect(screen.getByText("console.log('test');")).toBeInTheDocument();
  });

  it('should render the language label', () => {
    render(<CodeBlock code="test" language="javascript" />);

    expect(screen.getByText('javascript')).toBeInTheDocument();
  });
});
