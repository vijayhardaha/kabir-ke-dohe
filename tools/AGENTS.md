# AGENTS.md

> **This file serves as the authoritative reference for AI agents working on
> the `@kabir-dohe-hub/tools` package.**

## Package Overview

`@kabir-dohe-hub/tools` provides CLI tools for data synchronization, OG image
generation, and maintenance of the Kabir Dohe ecosystem. It is a workspace
package within the `kabir-dohe-hub` monorepo.

## Project Architecture

```
tools/
├── src/
│   ├── scripts/               # CLI entry points (7 scripts)
│   │   ├── couplets-fetch.ts   # Fetch published couplets → JSON
│   │   ├── couplets-upload.ts  # Google Sheets → Supabase sync
│   │   ├── images-generate.ts  # OG image generation via Puppeteer
│   │   ├── images-optimize.ts  # JPEG → WebP compression via sharp
│   │   ├── images-upload.ts    # WebP upload to Supabase Storage
│   │   ├── tags-generate.ts    # Tags with post counts → TXT
│   │   └── template-serve.ts   # Browsersync dev server
│   ├── lib/                    # Shared utilities
│   │   ├── cli.ts              # Spinner, pagination, error helpers
│   │   ├── colors.ts           # Color palettes and variant generation
│   │   ├── db.ts               # Database upsert/delete helpers
│   │   ├── env.ts              # Environment variable loader
│   │   ├── gsheet.ts           # Google Sheets reader + Zod validation
│   │   ├── slug.ts             # Slugify utility
│   │   ├── storage.ts          # File system helpers
│   │   ├── string.ts           # String formatting utilities
│   │   ├── supabase.ts         # Supabase client factory
│   │   └── __tests__/          # Unit tests (6 test files)
│   ├── constants/
│   │   └── category-descriptions.ts  # Category descriptions (Hindi + English)
│   ├── types/
│   │   └── index.ts            # Zod schemas + types
│   └── __tests__/              # Integration tests
├── templates/                  # Handlebars template + CSS
└── dist/                       # Generated output
    ├── data/                   # couplets.json, tags.txt
    └── images/                 # original/ (JPEG), optimized/ (WebP)
```

## Scripts Reference

### `couplets-fetch.ts`

Fetches published couplets (slug, text_hi, meaning_hi, post_number) from
Supabase and writes to `dist/data/couplets.json` as a slug → entry map.

- Uses `fetchPaginated` (1000 per page) for large datasets
- Validates entries with `CoupletEntrySchema` (Zod)
- Writes JSON with `writeJsonFile`

**Env:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `couplets-upload.ts`

Reads data from Google Sheets, validates with Zod, and upserts into Supabase.
Performs stale record cleanup before inserting.

**Pipeline order:**
1. Load env → create Supabase client
2. Read Google Sheet → validate with `SheetSchema`
3. Delete stale categories, tags, posts
4. Upsert categories (batch 400) → cache results
5. Assign `category_id` to posts from cache
6. Upsert tags (batch 400) → cache results
7. Clear existing post-tag mappings for incoming posts
8. Upsert posts (batch 400) → build tag mappings
9. Upsert post-tag mappings

**Env:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SERVICE_ACCOUNT_BASE64`, `GOOGLE_SHEET_ID`

**Dependencies:** `google-auth-library`, `google-spreadsheet`, `zod`, `ora`

### `images-generate.ts`

Generates 1200×630 OG images using Puppeteer. Reads `dist/data/couplets.json`,
renders each couplet through the `quote-card.hbs` template, and outputs JPEG
to `dist/images/original/`.

- **Batch processing**: 20 images per browser session
- **Color system**: `getPalette(post_number)` → 1 of 10 palettes → `generateVariants()` → heading/description colors injected as CSS custom properties (`--heading-color`, `--description-color`)
- **SVG shades**: 5 progressive shades from background color for decorative shapes
- **Chrome discovery**: `PUPPETEER_EXECUTABLE_PATH` env var → local `tools/.cache/puppeteer/chrome/` → global `~/.cache/puppeteer/chrome/`
- **Shebang**: `#!/usr/bin/env bun` at top
- **Spinner**: `ora` for progress feedback
- **CLI args**: `--all` (all couplets), `--offset N` (skip first N), or single slug

