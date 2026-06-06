'use client';

import { type JSX, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * A single option in the combobox.
 *
 * @type {ComboboxOption}
 * @property {string} value - Internal value
 * @property {string} label - Display label
 */
interface ComboboxOption {
  value: string;
  label: string;
}

/**
 * Props for the Combobox component.
 *
 * @type {ComboboxProps}
 * @property {ComboboxOption[]} options - Available options
 * @property {string} value - Currently selected value
 * @property {(value: string) => void} onChange - Selection handler
 * @property {string} label - Floating label displayed at the top-left
 * @property {string} [className] - Additional classes for the wrapper
 */
interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

/**
 * Combobox component with Material Design style.
 * Displays a floating label at the top-left, the selected value,
 * and a dropdown menu on click.
 *
 * @param {ComboboxProps} props - Component props
 *
 * @returns {JSX.Element} Combobox component
 */
export function Combobox({ options, value, onChange, label, className }: ComboboxProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        // Positioning for dropdown
        'relative',
        className
      )}
    >
      {/* ---- Trigger button ---- */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          // Layout
          'flex w-full items-center justify-between px-3 py-2.5',
          // Typography — selected value
          'text-foreground text-sm',
          // Border
          'border',
          open ? 'border-primary' : 'border-input',
          // Focus
          'focus:border-primary focus:outline-none',
          // Animation
          'transition-colors duration-200'
        )}
      >
        <span className="truncate">{selected ? selected.label : ''}</span>

        {/* Chevron icon */}
        <svg
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
            open && 'rotate-180'
          )}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ---- Floating label ---- */}
      <span
        className={cn(
          // Positioning
          'pointer-events-none absolute left-3',
          // Font
          'font-medium',
          // Typography
          'text-foreground text-xs',
          // Background and padding
          'bg-background px-1',
          // Always at the top since label is always visible
          '-top-2'
        )}
      >
        {label}
      </span>

      {/* ---- Dropdown menu ---- */}
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={cn(
            // Positioning
            'absolute right-0 left-0 z-50 mt-0.5',
            // Colors
            'bg-card text-foreground',
            'border-input',
            // Max height and scroll
            'max-h-60 overflow-y-auto',
            // Elevation
            'shadow-lg'
          )}
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                // Layout
                'cursor-pointer px-3 py-2',
                // Typography
                'text-sm',
                // Hover
                'hover:bg-muted',
                // Active (selected)
                option.value === value && 'bg-primary/10 text-foreground font-semibold'
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
