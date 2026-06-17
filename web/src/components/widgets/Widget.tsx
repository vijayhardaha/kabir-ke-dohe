import type { JSX, ReactNode } from 'react';

/**
 * Props for the Widget component.
 *
 * @type {WidgetProps}
 * @property {ReactNode} children - Content to render inside the bg-card wrapper.
 */
// ── Container ─────────────────────────────────────────────────────────────

interface WidgetProps {
  children: ReactNode;
}

/**
 * Widget container with bg-card background.
 * Used across archive sidebar widgets for consistent card styling.
 *
 * @param {WidgetProps} props - Component props.
 *
 * @returns {JSX.Element} Widget container.
 */
export function Widget({ children }: WidgetProps): JSX.Element {
  return <div className="bg-card">{children}</div>;
}

/**
 * Props for the WidgetHeader component.
 *
 * @type {WidgetHeaderProps}
 * @property {ReactNode} children - The heading content (typically a string or text node).
 */
interface WidgetHeaderProps {
  children: ReactNode;
}

// ── Header ────────────────────────────────────────────────────────────────

/**
 * Reusable widget header with a dashed bottom border.
 * Used across archive sidebar widgets for consistent heading styling.
 *
 * @param {WidgetHeaderProps} props - Component props.
 *
 * @returns {JSX.Element} Widget header component.
 */
export function WidgetHeader({ children }: WidgetHeaderProps): JSX.Element {
  return (
    <div className="border-border border-b border-dashed px-4 py-3">
      <h3 className="text-foreground text-sm font-bold tracking-wide">{children}</h3>
    </div>
  );
}

/**
 * Props for the WidgetContent component.
 *
 * @type {WidgetContentProps}
 * @property {ReactNode} children - The content to render inside the padded container.
 */
interface WidgetContentProps {
  children: ReactNode;
}

// ── Content ───────────────────────────────────────────────────────────────

/**
 * Reusable widget content wrapper with standard padding.
 * Used across archive sidebar widgets for consistent content spacing.
 *
 * @param {WidgetContentProps} props - Component props.
 *
 * @returns {JSX.Element} Widget content wrapper.
 */
export function WidgetContent({ children }: WidgetContentProps): JSX.Element {
  return <div className="p-4">{children}</div>;
}