**Output path:** `tools/dist/images/original/{slug}.jpg`

### `images-optimize.ts`

Reads JPEG files from `dist/images/original/`, compresses with sharp (WebP,
quality 100, 1200×630), and writes to `dist/images/optimized/`.

- Exported function: `optimizeImage(input: Buffer): Promise<Buffer>`
- Used in tests via this export

### `images-upload.ts`

Uploads WebP files from `dist/images/optimized/` to the `couplet-images`
Supabase Storage bucket with `upsert: true`.

- **Env:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Mode:** `NODE_ENV` determines `.env.local` (dev) or `.env.production` (prod)

### `tags-generate.ts`

Fetches all tags from Supabase with their published post counts (using
`!inner` joins), validates with `TagResponseSchema`, and writes to
`dist/data/tags.txt` in `name: count` format, sorted alphabetically.

### `template-serve.ts`

Browsersync dev server on port 2580 for template development. Watches
`templates/quote-card.hbs` and `templates/card.css` for changes, recompiles
with juice (CSS inlining), and live-reloads.

- Uses sample doha and sample color palette for preview
- CSS variables injected via inline style on wrapper div

## Lib Utilities

### `cli.ts`

- `initSpinner(text?)` — Creates ora spinner with Ctrl+C handler
- `handleScriptError(spinner, message, error?)` — Displays error and exits
- `fetchPaginated<T>(fetcher, pageSize?)` — Auto-paginates Supabase queries
- `Spinner` type — `ReturnType<typeof ora> | null`

### `colors.ts`

- `COLOR_PALETTES` — 10 predefined background colors
- `getPalette(postNumber)` — Returns palette by modulo (1-based)
- `generateVariants(hex)` — Derives heading (l96%) and description (l88%) colors from background via HSL
- `generateSvgShades(hexColor)` — Returns 5 progressive shades (lightest → base)

### `db.ts`

- `upsertPosts(supabase, posts)` — Batch upsert by `identifier`
- `upsertTags(supabase, tags)` — Batch upsert by `slug`
- `upsertCategories(supabase, categories)` — Batch upsert by `slug`
- `upsertPostTags(supabase, mappings)` — Batch upsert by `post_id,tag_id`
- `clearPostTagsForPosts(supabase, identifiers)` — Clears junction table for given posts
- `deleteStaleRecords(supabase, table, keyColumn, valuesToKeep)` — Removes records NOT in incoming set

**Types:** `DbPost`, `DbTag`, `DbCategory`, `PostTagMapping`

### `env.ts`

