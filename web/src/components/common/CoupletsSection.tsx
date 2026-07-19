import type { JSX, ReactNode } from 'react';

import { RiArrowRightLine, RiDoubleQuotesL } from 'react-icons/ri';

import QuoteCard from '@/components/features/QuoteCard';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/Button';
import type { Post } from '@/types';

/**
 * Props for the CoupletsSection component.
 *
 * @type {CoupletsSectionProps}
 * @property {string} [sectionClassName] - Optional CSS class for the outer section wrapper.
 * @property {ReactNode} title - Heading content (can include styled spans).
 * @property {string} description - Subtitle text below the heading.
 * @property {string} href - Link target for the "View All" button.
 * @property {Post[]} couplets - Array of couplet posts to display as cards.
 * @property {{ message: string; variant: 'primary' | 'secondary' }} [wisdomQuote] - Optional wisdom quote rendered below the grid.
 */
export interface CoupletsSectionProps {
  sectionClassName?: string;
  title: ReactNode;
  description: string;
  href: string;
  couplets: Post[];
  wisdomQuote?: { message: string; variant: 'primary' | 'secondary' };
}

/**
 * Reusable homepage section featuring a section header, a 2-column QuoteCard grid,
 * and an optional wisdom quote banner.
 *
 * @param {CoupletsSectionProps} props - Component props.
 *
 * @returns {JSX.Element} The section element.
 */
export function CoupletsSection({
  sectionClassName,
  title,
  description,
  href,
  couplets,
  wisdomQuote,
}: CoupletsSectionProps): JSX.Element {
  const content = (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div>
          <ButtonLink variant="outline-primary" size="sm" href={href}>
            View All <RiArrowRightLine size={14} />
          </ButtonLink>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {couplets.map((post, idx) => (
          <QuoteCard
            key={post.id}
            slug={post.slug}
            text_hi={post.text_hi}
            meaning_hi={post.meaning_hi}
            category={post.category}
            index={idx + 1}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      {sectionClassName ? (
        <section className={sectionClassName}>
          <Container className="py-16">{content}</Container>
        </section>
      ) : (
        <Container className="py-16">{content}</Container>
      )}

      {wisdomQuote && (
        <section className={wisdomQuote.variant === 'primary' ? 'bg-primary' : 'bg-secondary'}>
          <Container className="py-12 md:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <RiDoubleQuotesL
                size={72}
                className={`mx-auto mb-4 ${wisdomQuote.variant === 'primary' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}
                aria-hidden="true"
              />
              <p
                className={`text-lg leading-relaxed font-semibold md:text-xl ${
                  wisdomQuote.variant === 'primary' ? 'text-primary-foreground' : 'text-secondary-foreground'
                }`}
              >
                &ldquo;{wisdomQuote.message}&rdquo;
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
