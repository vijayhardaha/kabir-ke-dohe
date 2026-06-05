# AGENTS.md

> **This file serves as the authoritative reference for AI agents working on the `kabir-hub` codebase.**

## Project Overview

**kabir-hub** is a monorepo containing three packages related to Kabir Das's dohas (couplets):

| Package                  | Path           | Description                                               |
| ------------------------ | -------------- | --------------------------------------------------------- |
| `@kabir-hub/api`         | `api/`         | RESTful API + documentation frontend for Kabir's couplets |
| `@kabir-hub/web`         | `web/`         | Web application for reading and learning Kabir's couplets |
| `@kabir-hub/images-tool` | `images-tool/` | Image generation tool for visual quotes                   |

### What This Project Provides

- **Couplets API**: REST-based endpoints for retrieving and searching Kabir's dohas with transliteration, translation, and metadata
- **Search API**: Full-text search across couplets with query parameters for filtering
- **Documentation Site**: Interactive API documentation with examples, response formats, and usage guides

### Root-Level Config (Shared)

- **Prettier** — `prettier.config.mjs` (root)
- **Commitlint** — `commitlint.config.mjs` (root)
- **ESLint** — `eslint.config.mjs` (root)
- **VS Code** — `.vscode/settings.json` (root)
- **Husky** — `.husky/` (root)

### Tech Stack (`api/`)

- **Type**: Next.js 16 API (App Router)
- **Lang**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **UI**: React 19 + Tailwind CSS v4
- **Testing**: Vitest
- **Package Manager**: Bun (workspaces)

## Project Architecture (`api/`)

```
api/
├── src/
│   ├── app/                    # Next.js App Router - routing only
│   │   ├── api/               # API routes
│   │   │   ├── couplets/
│   │   │   │   ├── route.ts   # GET all couplets
│   │   │   │   └── search/
│   │   │   │       └── route.ts # GET search couplets
│   │   │   └── route.ts       # Root API endpoint
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Documentation home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/
│   │   ├── layout/            # Site shell components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── __tests__/
│   │   ├── ui/                # Reusable UI primitives
│   │   │   ├── CodeBlock.tsx      # Code display with syntax highlighting
│   │   │   ├── CopyButton.tsx     # Copy to clipboard button
│   │   │   └── __tests__/
│   │   └── docs/              # Documentation page sections
│   │       ├── index.tsx          # Barrel export
│   │       ├── ApiEndpoints.tsx
│   │       ├── ErrorResponse.tsx
│   │       ├── Examples.tsx
│   │       ├── Introduction.tsx
│   │       ├── QueryParameters.tsx
│   │       ├── ResponseFormat.tsx
│   │       ├── SEOContent.tsx
│   │       ├── UsageExamples.tsx
│   │       └── __tests__/
│   │
│   ├── constants/             # Project-wide constants
│   │   ├── api-params.ts
│   │   └── seo.ts
│   │
│   ├── lib/
│   │   ├── server/            # Server-only (NEVER import in client)
│   │   │   ├── supabase.ts    # Supabase client singleton
│   │   │   ├── env.ts         # Server environment variables
│   │   │   └── utils/         # Server utilities
│   │   │       ├── api-error.ts       # ApiError class
│   │   │       ├── error-handler.ts   # Response helpers + error handlers
│   │   │       ├── string.ts          # String sanitization & formatting
│   │   │       ├── index.ts           # Barrel export
│   │   │       └── __tests__/
│   │   │
│   │   └── utils/             # Client-safe utilities
│   │       ├── classnames.ts  # cn() utility
│   │       ├── schema.ts      # Zod schemas & Schema.org builders
│   │       ├── seo.ts         # SEO utilities (siteUrl, cleanPath, getPermaLink)
│   │       └── __tests__/
│   │
│   └── proxy.ts               # Proxy configuration
│
├── scripts/                   # Database sync & utility scripts
├── supabase/                  # Supabase migrations & config
├── docs/                      # Contribution docs
├── public/                    # Static assets
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## Available Commands

```bash
# Development (from root)
bun run dev              # Start api dev server (bun run --filter=api dev)

# Build
bun run build            # Build api for production (bun run --filter=api build)

# Linting & Formatting (root-level, applies to all packages)
bun run lint             # Lint api (bun run --filter=api lint)
bun run lint:fix         # Fix auto-fixable issues
bun run format           # Format files (Prettier)
bun run format:check     # Check formatting

