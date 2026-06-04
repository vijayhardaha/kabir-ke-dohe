# Kabir Dohe API

> Access over 2500 authentic couplets (dohe) by Sant Kabir Das through a fast, free RESTful API.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

The Kabir Dohe API serves the timeless wisdom of Sant Kabir Das — one of India's greatest spiritual poets — as structured JSON data. Each doha includes the original Hindi text, English transliteration, detailed meanings, and metadata for tags, categories, and more.

No authentication required. Free to use.

**Base URL:** `https://kabirdoheapi.vercel.app`

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun run test

# TypeScript check
bun run tsc
```

```http
# Fetch all couplets
GET https://kabirdoheapi.vercel.app/api/couplets

# Search for a couplet
GET https://kabirdoheapi.vercel.app/api/couplets?search_query=balihari%20guru

# Filter by tags
GET https://kabirdoheapi.vercel.app/api/couplets?tags=truth,suffering

# Filter by category
GET https://kabirdoheapi.vercel.app/api/couplets?category=ego-dissolution
```

Full documentation with all parameters, examples, and response formats: **[kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)**

## Features

- **2500+ couplets** with Hindi text, English transliteration, and meanings
- **Full-text search** across couplet content
- **Filter** by tags, categories, popularity, and featured status
- **Sort and paginate** results
- **Edge-runtime** for fast global response times
- **No authentication** required — completely free

## Tech Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Next.js 16      | API routes & documentation site |
| TypeScript      | Type safety (strict mode)       |
| Supabase        | PostgreSQL database             |
| Zod             | Request validation              |
| React 19        | UI (documentation frontend)     |
| Tailwind CSS v4 | Styling                         |
| Vitest          | Testing                         |
| Bun             | Package manager & runtime       |

## Project Structure

```
api/
├── src/
│   ├── app/
│   │   ├── api/couplets/       # API route handlers
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Documentation homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── ui/                 # CodeBlock, CopyButton
│   │   └── docs/               # Documentation page sections
│   ├── constants/              # SEO, API params
│   └── lib/
│       ├── server/             # Server-only (db, env, utils)
│       └── utils/              # Client-safe utilities
├── scripts/                    # Database sync & utility scripts
├── supabase/                   # Migrations & config
├── docs/                       # Contribution guides
└── public/                     # Static assets
```

## API Reference

### Endpoints

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/couplets`        | Fetch couplets with filters |
| GET    | `/api/couplets/search` | Search couplets by text     |

### Query Parameters

| Parameter        | Type      | Default  | Description                            |
| ---------------- | --------- | -------- | -------------------------------------- |
| `search_query`   | `string`  | `''`     | Keyword search across couplets         |
| `search_content` | `boolean` | `false`  | Include meaning fields in search       |
| `tags`           | `string`  | `''`     | Filter by comma-separated tags         |
| `category`       | `string`  | `''`     | Filter by category slug                |
| `is_popular`     | `boolean` | `false`  | Filter popular couplets                |
| `is_featured`    | `boolean` | `false`  | Filter featured couplets               |
| `sort_by`        | `string`  | `number` | Sort field (`number`, `popular`, etc.) |
| `sort_order`     | `string`  | `asc`    | Sort direction (`asc` or `desc`)       |
| `page`           | `number`  | `1`      | Page number                            |
| `per_page`       | `number`  | `10`     | Results per page                       |
| `pagination`     | `boolean` | `true`   | Include pagination metadata            |

### Response Format

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "number": 1,
        "slug": "example-slug",
        "text_hi": "हिंदी पाठ",
        "text_en": "English text",
        "meaning_hi": "हिंदी अर्थ",
        "meaning_en": "English meaning",
        "category": { "name": "Category", "slug": "category-slug" },
        "tags": [{ "slug": "tag-slug", "name": "Tag Name" }],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 2500,
    "totalPages": 250,
    "page": 1,
    "per_page": 10,
    "pagination": true
  }
}
```

## Development

### Commands

```bash
bun run dev              # Start dev server
bun run build            # Build for production
bun run test             # Run tests
bun run test:watch       # Run tests in watch mode
bun run test:coverage    # Run tests with coverage
bun run tsc              # TypeScript type check
bun run lint             # Lint code
bun run lint:fix         # Fix lint issues
bun run format           # Format with Prettier
bun run sync             # Sync data from Google Sheets
```

### Environment Variables

Required variables (see `.env.example`):

| Variable                           | Description            |
| ---------------------------------- | ---------------------- |
| `SUPABASE_URL`                     | Supabase project URL   |
| `SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL`             | Public site URL        |

## Database

The project uses Supabase (PostgreSQL). Migrations are in `supabase/migrations/`.

```bash
supabase migration new <name>
```

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute.

## License

MIT License. See [LICENSE](../LICENSE) for details.
