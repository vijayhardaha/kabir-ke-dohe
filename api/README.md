# Kabir Dohe API

> RESTful API for Kabir Das's couplets (dohas), with a built-in documentation site.

**Live:** [kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)  
**Base URL:** `https://kabirdoheapi.vercel.app/api`

---

## Table of Contents

- [Endpoints](#endpoints)
- [Scripts & Pipelines](#scripts--pipelines)
- [Architecture](#architecture)
- [Development](#development)
- [Environment Variables](#environment-variables)

---

## Endpoints

### `GET /api/couplets`

Returns a paginated list of published couplets.

**Query Parameters:**

| Param          | Type    | Default      | Description                                        |
| -------------- | ------- | ------------ | -------------------------------------------------- |
| `page`         | number  | `1`          | Page number (1-based)                              |
| `per_page`     | number  | `10`         | Items per page (max 100)                           |
| `category`     | string  | —            | Filter by category slug                            |
| `tag`          | string  | —            | Filter by tag slug                                 |
| `search_query` | string  | —            | Full-text search across `text_hi` and `text_en`    |
| `is_popular`   | boolean | —            | Filter popular couplets only                       |
| `is_featured`  | boolean | —            | Filter featured couplets only                      |
| `sort_by`      | string  | `post_order` | Sort field (`post_order`, `text_hi`, `view_count`) |
| `sort_order`   | string  | `asc`        | Sort direction (`asc`, `desc`)                     |

**Response:**

```json
{
  "posts": [ { "id": "...", "slug": "...", "text_hi": "...", ... } ],
  "pagination": { "page": 1, "perPage": 10, "total": 2500, "totalPages": 250 }
}
```

### `GET /api/couplets/search`

Full-text search across couplets.

**Query Parameters:**

| Param          | Type   | Default | Description           |
| -------------- | ------ | ------- | --------------------- |
| `search_query` | string | `""`    | Search term           |
| `limit`        | number | `10`    | Max results (max 100) |

### `GET /api`

Root endpoint returns API metadata and available routes.

---

## Scripts & Pipelines

All scripts live in `api/scripts/` and are run via `bun run <script>` from the `api/` directory.

### Couplet Data Pipeline

```bash
# 1. Fetch published couplets from Supabase → output/data/couplets.json
bun run couplets:fetch

# 2. Upload couplets from Google Sheets to Supabase
bun run couplets:upload
```

- `couplets:fetch` — Queries `posts` table for published couplets, writes `{ slug: text_hi }` to `scripts/output/data/couplets.json`
- `couplets:upload` — Pulls data from Google Sheets and upserts into Supabase (categories, tags, posts, post-tag mappings in batches of 400)
- `indexnow` — Sends IndexNow notifications for search engine indexing

### OG Image Pipeline

```bash
# 1. Generate JPEG originals (1200×630) from couplets data
bun run couplets:images --all          # all couplets
bun run couplets:images <slug>         # single couplet

# 2. Optimize originals to WebP via sharp (quality 85)
bun run couplets:images:optimize

# 3. Upload optimized WebP images to Supabase Storage
bun run couplets:images:upload
bun run couplets:images:upload:prod    # production .env
```

**Directory structure:**

```
scripts/
├── output/
│   ├── data/
│   │   └── couplets.json          # Key-value map: slug → text_hi
│   └── images/
│       ├── original/{slug}.jpg    # 1200×630 JPEG (generated via Puppeteer)
│       └── optimized/{slug}.webp  # Sharp-compressed WebP (quality 85)
├── templates/
│   ├── quote-card.hbs             # Handlebars template for OG images
│   └── backgrounds/
│       └── sample-bg.jpg          # Background image for template
│   └── index.html                 # Compiled dev preview (auto-generated)
└── ... scripts
```

### Script Reference

| Script               | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `couplets-fetch.ts`  | Fetch slug + text_hi from Supabase → JSON map                  |
| `couplets-upload.ts` | Sync Google Sheets data → Supabase (categories, tags, posts)   |
| `indexnow.ts`        | IndexNow URL submission                                        |
| `images-generate.ts` | Generate OG images via `node-html-to-image` + Puppeteer        |
| `images-optimize.ts` | Compress JPEG originals to WebP via `sharp`                    |
| `images-upload.ts`   | Upload WebP images to Supabase Storage `couplet-images` bucket |
| `template-serve.ts`  | Dev server (Browsersync :2580), watches .hbs, live-reload      |

All image scripts use `ora` spinners for progress feedback.

---

## Architecture

```
api/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API route handlers
│   │   │   ├── couplets/
│   │   │   │   ├── route.ts    # GET /api/couplets
│   │   │   │   └── search/     # GET /api/couplets/search
│   │   │   └── route.ts        # GET /api (root metadata)
│   │   ├── layout.tsx          # Root layout (docs site)
│   │   ├── page.tsx            # Documentation home page
│   │   └── globals.css         # Tailwind globals
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── ui/                 # CodeBlock, CopyButton
│   │   └── docs/               # Documentation page sections
│   ├── constants/              # API params, SEO config
│   ├── lib/
│   │   ├── server/             # Server-only code
│   │   │   ├── supabase.ts     # Supabase client (anon key)
│   │   │   ├── env.ts          # Server env vars (lazy)
│   │   │   └── utils/          # ApiError, error-handler, string utils
│   │   └── utils/              # Client-safe: classnames, seo, schema
│   └── proxy.ts                # Proxy config
├── scripts/
│   ├── lib/                    # Shared script utilities
│   │   ├── env.ts              # Script env loader (dotenv + Zod)
│   │   ├── supabase.ts         # Supabase client (service role)
│   │   ├── db.ts               # Database upsert helpers
│   │   ├── gsheet.ts           # Google Sheets reader
│   │   └── slug.ts             # Slugify utility
│   ├── output/
│   │   ├── data/
│   │   │   └── couplets.json   # Slug → text_hi map
│   │   └── images/
│   │       ├── original/       # Generated JPEG originals
│   │       └── optimized/      # Sharp-compressed WebP
│   └── templates/
│       ├── quote-card.hbs      # OG image HTML template
│       └── backgrounds/
│           └── sample-bg.jpg   # Background image for template
├── supabase/
│   └── migrations/             # SQL migrations
├── docs/                       # Contribution docs
└── public/                     # Static assets
```

## Development

```bash
cd api

# Start dev server
bun run dev

# Build for production
bun run build

# Type check
bun run tsc

# Lint
bun run lint
bun run lint:fix

# Test
bun run test
bun run test:watch
bun run test:coverage

# Database migration (requires Supabase CLI)
supabase migration new <name>
```

### Adding a Migration

```bash
cd api
supabase migration new my_migration_name
# Edit the generated .sql file
supabase db push
```

## Environment Variables

### Scripts (`.env.local` / `.env.production`)

| Variable                        | Description                    |
| ------------------------------- | ------------------------------ |
| `SUPABASE_URL`                  | Supabase project URL           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key (scripts)     |
| `GOOGLE_SERVICE_ACCOUNT_BASE64` | Base64-encoded service account |
| `GOOGLE_SHEET_ID`               | Google Sheet ID                |
| `NODE_ENV`                      | `development` or `production`  |

### API Server (`.env.local`)

| Variable                                       | Description          |
| ---------------------------------------------- | -------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Anon/publishable key |

## Key Conventions

- **API responses** use `success()`, `successCached()`, `failure()` helpers from `@/lib/server/utils`
- **Input validation** via Zod schemas on all endpoints
- **Supabase queries** select specific columns (no `SELECT *`)
- **RLS** enabled on all tables; anon role has SELECT only
- **Scripts** use service role key for write access
- **Image uploads** use service role key for Storage write access
