'use client';

import type { JSX } from 'react';

import Link from 'next/link';
import { RiSearch2Line } from 'react-icons/ri';

/**
 * Search icon link displayed in the header on desktop.
 *
 * @returns {JSX.Element} Search icon component.
 */
export function SearchIcon(): JSX.Element {
  return (
    <Link
      href="/search"
      className="text-primary-foreground hover:text-primary-foreground flex h-9 w-9 cursor-pointer items-center justify-center transition-colors duration-200 hover:bg-black/15"
      aria-label="Search"
    >
      <RiSearch2Line size={18} />
    </Link>
  );
}
