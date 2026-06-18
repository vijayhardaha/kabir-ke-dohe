# Kabir Dohe Tools

> CLI tools for data sync, image generation, and maintenance of the Kabir Dohe
> ecosystem — used by `@kabir-dohe-hub/api` and `@kabir-dohe-hub/web`.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Data Pipeline](#data-pipeline)
- [OG Image Pipeline](#og-image-pipeline)
- [Template Development](#template-development)

---

## Quick Start

```bash
# Install dependencies (from monorepo root)
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase and Google Sheets credentials

# Fetch couplet data
bun run --filter @kabir-dohe-hub/tools couplets:fetch

# Upload data from Google Sheets
bun run --filter @kabir-dohe-hub/tools couplets:upload
```

## Available Commands

### Couplet Data

| Command                                      | Description                                            |
| -------------------------------------------- | ------------------------------------------------------ |
| `couplets:fetch`                             | Fetch published couplets from Supabase → JSON          |
| `couplets:fetch:prod`                        | Same, using `.env.production`                          |
| `couplets:upload`                            | Sync Google Sheets data → Supabase                     |
| `couplets:upload:prod`                       | Same, production mode                                   |

### OG Image Pipeline

| Command                                      | Description                                            |
| -------------------------------------------- | ------------------------------------------------------ |
| `couplets:images --all`                      | Generate JPEG images for all couplets                  |
| `couplets:images <slug>`                     | Generate JPEG for a single couplet                     |
| `couplets:images:optimize`                   | Compress JPEG → WebP (sharp, quality 100)              |
| `couplets:images:upload`                     | Upload WebP to Supabase Storage                        |
| `couplets:images:upload:prod`                | Upload to production bucket                            |

### Tags

| Command                                      | Description                                            |
| -------------------------------------------- | ------------------------------------------------------ |
| `tags:generate`                              | Fetch tags with published post counts → TXT            |
| `tags:generate:prod`                         | Same, production mode                                   |

### Template Dev Server

| Command                                      | Description                                            |
| -------------------------------------------- | ------------------------------------------------------ |
| `couplets:template:serve`                    | Start Browsersync on :2580, live-reload on .hbs edits  |

### Development

| Command                                      | Description                                            |
| -------------------------------------------- | ------------------------------------------------------ |
| `tsc`                                        | TypeScript type check                                  |
| `lint`                                       | Lint source files                                      |
| `lint:fix`                                   | Auto-fix lint issues                                   |
| `test`                                       | Run tests                                              |
| `test:watch`                                 | Tests in watch mode                                    |
| `test:coverage`                              | Run tests with coverage                                |

## Environment Variables

Create `.env.local` (or `.env.production` for production) in the `tools/` directory:

| Variable                        | Description                    |
| ------------------------------- | ------------------------------ |
| `SUPABASE_URL`                  | Supabase project URL           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key (write access) |
| `GOOGLE_SERVICE_ACCOUNT_BASE64` | Base64-encoded service account |
| `GOOGLE_SHEET_ID`               | Google Sheet ID                |
| `NODE_ENV`                      | `development` or `production`  |

Variables are loaded via Bun's `--env-file` flag (handled automatically by
the package scripts).

## Project Structure

```
tools/
├── src/
│   ├── scripts/               # CLI entry points
│   │   ├── couplets-fetch.ts   # Fetch couplets from Supabase
│   │   ├── couplets-upload.ts  # Sync Google Sheets → Supabase
│   │   ├── images-generate.ts  # Generate OG images via Puppeteer
│   │   ├── images-optimize.ts  # Compress JPEG → WebP via sharp
│   │   ├── images-upload.ts    # Upload WebP to Supabase Storage
│   │   ├── tags-generate.ts    # Fetch tags with post counts
│   │   └── template-serve.ts   # Dev server for quote card template
│   ├── lib/                    # Shared utilities
│   │   ├── cli.ts              # Spinner, pagination, error helpers
│   │   ├── colors.ts           # Color palette and variant generation
│   │   ├── db.ts               # Database upsert and delete helpers
│   │   ├── env.ts              # Environment variable loader
│   │   ├── gsheet.ts           # Google Sheets reader + Zod validation
│   │   ├── slug.ts             # Slugify utility
│   │   ├── storage.ts          # File system helpers
│   │   ├── string.ts           # String formatting utilities
│   │   ├── supabase.ts         # Supabase client (service role key)
│   │   └── __tests__/          # Unit tests for lib utilities
│   ├── constants/              # Static data files
│   │   └── category-descriptions.ts
│   ├── types/                  # Shared TypeScript types
│   │   └── index.ts
│   └── __tests__/              # Integration tests for scripts
├── templates/                  # Handlebars templates + CSS for OG images
│   ├── quote-card.hbs          # OG image template
│   ├── card.css                # OG image styles (uses CSS variables)
│   └── index.html              # Compiled preview (generated)
├── dist/                       # Generated output
│   ├── data/                   # Generated data files (couplets.json, tags.txt)
│   └── images/                 # Generated images
│       ├── original/           # Full-quality JPEG originals (1200×630)
│       └── optimized/          # Sharp-compressed WebP (quality 100)
├── package.json                # Package manifest
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
└── eslint.config.mjs           # ESLint configuration
```

## Data Pipeline

### Fetching Couplets

```bash
bun run --filter @kabir-dohe-hub/tools couplets:fetch
```

Fetches all published couplets from Supabase and writes them to
`dist/data/couplets.json` as a `slug → { text, meaning, post_number }` map.

### Uploading from Google Sheets

```bash
bun run --filter @kabir-dohe-hub/tools couplets:upload
```

Reads data from a configured Google Sheet, validates rows with Zod, and
upserts posts, tags, categories, and post-tag mappings into Supabase. Stale
records (present in the DB but not in the incoming data) are automatically
removed.

## OG Image Pipeline

### 1. Generate Images

```bash
bun run --filter @kabir-dohe-hub/tools couplets:images --all
```

Generates 1200×630 JPEG OG images for each couplet using Puppeteer. Each
image uses a color palette derived from the post number, with CSS custom
properties for heading and description colors.

**Options:**
- `--all` — Generate for all couplets
- `--offset N` — Skip first N couplets (use with `--all`)
- `<slug>` — Generate for a single couplet

### 2. Optimize Images

```bash
bun run --filter @kabir-dohe-hub/tools couplets:images:optimize
```

Compresses JPEG originals to WebP using sharp (quality 100, 1200×630).

### 3. Upload Images

```bash
bun run --filter @kabir-dohe-hub/tools couplets:images:upload
bun run --filter @kabir-dohe-hub/tools couplets:images:upload:prod
```

Uploads optimized WebP images to the `couplet-images` Supabase Storage bucket.

## Template Development

```bash
bun run --filter @kabir-dohe-hub/tools couplets:template:serve
```

Starts a Browsersync dev server on port 2580 that watches `templates/quote-card.hbs`
and `templates/card.css` for changes, recompiles automatically, and live-reloads
the browser preview at 1200×630.

## Tech Stack

| Layer             | Technology             |
| ----------------- | ---------------------- |
| Runtime           | Bun                    |
| Language          | TypeScript (strict)    |
| Database          | Supabase (PostgreSQL)  |
| Validation        | Zod                    |
| Image Gen         | Puppeteer + sharp      |
| Template Engine   | Handlebars + juice     |
| Testing           | Vitest                 |
| CLI Feedback      | ora                    |
| Google Sheets     | google-spreadsheet     |
