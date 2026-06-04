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

## Project Architecture

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
│   │   └── page.tsx           # Documentation home page
│   │
│   ├── components/
│   │   ├── CodeBlock.tsx      # Code display component
│   │   ├── CopyButton.tsx     # Copy to clipboard button
│   │   ├── Footer.tsx         # Site footer
│   │   ├── Header.tsx         # Site header
│   │   └── docs/              # Documentation components
│   │
│   ├── constants/             # Project-wide constants
│   ├── lib/
│   │   ├── server/            # Server-only (NEVER import in client)
│   │   └── utils/             # Client-safe utilities
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
bun run lint             # Lint all files
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

## Utils Knowledge Base (api/)

### Client-Safe (`api/src/lib/utils/`)

**`classnames.ts`**

- `cn()` — Combines Tailwind classes conditionally

**`seo.ts`**

- `siteUrl()` — Returns the site URL
- `cleanPath(slug)` — Normalizes a path slug
- `getPermaLink(slug)` — Generates a permalink URL

**`schema.ts`**

- `personSchema()` — Builds Schema.org Person entity
- `webApiSchema()` — Builds Schema.org WebAPI entity
- `getFullSchemaGraph()` — Returns complete JSON-LD graph

### Server (`api/src/lib/server/utils/`)

**`string/sanitize.ts`**

- `sanitize(str, sep)` — Normalizes string to slug
- `sanitizeKey()` — Sanitizes a key value
- `sanitizeTitle()` — Sanitizes a title

**`string/formatting.ts`**

- `toSentenceCase(str)` — Converts string to sentence case

**`response/response.ts`**

- `success(data)` — Returns 200 OK response
- `successCached(data)` — Returns 200 with cache headers
- `failure(msg, status)` — Returns error response

**`errors/api-error.ts`**

- `ApiError` — Custom error class with `statusCode` and `isOperational`

**`errors/error-handler.ts`**

- `handleError(error)` — Generic error handler
- `handleRouteError(error)` — Route-specific error handler

## Response Helpers

```typescript
import { success, successCached, failure } from "@/lib/server/utils";

return success(data); // 200 OK
return successCached(data); // 200 + cache headers
return failure("Error", 400); // Error response
```

## Supabase

- **Singleton**: `import { supabase } from '@/lib/server/db/supabase'`
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
