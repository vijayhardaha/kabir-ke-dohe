/**
 * Unit tests for the Header component, verifying it renders consistently and matches the expected snapshot.
 *
 * @package
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Header from '@/components/layout/Header';

describe('Header', () => {
  it('should render the heading', () => {
    render(<Header />);

    expect(screen.getByRole('heading', { name: /Kabir Dohe API/i })).toBeInTheDocument();
  });
});
