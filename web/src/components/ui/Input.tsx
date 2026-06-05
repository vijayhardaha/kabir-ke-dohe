'use client';

import { type InputHTMLAttributes, forwardRef, useId } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Props for the Input component.
 *
 * @type {InputProps}
 * @property {string} label - Floating label text displayed inside the input
 * @property {string} [error] - Validation error message shown below the input
 * @property {string} [className] - Additional CSS classes
 * @property {string} [type] - Input type attribute
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Input component for text entry with a floating label animation.
 * The label sits inside the input by default and animates to the top border
 * when the input is focused or contains a value.
 *
 * @param {InputProps} props - Component props
 * @param {string} props.label - Floating label text
 * @param {string} [props.error] - Optional error message
 *
 * @returns {JSX.Element} Input component
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="relative">
      <div className="group relative">
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={cn(
            // Core layout and sizing
            'peer h-12 w-full bg-transparent px-3 pt-4',

            // Typography
            'text-foreground text-base',

            // Borders
            'border-input border-b-2',
            'focus:border-primary',

            // Animation
            'transition-colors duration-200',

            // Focus
            'focus:outline-none',

            // Error state
            error && 'border-destructive',

            // Extensible
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            // Positioning
            'pointer-events-none absolute left-3',

            // Default state: centred in the input
            'text-muted-foreground top-1/2 -translate-y-1/2 text-base',

            // Animation
            'transition-all duration-200',

            // Focused state: move to top
            'peer-focus:text-primary peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs',

            // Filled state: stay at top
            'not-placeholder-shown:top-2 not-placeholder-shown:-translate-y-0 not-placeholder-shown:text-xs',

            // Error on focus
            error && 'peer-focus:text-destructive'
          )}
        >
          {label}
        </label>
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export type { InputProps };
