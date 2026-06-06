'use client';

import type { JSX } from 'react';

import { Combobox } from '@/components/ui/Combobox';

import { SORT_OPTIONS } from './SortControls';

/**
 * Sort dropdown that lets users change the ordering of the archive listing.
 *
 * @param {{ value: string; onChange: (value: string) => void }} props - Component props.
 * @param {string} props.value - Currently selected sort option value.
 * @param {(value: string) => void} props.onChange - Callback fired when a new sort option is selected.
 *
 * @returns {JSX.Element} A Combobox with sort options.
 */
export function SortDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }): JSX.Element {
  return <Combobox label="Sort by" options={SORT_OPTIONS} value={value} onChange={onChange} className="w-46" />;
}
