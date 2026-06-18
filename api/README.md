# Kabir Dohe API

> RESTful API for Kabir Das's couplets (dohas), with a built-in documentation site.

**Live:** [kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)  
**Base URL:** `https://kabirdoheapi.vercel.app/api`

---

## Table of Contents

- [Endpoints](#endpoints)
- [Data Pipeline](#data-pipeline)
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

## Data Pipeline

The data pipeline scripts have been moved to the `tools/` package in the monorepo.
See [tools/README.md](../tools/README.md) for details.

> **Note:** These were previously located at `api/scripts/` and have been extracted
> into the standalone `@kabir-dohe-hub/tools` workspace package.

### Quick Reference

All pipeline commands are now run from the monorepo root:

```bash
# Couplet data
bun run --filter @kabir-dohe-hub/tools couplets:fetch
bun run --filter @kabir-dohe-hub/tools couplets:upload

# OG image pipeline
bun run --filter @kabir-dohe-hub/tools couplets:images --all
bun run --filter @kabir-dohe-hub/tools couplets:images:optimize
bun run --filter @kabir-dohe-hub/tools couplets:images:upload

# Template dev server
bun run --filter @kabir-dohe-hub/tools couplets:template:serve
```

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

### Tools (`.env.development` / `.env.production`)

These are used by the `@kabir-dohe-hub/tools` package. Place the file in the `tools/` directory or pass via `--env-file`:

| Variable                        | Description                    |
| ------------------------------- | ------------------------------ |
| `SUPABASE_URL`                  | Supabase project URL           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key (tools)       |
| `GOOGLE_SERVICE_ACCOUNT_BASE64` | Base64-encoded service account |
| `GOOGLE_SHEET_ID`               | Google Sheet ID                |
| `NODE_ENV`                      | `development` or `production`  |

### API Server (`.env.development`)

| Variable                                       | Description          |
| ---------------------------------------------- | -------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Anon/publishable key |

## Key Conventions

- **API responses** use `success()`, `successCached()`, `failure()` helpers from `@/lib/server/utils`
- **Input validation** via Zod schemas on all endpoints
- **Supabase queries** select specific columns (no `SELECT *`)
- **RLS** enabled on all tables; anon role has SELECT only
- **Tools** use service role key for write access
- **Image uploads** use service role key for Storage write access
