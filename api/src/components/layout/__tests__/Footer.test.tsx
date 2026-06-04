/**
 * Unit tests for the Footer component, verifying it renders consistently and matches the expected snapshot.
 *
 * @package
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('should render the copyright text', () => {
    render(<Footer />);

    expect(screen.getByText(/Kabir Dohe Hub/i)).toBeInTheDocument();
  });

  it('should contain author name', () => {
    render(<Footer />);

    expect(screen.getByText(/Vijay Hardaha/i)).toBeInTheDocument();
  });
});