# Type Checking
bun run tsc              # TypeScript type check (bun run --filter=api tsc)

# Testing
bun run test             # Run api tests (bun run --filter=api test)
bun run test:watch       # Run api tests in watch mode

# Workspace-specific commands
bun run --filter=api dev              # Start api dev server
bun run --filter=api test:coverage    # Run api tests with coverage
bun run --filter=api sync             # Sync data to api

# Database (from api/)
cd api && supabase migration new <name>
```

## Utils Knowledge Base (`api/src/lib/`)

### Client-Safe (`api/src/lib/utils/`)

**`classnames.ts`**

- `cn()` — Combines Tailwind classes conditionally

**`seo.ts`**

- `siteUrl()` — Returns the site URL
- `cleanPath(path)` — Normalizes a path slug
- `getPermaLink(path)` — Generates a permalink URL

**`schema.ts`**

- `globalSchema()` — Returns Person, Organization, and WebSite Schema.org graph

### Server (`api/src/lib/server/`)

**`env.ts`**

- `env` — Validated server environment variables (lazy access)

**`supabase.ts`**

- `supabase` — Lazy-initialized Supabase client singleton

### Server (`api/src/lib/server/utils/`)

**`string.ts`**

- `sanitize(str, sep)` — Normalizes string to slug
- `sanitizeKey(string)` — Sanitizes a key value (snake_case)
- `sanitizeTitle(string)` — Sanitizes a title (kebab-case)
- `toSentenceCase(str)` — Converts string to sentence case

**`error-handler.ts`**

- `success(data)` — Returns 200 OK response
- `successCached(data)` — Returns 200 with cache headers
- `failure(msg, status)` — Returns error response
- `handleError(error)` — Generic error handler
- `handleRouteError(error)` — Route-specific error handler (handles Zod errors)

**`api-error.ts`**

- `ApiError` — Custom error class with `statusCode` and `isOperational`

## Response Helpers

```typescript
import { success, successCached, failure } from "@/lib/server/utils";

return success(data); // 200 OK
return successCached(data); // 200 + cache headers
return failure("Error", 400); // Error response
```

## Supabase

- **Singleton**: `import { supabase } from '@/lib/server/supabase'`
- Select specific columns (no `SELECT *`)
- Use Row Level Security (RLS)
- Never expose service role key

## Validation (Zod)

```typescript
const Schema = z.object({ title: z.string().min(5), content: z.string().min(10) });
```

## Common Patterns

**Default params with `as const`:**

```typescript
const DEFAULT_PARAMS = { search_query: "", limit: 10 } as const;
```

**Zod query params with defaults:**

```typescript
const QuerySchema = z.object({
  search_query: z.string().optional().default(""),
  limit: z.coerce.number().optional().default(10)
});
type QueryParams = z.infer<typeof QuerySchema>;
```

**ApiError usage:**

```typescript
import { ApiError } from "@/lib/server/utils";

throw new ApiError("Not found", 404);
```

## Coding Conventions

### Server/Client Boundary

- `src/lib/server/` — Server-only (database, env, server utils). **NEVER import in client components.**
- `src/lib/utils/` — Client-safe (seo, schema, classnames).

### Comments

#### JSDoc (for exported functions, types, interfaces, and scripts)

```ts
/**
 * Converts arbitrary text into a normalized slug.
 *
 * @param {string} string - Source text that may include accents and symbols.
 * @param {string} [separator="-"] - Replacement character between slug segments.
 * @returns {string} Lowercase slug stripped to URL-safe characters.
 * @throws {Error} When input is empty after sanitization.
 * @example
 * sanitize("Hello World!"); // "hello-world"
 */
export function sanitize(string: string, separator = "-"): string { ... }
```

**Skip for**: Obvious props (`className`, `children`), simple interfaces, private/helper functions.

#### Regular Comments

Explain **why**, not what. Capitalize first letter. Place on own line (avoid end-of-line).

```ts
// Cache category results for quick lookups during post sync.
// Transliterate before slugging so accented characters produce stable ASCII output.
```

**Skip for**: Obvious code that explains itself, TODOs without context.

### Naming Conventions

- Components: `PascalCase` (`Button.tsx`)
- Functions/variables: `camelCase` (`getBaseUrl`)
- Files: `kebab-case` (`api-utils.ts`)
- Constants: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`)

