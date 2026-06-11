import type { JSX } from 'react';

import { RiDoubleQuotesL } from 'react-icons/ri';

/**
 * Color variant configuration for the injected message block.
 */
const COLOR_VARIANTS = [
  {
    container: 'bg-primary text-primary-foreground',
    bar: 'bg-primary-foreground/30',
    icon: 'text-primary-foreground/40',
    text: 'text-primary-foreground',
  },
  {
    container: 'bg-secondary text-secondary-foreground',
    bar: 'bg-secondary-foreground/30',
    icon: 'text-secondary-foreground/40',
    text: 'text-secondary-foreground',
  },
  { container: 'bg-white text-foreground', bar: 'bg-black/10', icon: 'text-black/20', text: 'text-foreground' },
] as const;

/**
 * Props for the InjectedMessage component.
 *
 * @type {InjectedMessageProps}
 * @property {string} message - The spiritual message or fact to display.
 * @property {number} colorIndex - Index into COLOR_VARIANTS (cycled 0–2).
 */
interface InjectedMessageProps {
  message: string;
  colorIndex: number;
}

/**
 * An injected spiritual message or fact displayed between post groups.
 * Uses a modern blockquote design with a thick left accent bar and
 * subtle quote icon. Cycles through three color schemes.
 *
 * @param {InjectedMessageProps} props - Component props.
 *
 * @returns {JSX.Element} Injected message block.
 */
export function InjectedMessage({ message, colorIndex }: InjectedMessageProps): JSX.Element {
  const colors = COLOR_VARIANTS[colorIndex % COLOR_VARIANTS.length];

  return (
    <div className={`${colors.container} px-6 py-8 md:px-8 md:py-10`}>
      <blockquote className="relative">
        {/* Decorative quote mark */}
        <RiDoubleQuotesL className={`${colors.icon} mb-2 size-14 md:size-18`} aria-hidden="true" />

        {/* Accent bar + text */}
        <div className="flex gap-5 md:gap-6">
          <div className={`w-1 shrink-0 rounded-full ${colors.bar}`} />
          <p className={`${colors.text} text-base leading-relaxed md:text-lg`}>{message}</p>
        </div>
      </blockquote>
    </div>
  );
}
