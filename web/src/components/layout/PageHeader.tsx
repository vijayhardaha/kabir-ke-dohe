import type { JSX, ReactNode } from 'react';

/**
 * Props for the {@link PageHeader} component.
 *
 * @interface PageHeaderProps
 * @property {string} title - Page heading text.
 * @property {ReactNode} [description] - Optional description rendered below the heading.
 */
interface PageHeaderProps {
  title: string;
  description?: ReactNode;
}

/**
 * Reusable page header with a styled h1 and optional description paragraph.
 *
 * @param {PageHeaderProps} props - Component props.
 *
 * @returns {JSX.Element} The page header block.
 */
export function PageHeader({ title, description }: PageHeaderProps): JSX.Element {
  return (
    <div className="mb-10">
      <h1 className="text-foreground font-bolder text-3xl sm:text-4xl">{title}</h1>
      {description && <p className="text-muted-foreground mt-4 text-lg">{description}</p>}
    </div>
  );
}
