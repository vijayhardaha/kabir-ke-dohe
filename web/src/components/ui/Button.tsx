'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ComponentProps, JSX } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

/**
 * Available visual variants for the Button component.
 *
 * @type {ButtonVariant}
 */
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'white'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-white'
  | 'ghost';

/**
 * Available size presets for the Button component.
 *
 * @type {ButtonSize}
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component.
 *
 * @type {ButtonProps}
 * @property {ButtonVariant} [variant='primary'] - Visual variant
 * @property {ButtonSize} [size='md'] - Size preset
 * @property {string} [className] - Additional CSS classes
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Props for the ButtonLink component.
 *
 * @type {ButtonLinkProps}
 * @property {ButtonVariant} [variant='primary'] - Visual variant
 * @property {ButtonSize} [size='md'] - Size preset
 * @property {string} [className] - Additional CSS classes
 */
interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * Maps each ButtonVariant to its Tailwind class string.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground border-primary',
  secondary: 'bg-secondary text-secondary-foreground border-secondary',
  white: 'bg-white text-foreground border-white',
  'outline-primary': 'bg-transparent text-primary border-primary',
  'outline-secondary': 'bg-transparent text-secondary border-secondary',
  'outline-white': 'bg-transparent text-white border-white',
  ghost: 'bg-transparent text-foreground border-transparent hover:shadow-none',
};

/**
 * Maps each ButtonSize to its Tailwind padding and font classes.
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

/**
 * Returns the base class string shared by Button and ButtonLink.
 *
 * @param {ButtonVariant} variant - Visual variant.
 * @param {ButtonSize} size - Size preset.
 * @param {string} [extra] - Additional classes to append.
 *
 * @returns {string} Combined class string.
 */
function getButtonClasses(variant: ButtonVariant, size: ButtonSize, extra?: string): string {
  return cn(
    // Core layout
    'inline-flex items-center justify-center gap-2 border',
    'font-semibold no-underline whitespace-nowrap',

    // Hover bottom shadow
    'hover:shadow-[0_4px_6px_rgba(0,0,0,0.15)]',

    // Animation
    'transition-all duration-200',

    // Focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',

    // Variant and size
    variantStyles[variant],
    sizeStyles[size],

    // Extensible
    extra
  );
}

/**
 * Button component for primary, secondary, outline, and ghost actions.
 * Supports configurable variant and size with disabled state styling.
 *
 * @param {ButtonProps} props - Component props
 * @param {ButtonVariant} [props.variant='primary'] - Visual variant
 * @param {ButtonSize} [props.size='md'] - Size preset
 *
 * @returns {JSX.Element} Button component
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          getButtonClasses(variant, size, className),

          // Cursor + disabled
          'cursor-pointer',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * ButtonLink component — renders a Next.js Link styled as a button.
 * Use this for navigational actions that should look like buttons.
 *
 * @param {ButtonLinkProps} props - Component props
 * @param {ButtonVariant} [props.variant] - Visual variant
 * @param {ButtonSize} [props.size] - Size preset
 *
 * @returns {JSX.Element} Link element with button styling
 */
function ButtonLink({ variant = 'primary', size = 'md', className, children, ...props }: ButtonLinkProps): JSX.Element {
  return (
    <Link className={getButtonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export { Button, ButtonLink };
export type { ButtonLinkProps, ButtonVariant, ButtonSize };
