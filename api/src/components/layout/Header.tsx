import type { JSX } from 'react/jsx-runtime';
import { LuArrowUpRight } from 'react-icons/lu';

/**
 * Header component for the documentation page.
 * Displays the title and main heading for the Kabir Dohe API documentation.
 *
 * @returns {JSX.Element} - The rendered header for the documentation page
 */
export default function Header(): JSX.Element {
  return (
    <header className="bg-primary text-primary-foreground py-8">
      <div className="box">
        <h1 className="mb-4 text-5xl font-bold">Kabir Dohe API</h1>

        <p className="text-primary-foreground/90 mb-6 text-base">
          Access over{' '}
          <a href="/api/couplets" target="_blank">
            2500 authentic couplets (dohe)
          </a>{' '}
          by Sant Kabir, one of India&apos;s greatest spiritual poets and philosophers. Kabir Dohe API offers seamless
          integration to fetch, search, and filter Kabir&apos;s timeless wisdom in your web or mobile apps, educational
          platforms, and AI projects.
        </p>

        <div>
          <a href="/api/couplets" className="btn btn-outline-white" target="_blank">
            Try the API
            <LuArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
