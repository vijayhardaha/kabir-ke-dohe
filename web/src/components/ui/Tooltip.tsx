import type { JSX, ReactNode } from 'react';

/**
 * Props for the Tooltip component.
 *
 * @type {TooltipProps}
 * @property {ReactNode} children - The trigger element.
 * @property {string} content - The tooltip text.
 */
interface TooltipProps {
  children: ReactNode;
  content: string;
}

/**
 * Tooltip component — shows text on hover/focus, positioned above the trigger.
 * CSS-only with group utilities (no JavaScript required).
 *
 * @param {TooltipProps} props - Component props.
 * @param {ReactNode} props.children - The trigger element.
 * @param {string} props.content - Tooltip text.
 *
 * @returns {JSX.Element} Tooltip wrapper.
 */
function Tooltip({ children, content }: TooltipProps): JSX.Element {
  return (
    <div className="group relative">
      {children}
      <div
        role="tooltip"
        className="bg-foreground text-background pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 translate-y-0.5 rounded-md px-2.5 py-1.5 text-xs whitespace-nowrap opacity-0 shadow-sm transition-all duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
      >
        {content}
        {/* Arrow */}
        <div className="border-t-foreground absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
      </div>
    </div>
  );
}

export { Tooltip };
export type { TooltipProps };
