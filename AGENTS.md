# AGENTS.md

> **This file serves as the authoritative reference for AI agents working on the `kabir-hub` codebase.**

## Project Overview

**kabir-hub** is a monorepo containing three packages related to Kabir Das's dohas (couplets):

| Package                  | Path           | Description                                               |
| ------------------------ | -------------- | --------------------------------------------------------- |
| `@kabir-hub/api`         | `api/`         | RESTful API + documentation frontend for Kabir's couplets |
| `@kabir-hub/web`         | `web/`         | Web application for reading and learning Kabir's couplets |
| `@kabir-hub/images-tool` | `images-tool/` | Image generation tool for visual quotes (placeholder)     |

### What This Project Provides

- **Couplets API**: REST-based endpoints for retrieving and searching Kabir's dohas with transliteration, translation, and metadata
- **Search API**: Full-text search across couplets with query parameters for filtering
- **Documentation Site**: Interactive API documentation with examples, response formats, and usage guides
- **Web App**: Browse, search, filter, and share 2500+ couplets with detailed analysis
- **OG Image Pipeline**: Generate, optimize, and upload couplet images to Supabase Storage

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
- **Image Generation**: `node-html-to-image` (Puppeteer) + `sharp`
- **CLI Spinners**: `ora`

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
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   └── __tests__/
│   │   └── docs/              # Documentation page sections
│   │       ├── index.tsx
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
│   │       ├── seo.ts         # SEO utilities
│   │       └── __tests__/
│   │
│   └── proxy.ts               # Proxy configuration
│
├── scripts/                   # CLI scripts
│   ├── lib/                   # Shared script utilities
│   │   ├── env.ts             # Script env loader (dotenv + Zod)
│   │   ├── supabase.ts        # Supabase client (service role)
│   │   ├── db.ts              # Database upsert helpers
│   │   ├── gsheet.ts          # Google Sheets reader
│   │   └── slug.ts            # Slugify utility
│   ├── couplets-fetch.ts      # Fetch slug+text_hi from Supabase → JSON
│   ├── couplets-upload.ts     # Upload Google Sheets data → Supabase
│   ├── indexnow.ts            # IndexNow URL submission
│   ├── images-generate.ts     # Generate OG images via Puppeteer
│   ├── images-optimize.ts     # Compress JPEG → WebP via sharp
│   ├── images-upload.ts       # Upload WebP to Supabase Storage
│   ├── template-serve.ts      # Dev server for template (Browsersync :2580)
│   ├── output/
│   │   ├── data/
│   │   │   └── couplets.json  # Slug → text_hi map
│   │   └── images/
│   │       ├── original/      # Generated JPEG originals (1200×630)
│   │       └── optimized/     # Sharp-compressed WebP (quality 85)
│   └── templates/
│       ├── quote-card.hbs     # OG image HTML template
│       └── backgrounds/
│           └── sample-bg.jpg  # Background image for template
├── supabase/                  # Supabase migrations & config
├── docs/                      # Contribution docs
├── public/                    # Static assets
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## Project Architecture (`web/`)

```
web/src/
├── app/                       # Next.js App Router pages
│   ├── api/couplets/view/     # View tracking POST endpoint
│   ├── couplet/[slug]/        # Single couplet detail page
│   ├── couplets/[page]/       # Paginated couplet listing
│   ├── category/[slug]/       # Category filter pages
│   ├── tag/[slug]/            # Tag filter pages
│   ├── popular-couplets/      # Popular collection
│   ├── featured-couplets/     # Featured collection
│   ├── categories/            # Category directory
│   ├── tags/                  # Tag A–Z directory
│   ├── search/                # Full-text search
│   ├── about/                 # About page
│   ├── privacy/               # Privacy policy
│   ├── terms/                 # Terms of service
│   └── layout.tsx
├── components/
│   ├── layout/                # Header, Footer, Container, PageHeader, PageLayout
│   ├── features/archive/      # ArchiveListing, PostCard, CoupletImage, etc.
│   ├── features/ViewTracker.tsx # Client view tracking trigger
│   ├── ui/                    # Button, Combobox, Input, Pagination
│   └── widgets/               # Sidebar widgets
├── lib/
│   ├── server/                # Server-only (never import in client)
│   │   ├── couplets.ts        # All DB queries (getCouplets, getCoupletBySlug, etc.)
│   │   ├── supabase.ts        # Supabase client singleton (anon key)
│   │   ├── env.ts             # Server env vars
│   │   └── page-utils.ts      # Pagination + sort param helpers
│   └── utils/                 # Client-safe utilities
│       ├── og-image.ts        # getOgImageUrl(slug) → Storage URL
│       ├── seo.ts             # siteUrl(), getPermaLink()
│       ├── doha.tsx           # formatDoha() – splits at danda
│       ├── fonts.ts
│       ├── cn.ts
│       ├── meta.ts            # buildMetadata() for Next.js Metadata
│       └── schema.ts          # Schema.org builders
├── constants/
│   ├── categories.ts          # 20 predefined categories
│   ├── navigation.ts          # NavLink with children for dropdowns
│   └── ...other constants
└── types/
    └── index.ts               # Post, Category, Tag, PaginationMeta, etc.
```

