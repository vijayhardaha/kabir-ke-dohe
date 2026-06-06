import type { JSX } from 'react';

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
        <svg
          className={`${colors.icon} mb-2 size-8 md:size-10`}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179z" />
        </svg>

        {/* Accent bar + text */}
        <div className="flex gap-5 md:gap-6">
          <div className={`w-1 shrink-0 rounded-full ${colors.bar}`} />
          <p className={`${colors.text} text-base leading-relaxed md:text-lg`}>{message}</p>
        </div>
      </blockquote>
    </div>
  );
}
