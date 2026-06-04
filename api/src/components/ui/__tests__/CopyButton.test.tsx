/**
 * Unit tests for the CopyButton component, verifying it renders and functions correctly.
 *
 * @package
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CopyButton } from '@/components/ui/CopyButton';

describe('CopyButton', () => {
  it('should render the copy button', () => {
    render(<CopyButton textToCopy="test" />);

    expect(screen.getByRole('button', { name: /Copy code to clipboard/i })).toBeInTheDocument();
  });
});