## Available Commands

### Root Level

```bash
bun run dev              # Start API + web dev servers
bun run build            # Build API + web for production
bun run lint             # Lint all packages
bun run lint:fix         # Auto-fix lint issues
bun run tsc              # TypeScript type check (all packages)
bun run format           # Format files with Prettier
bun run format:check     # Check formatting
```

### API Data Pipeline (from `api/`)

```bash
# Couplet data
bun run couplets:fetch              # Fetch slug+text_hi from Supabase → output/data/couplets.json
bun run couplets:fetch              # Fetch from Supabase
bun run couplets:fetch:prod         # Production mode
bun run couplets:upload             # Sync Google Sheets → Supabase
bun run couplets:upload:prod        # Production mode

# OG image pipeline
bun run couplets:images --all       # Generate JPEG for all couplets
bun run couplets:images <slug>      # Generate for a single slug
bun run couplets:images:optimize    # Compress JPEG → WebP (sharp, q85)
bun run couplets:images:upload      # Upload WebP to Supabase Storage
bun run couplets:images:upload:prod # Upload to production bucket

# Template dev server
bun run couplets:template:serve     # Start Browsersync on :2580, watch .hbs
```

### Web Package

```bash
bun run dev              # Start web dev server
bun run build            # Build for production
bun run tsc              # Type check
bun run lint             # Lint
bun run lint:fix         # Auto-fix
bun run test             # Run tests
bun run test:watch       # Tests in watch mode
```

## API Utils Knowledge Base (`api/src/lib/`)

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

- `supabase` — Lazy-initialized Supabase client singleton (anon key)

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

## Script Utils (`api/scripts/lib/`)

**`env.ts`**

- `loadScriptEnv()` — Loads `.env.local` or `.env.production` via dotenv + Zod validation. Requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SERVICE_ACCOUNT_BASE64`, `GOOGLE_SHEET_ID`.

**`supabase.ts`**

- `createSupabaseClient(env)` — Creates Supabase client with service role key (for write access in scripts).

**`db.ts`**

- `upsertCategories()` — Batch upsert categories
- `upsertTags()` — Batch upsert tags
- `upsertPosts()` — Batch upsert posts
- `upsertPostTags()` — Batch upsert post-tag mappings

## Response Helpers

```typescript
import { success, successCached, failure } from "@/lib/server/utils";

return success(data); // 200 OK
return successCached(data); // 200 + cache headers
return failure("Error", 400); // Error response
```

## Supabase

- **API docs site**: `import { supabase } from '@/lib/server/supabase'` (anon key)
- **Scripts**: `createSupabaseClient(env)` from `scripts/lib/supabase.ts` (service role key)
- **RLS**: Select policies for anon; write operations through RPC functions or service role
- **Storage bucket**: `couplet-images` for OG images (public reads)
- **View counting**: RPC `increment_couplet_view(p_slug)` with SECURITY DEFINER
- Select specific columns (no `SELECT *`)
- `!inner` join only when filtering (avoids excluding unassigned rows)

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

**Graceful error handling (Supabase fetch):**

All DB fetch functions in `web/src/lib/server/couplets.ts` handle errors gracefully:

- Return empty arrays / `null` instead of throwing
- Log errors with `console.error`

## Image Script Conventions

All image scripts (`images-generate.ts`, `images-optimize.ts`, `images-upload.ts`) follow these patterns:

- **Shebang**: `#!/usr/bin/env bun`
- **Spinners**: `ora` library for progress feedback
- **Error handling**: `main().catch()` with `process.exit(1)`
- **Path resolution**: `import.meta.dirname` + `resolve()`
- **CLI args**: `images-generate.ts` accepts `--all` or a single slug