- `ScriptEnv` interface — `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SERVICE_ACCOUNT_BASE64`, `GOOGLE_SHEET_ID`
- `loadScriptEnv()` — Reads from `process.env` (Bun's `--env-file` injects before script runs)
- `NODE_ENV` defaults to `'development'` when not set

### `gsheet.ts`

- `sheetToJson(env, sheetName)` — Authenticates via JWT, loads spreadsheet, validates rows with `SheetSchema` (Zod), returns `{ rawPosts, posts, tags, categories }`
- Uses `google-auth-library` JWT and `google-spreadsheet`

**Validation:** `SheetRowSchema` validates each row with Zod preprocessors for
number parsing, boolean coercion, and tag splitting. Transforms include slug
generation and sentence-case normalization.

### `slug.ts`

- `slugifyText(text)` — Converts to lowercase slug: trims, removes non-alphanumeric, collapses whitespace/hyphens/underscores, joins with `-`

### `storage.ts`

- `ensureDir(dirPath)` — Recursive mkdir
- `readFilesWithExtension(dirPath, extension)` — Lists files with matching extension
- `writeJsonFile(filePath, data)` — Writes formatted JSON
- `writeTextFile(filePath, content)` — Writes text content

### `string.ts`

- `toSentenceCase(str)` — Converts string to sentence case (used in Google Sheets tag/category normalization)

### `supabase.ts`

- `createSupabaseClient(env)` — Returns a Supabase client configured with the service role key

## Types (`src/types/index.ts`)

- `TagResponseSchema` (Zod) — Validates tag with nested post_tags → post → post_status
- `TagResponse` — Inferred type
- `CoupletEntrySchema` (Zod) — Validates `{ text, meaning, post_number }`
- `CoupletEntry` — Inferred type

## Path Conventions

All scripts use `import.meta.url` / `__dirname`-relative path resolution:

| Script                 | Resolution Base             | Resolves To                     |
| ---------------------- | --------------------------- | ------------------------------- |
| `couplets-fetch.ts`    | `new URL('../../dist/...')` | `tools/dist/data/couplets.json` |
| `couplets-upload.ts`   | `../constants/...`          | `tools/src/constants/...`       |
| `images-generate.ts`   | `resolve(__dirname, '..', '..', 'dist/...')` | `tools/dist/images/original/` |
| `images-optimize.ts`   | `resolve(__dirname, '..', '..', 'dist/...')` | `tools/dist/images/optimized/` |
| `images-upload.ts`     | `resolve(__dirname, '..', '..', 'dist/...')` | `tools/dist/images/optimized/` |
| `template-serve.ts`    | `resolve(__dirname, '..', '..', 'templates/')` | `tools/templates/` |

## Image Script Conventions

All image scripts follow these patterns:

- **Shebang**: `#!/usr/bin/env bun` (except `couplets-fetch.ts` and `couplets-upload.ts`)
- **Spinners**: `ora` library for progress feedback
- **Ctrl+C handling**: `process.stdin.on('data')` listener for graceful spinner stop
- **Error handling**: `main().catch()` with `process.exit(1)`
- **Path resolution**: `fileURLToPath(import.meta.url)` + `dirname` + `resolve()`
- **Direct execution guard**: `process.argv[1]` check for `images-generate.ts`, `images-optimize.ts`

## Testing

- **Framework**: Vitest
- **Config**: `vitest.config.ts` — `globals: true`, includes `src/**/*.test.ts`
- **Test files**: Located next to source in `src/lib/__tests__/` and `src/__tests__/`

| Test File                    | What It Tests                                        |
| ---------------------------- | ---------------------------------------------------- |
| `lib/__tests__/db.test.ts`   | Upsert functions (posts, tags, categories, mappings) |
| `lib/__tests__/env.test.ts`  | `loadScriptEnv()` environment reading                |
| `lib/__tests__/gsheet.test.ts` | Sheet authentication and validation errors         |
| `lib/__tests__/slug.test.ts` | `slugifyText()` edge cases                           |
| `lib/__tests__/supabase.test.ts` | Supabase client creation (placeholder)           |
| `src/__tests__/images-generate.test.ts` | `findChromeInCache` function             |
| `src/__tests__/images-optimize.test.ts` | `optimizeImage()` function                |

## Conventions

### Coding

- **Strict TypeScript** — `strict` mode enabled, no `any` (use `unknown`)
- **JSDoc** — Required for all exported functions, types, interfaces
- **Naming** — Functions/variables: `camelCase`; constants: `SCREAMING_SNAKE_CASE`
- **Error handling** — `error instanceof Error ? error.message : String(error)`
- **Console** — Use `spinner` / `ora` for user-facing output; `console.error` for unexpected errors

### Supabase

- **Service role key** for write access (never anon key)
- **Select specific columns** — no `SELECT *`
- **Batch operations** with chunking to avoid PostgREST URL length limits
- **Stale record cleanup** before upserting new data
- **Ctrl+C handler** on `process.stdin` for graceful shutdown

### Google Sheets

- **JWT authentication** via base64-encoded service account
- **Row validation** with Zod before transformation
- **Batch processing** (400 records per batch) to avoid rate limiting
- **Production delay**: 10s between batches in production mode