### TypeScript

- Strict mode enabled
- Use `interface` for object shapes, `type` for unions/tuples
- NO `any` — use `unknown` instead
- Avoid `!` — prefer optional chaining (`?.`)
- Error handling: `error instanceof Error ? error.message : String(error)`

## Rules

- Use response helpers (`success`, `successCached`, `failure`) for all API responses
- Validate all inputs with Zod schemas
- Use `ApiError` for operational errors with proper status codes
- Select specific columns from Supabase (never `SELECT *`)
- Never import from `src/lib/server/` in client components

## Testing

- Files: `*.test.ts` / `*.test.tsx` next to code they test
- Framework: Vitest
- Run: `bun run test` (watch) · `bun run test:run` (once)

---

# Web Package — Design Preferences (`web/`)

> UI/UX decisions established during development. Agents must follow these.

## Navigation (`web/src/components/layout/Header.tsx`)

### Desktop Nav Structure

- Semantic HTML: `nav > ul > li > a`
- `<nav>` uses `h-full` to stretch to header height; `<ul>` uses `h-full items-stretch` so `<li>` items fill the header
- Stretch height ensures `absolute top-full` dropdowns extend below the header

### Submenu Dropdowns

- **Container**: `bg-white shadow-lg`, no `rounded-md`, no `border`
- **Position**: `right-0` (not `left-0`)
- **Width**: `w-max min-w-105`
- **Columns**: `grid grid-cols-3 gap-1 p-2`
- **No fixed height / no scroll** — content determines size

### Submenu Link Colors

- **Default**: `text-foreground`
- **Hover**: `text-primary`
- **Active (current page)**: `text-primary font-semibold`
- No background highlight on hover — color change only
- Items with children show a `ChevronDown` icon with `group-hover:rotate-180`

### Mobile Nav

- Submenu items are indented with `ml-4 border-l pl-3`
- Parent link with children does not close the menu on click (`onClick={() => !hasChildren ? setMenuOpen(false) : undefined}`)

## Icons

- **Library**: `lucide-react`
- **Pattern**: Use the `size` prop (e.g. `size={16}`) rather than `className="size-4"`
- Icons used: `ChevronLeft`, `ChevronRight`, `ChevronDown`, `ArrowRight`, `Share2`

## Pagination (`web/src/components/ui/Pagination.tsx`)

- Shows start/end items: "Showing 21–30 of 2295 results"
- **Previous/Next**: Icons only (`ChevronLeft`/`ChevronRight`), no text
- **Default page buttons**: `bg-secondary text-secondary-foreground`
- **Active page**: `bg-primary text-primary-foreground`
- **Alignment**: `sm:justify-start` (left-aligned)
- **Hover decoration**: removed (`hover:no-underline`)

## Categories Page (`web/src/app/categories/page.tsx`)

- Cards: `bg-card`, no `rounded-xl`, no `border`, `hover:shadow-xl`
- Browse button: no `rounded-lg`
- Grid: `sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Empty categories: `opacity-60` in a "Coming Soon" section

## Tags Page (`web/src/app/tags/page.tsx`)

- **Layout**: A–Z grouped directory style, 3-column grid (`sm:grid-cols-2 lg:grid-cols-3`)
- **Jump nav**: Letter buttons at the top that link to `#tag-group-{letter}` sections
- **Each section**: Letter heading + list of tag links
- **Tag link colors**: `text-foreground` default, `hover:text-primary`
- **Post count**: Inline number next to each tag name
- **Empty tags**: `text-muted-foreground pointer-events-none`

## Constants (`web/src/constants/`)

- `categories.ts` — 20 predefined categories with slug + name + `getCategoryBySlug()` helper
- `tags.ts` — 10 predefined tags with slug + name + `getTagBySlug()` helper
- `navigation.ts` — `NavLink` interface supports optional `children: NavLink[]` for submenus

## Supabase Queries (`web/src/lib/server/couplets.ts`)

- **Category filter**: Use `!inner` on the join only when filtering: `category:categories!inner(name, slug)`, filter with `.eq('category.slug', slug)`
- **Tag filter**: Use `!inner` on the join only when filtering: `tags:post_tags!inner(tag:tags!inner(id, name, slug))`, filter with `.eq('tags.tag.slug', slug)`
- Without a filter, use standard LEFT JOINs (no `!inner`) to avoid excluding unassigned posts
