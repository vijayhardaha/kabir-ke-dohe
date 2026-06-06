'use client';

import type { JSX } from 'react';

import { Combobox } from '@/components/ui/Combobox';

import { SORT_OPTIONS } from './SortControls';

/**
 * Sort dropdown that lets users change the ordering of the archive listing.
 *
 * @param {{ value: string; onChangeAction: (value: string) => void }} props - Component props.
 * @param {string} props.value - Currently selected sort option value.
 * @param {(value: string) => void} props.onChangeAction - Callback fired when a new sort option is selected.
 *
 * @returns {JSX.Element} A Combobox with sort options.
 */
export function SortDropdown({
  value,
  onChangeAction,
}: {
  value: string;
  onChangeAction: (value: string) => void;
}): JSX.Element {
  return (
    <Combobox label="Sort by" options={SORT_OPTIONS} value={value} onChangeAction={onChangeAction} className="w-46" />
  );
}