**Paths:**

```
scripts/output/images/original/{slug}.jpg    # Generated originals
scripts/output/images/optimized/{slug}.webp  # Sharp-compressed WebP
```

## Template Dev Server

- **Script**: `template-serve.ts` — watches `templates/quote-card.hbs`, compiles to `templates/index.html`, serves via Browsersync
- **Port**: 2580 (serves the entire `templates/` directory including `backgrounds/`)
- **Background image URL**: `http://localhost:2580/backgrounds/sample-bg.jpg`
- **Prerequisite**: Run `bun run couplets:template:serve` before running `couplets:images` for background image rendering

## Puppeteer Config

- **File**: `api/puppeteer.config.mjs` — auto-discovered by Puppeteer at runtime
- **Config**: Enables Chrome and Firefox downloads for `node-html-to-image`
- **Chrome auto-detection**: `images-generate.ts` checks `PUPPETEER_EXECUTABLE_PATH` env var, then local `.cache/puppeteer/`, then global `~/.cache/puppeteer/`

## View Tracking

- **Cookie**: `kabirhub_views` (1-day, httpOnly)
- **Structure**: `{ h: hash(ip+ua), v: [slug1, slug2] }`
- **API**: `POST /api/couplets/view` with `{ slug }` body
- **Component**: `<ViewTracker slug={post.slug} />` — client component, fires on mount
- **RPC**: `increment_couplet_view(p_slug)` — atomically updates `posts.view_count`

## Coding Conventions

### Server/Client Boundary

- `src/lib/server/` — Server-only (database, env, server utils). **NEVER import in client components.**
- `src/lib/utils/` — Client-safe (seo, schema, classnames, og-image).

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
```

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

## PostCard (`web/src/components/features/archive/PostCard.tsx`)

- OG image fetched from Supabase Storage via `<CoupletImage slug={post.slug} text={post.text_hi} />`
- Doha heading links to single page
- Author + tags metadata row
- Optional meaning block (Hindi + English)
- Read More + Share action buttons

## CoupletImage (`web/src/components/features/archive/CoupletImage.tsx`)

- Client component
- Gets OG image URL from `getOgImageUrl(slug)` in `web/src/lib/utils/og-image.ts`
- Uses `next/image` with `onError` — hides silently on 404
- Returns empty fragment when no image (no placeholder)
- Wraps in link to `/couplet/{slug}`
- Container: `aspect-[120/63]`

## ArchiveListing

- WordPress-loop-inspired pattern
- Injects spiritual messages (`KABIR_MESSAGES`) after every 2 posts
- Sort dropdown + `ResultCount` toolbar
- `ContentNone` empty state
- Pagination below posts
- Optional sidebar

## Constants (`web/src/constants/`)

- `categories.ts` — 20 predefined categories with slug + name + `getCategoryBySlug()` helper
- `navigation.ts` — `NavLink` interface supports optional `children: NavLink[]` for submenus

## Supabase Queries (`web/src/lib/server/couplets.ts`)

- **Category filter**: Use `!inner` on the join only when filtering: `category:categories!inner(name, slug)`, filter with `.eq('category.slug', slug)`
- **Tag filter**: Use `!inner` on the join only when filtering: `tags:post_tags!inner(tag:tags!inner(id, name, slug))`, filter with `.eq('tags.tag.slug', slug)`
- Without a filter, use standard LEFT JOINs (no `!inner`) to avoid excluding unassigned posts
- All functions return gracefully (empty arrays / null) on error instead of throwing

## OG Image URL (`web/src/lib/utils/og-image.ts`)

```typescript
getOgImageUrl(slug: string): string | null
```

Returns `{SUPABASE_URL}/storage/v1/object/public/couplet-images/{slug}.webp` or `null` if env var missing.
