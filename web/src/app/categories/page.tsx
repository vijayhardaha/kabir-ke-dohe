import type { JSX } from 'react';

import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { ButtonLink } from '@/components/ui/Button';
import { CATEGORIES } from '@/constants/categories';
import { getCategories } from '@/lib/server/couplets';

/**
 * Categories overview page that displays all predefined categories
 * as cards with their name, description, post count, and a browse button.
 *
 * @returns {Promise<JSX.Element>} The categories listing page.
 */
export default async function CategoriesPage(): Promise<JSX.Element> {
  const dbCategories = await getCategories();

  // Merge DB data (descriptions, counts) with the predefined constants
  const merged = CATEGORIES.map((cat) => {
    const db = dbCategories.find((d) => d.slug === cat.slug);
    return { ...cat, description: db?.description ?? null, post_count: db?.post_count ?? 0 };
  });

  // Sort by post count descending so the richest categories appear first
  merged.sort((a, b) => b.post_count - a.post_count);

  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="श्रेणियाँ (Categories)"
          description="कबीर के दोहों को विषयानुसार देखें — हर श्रेणी उनकी आध्यात्मिक और दार्शनिक शिक्षाओं का एक अनूठा दृष्टिकोण प्रस्तुत करती है (Explore Kabir&rsquo;s dohas organised by theme &mdash; each category offers a unique lens on his spiritual and philosophical teachings)"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {merged
            .filter((c) => c.post_count > 0)
            .map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
        </div>
      </Container>
    </PageLayout>
  );
}

// ---------------------------------------------------------------------------
// Category card sub-component
// ---------------------------------------------------------------------------

/**
 * Props for the {@link CategoryCard} component.
 *
 * @interface CategoryCardProps
 * @property {object} category - The category data to display
 * @property {string} category.slug - URL slug
 * @property {string} category.name - Display name
 * @property {string | null} category.description - Optional description
 * @property {number} category.post_count - Number of published couplets
 */
interface CategoryCardProps {
  category: { slug: string; name: string; description: string | null; post_count: number };
}

/**
 * A single category card for the listing grid.
 *
 * @param {CategoryCardProps} props - Component props.
 *
 * @returns {JSX.Element} The category card.
 */
function CategoryCard({ category }: CategoryCardProps): JSX.Element {
  return (
    <article className="bg-card flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex-1">
        <h2 className="text-foreground text-2xl font-bold">{category.name}</h2>
        {category.description && (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{category.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-medium">
          {category.post_count} {category.post_count === 1 ? 'couplet' : 'couplets'}
        </span>
        <ButtonLink
          href={`/category/${category.slug}`}
          aria-label={`Browse ${category.name} couplets`}
          variant="primary"
          size="sm"
          className="gap-1.5"
        >
          Browse
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </ButtonLink>
      </div>
    </article>
  );
}
