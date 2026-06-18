# Kabir Dohe Web

> Web application for reading and learning Kabir Das's couplets (dohas).

**Live:** [kabirdohehub.vercel.app](https://kabirdohehub.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Routes](#routes)
- [Architecture](#architecture)
- [Components](#components)
- [View Tracking](#view-tracking)
- [Supabase](#supabase)
- [Development](#development)

---

## Features

- **Browse 2500+ couplets** with pagination, sorting, and filtering
- **Filter by category** — 20 predefined categories (Divine Grace, Social Critique, etc.)
- **Filter by tags** — A–Z tag directory with post counts
- **Full‑text search** across couplet content
- **Couplet detail pages** with Hindi/English meaning, interpretation, philosophical analysis, practical examples, practice guidance, core message, and reflection questions
- **Related couplets** based on shared categories and tags
- **Adjacent navigation** — previous/next couplet browsing
- **Social sharing** — X, WhatsApp, Facebook, Telegram, LinkedIn, Email
- **OG images** — Visual cards from Supabase Storage (WebP optimized)
- **View tracking** — Unique view counting via cookie-based dedup
- **Featured & Popular** — Curated couplet collections
- **Responsive design** — Mobile-first with Tailwind CSS v4

## Routes

### Archive Pages

| Route                       | Description                   |
| --------------------------- | ----------------------------- |
| `/couplets`                 | All couplets (paginated)      |
| `/couplets/{page}`          | Paginated couplet listing     |
| `/category/{slug}`          | Couplets filtered by category |
| `/category/{slug}/{page}`   | Paginated category            |
| `/tag/{slug}`               | Couplets filtered by tag      |
| `/tag/{slug}/{page}`        | Paginated tag                 |
| `/popular-couplets`         | Popular couplets              |
| `/popular-couplets/{page}`  | Paginated popular             |
| `/featured-couplets`        | Featured couplets             |
| `/featured-couplets/{page}` | Paginated featured            |
| `/search`                   | Search results                |
| `/search/{page}`            | Paginated search              |

### Single Pages

| Route             | Description                              |
| ----------------- | ---------------------------------------- |
| `/couplet/{slug}` | Single couplet detail with full analysis |
| `/categories`     | Category directory with post counts      |
| `/tags`           | A–Z tag directory with jump nav          |
| `/about`          | About Sant Kabir Das                     |
| `/privacy`        | Privacy policy                           |
| `/terms`          | Terms of service                         |

### API Routes

| Route                     | Description                  |
| ------------------------- | ---------------------------- |
| `POST /api/couplets/view` | Record a unique couplet view |

## Architecture

```
web/src/
├── app/                          # Next.js App Router
│   ├── api/couplets/view/        # View tracking API (POST)
│   ├── couplet/[slug]/           # Single couplet detail
│   ├── couplets/[page]/          # Paginated couplet listing
│   ├── category/[slug]/          # Category pages
│   ├── tag/[slug]/               # Tag pages
│   ├── popular-couplets/         # Popular collection
│   ├── featured-couplets/        # Featured collection
│   ├── categories/               # Category directory
│   ├── tags/                     # Tag directory
│   ├── search/                   # Full-text search
│   ├── about/                    # About page
│   ├── privacy/                  # Privacy page
│   ├── terms/                    # Terms page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + Tailwind
│
├── components/
│   ├── layout/                   # Shell components
│   │   ├── Header.tsx            # Navigation with dropdowns
│   │   ├── Footer.tsx            # Site footer
│   │   ├── Container.tsx         # Width container
│   │   ├── PageHeader.tsx        # Page title + description
│   │   └── PageLayout.tsx        # Page shell
│   ├── features/
│   │   ├── archive/              # Archive listing components
│   │   │   ├── ArchiveListing.tsx # Main loop (WordPress-like)
│   │   │   ├── PostCard.tsx       # Single post card
│   │   │   ├── CoupletImage.tsx   # OG image with error fallback
│   │   │   ├── ResultCount.tsx    # "Showing X–Y of Z"
│   │   │   ├── SortControls.tsx   # Sort dropdown
│   │   │   ├── ContentNone.tsx    # Empty state
│   │   │   ├── InjectedMessage.tsx # Spiritual message injection
│   │   │   └── types.ts           # Archive component types
│   │   └── ViewTracker.tsx       # Client-side view tracking
│   ├── ui/                       # Reusable primitives
│   │   ├── Button.tsx            # Button + ButtonLink
│   │   ├── Combobox.tsx          # Autocomplete/search
│   │   ├── Input.tsx             # Text input
│   │   └── Pagination.tsx        # Page navigation
│   └── widgets/                  # Sidebar widgets
│
├── lib/
│   ├── server/                   # Server-only (never import in client!)
│   │   ├── couplets.ts           # All DB queries
│   │   ├── supabase.ts           # Supabase client singleton
│   │   ├── env.ts                # Server env vars
│   │   └── page-utils.ts         # Pagination + sort helpers
│   └── utils/                    # Client-safe utilities
│       ├── og-image.ts           # OG image URL builder
│       ├── seo.ts                # siteUrl(), getPermaLink()
│       ├── doha.tsx              # formatDoha() JSX helper
│       ├── fonts.ts              # Font configuration
│       ├── cn.ts                 # cn() classname utility
│       ├── meta.ts               # buildMetadata() helper
│       └── schema.ts            # Schema.org builders
│
├── constants/
│   ├── categories.ts            # 20 predefined categories
│   ├── navigation.ts            # NavLink definitions
│   └── ...other constants
│
└── types/
    └── index.ts                  # Post, Category, Tag, PaginationMeta, etc.
```

## Components

### ArchiveListing

The core archive loop — inspired by the WordPress loop. Handles:

- Post listing with `PostCard` components
- Injected spiritual messages between every 2 posts
- Sort dropdown + result count toolbar
- Empty state when no results
- Pagination
- Optional sidebar widget area

### PostCard

Single card in the archive listing:

- OG image from Supabase Storage (`couplet-images` bucket)
- Hindi doha heading (linked)
- Author + tags metadata
- Hindi/English meaning block
- Read More + Share actions

### CoupletImage

Lazy-loads OG images from Supabase Storage. Shows nothing (empty fragment) when:

- The image hasn't been generated yet (404)
- The image is still loading
- `NEXT_PUBLIC_SUPABASE_URL` is not configured

Uses `next/image` with `onError` for graceful degradation.

## View Tracking

Unique view counting via a cookie-based system:

- **Cookie**: `kabirdohehub_views` — 1-day expiry, `httpOnly`
- **Structure**: `{ h: "hash(ip+ua)", v: ["slug1", "slug2", ...] }`
- **Hash**: Simple non-crypto hash of `ip|user-agent` — no raw PII stored
- **Flow**:
  1. `ViewTracker` client component fires `POST /api/couplets/view` on mount
  2. API route reads cookie + request headers
  3. If new visitor or identity changed → increment + set new cookie
  4. Same visitor + new slug → append + increment
  5. Same visitor + already viewed → skip
- **Backend**: Supabase RPC `increment_couplet_view(p_slug)` (SECURITY DEFINER)

## Supabase

- **Client**: Anon key via `getSupabase()` singleton
- **Tables**: `posts`, `categories`, `tags`, `post_tags`
- **Storage**: `couplet-images` bucket for OG images
- **RPC**: `increment_couplet_view` for atomic view counting
- **Images**: Hosted at `{SUPABASE_URL}/storage/v1/object/public/couplet-images/{slug}.webp`

## OG Image Pipeline

Images are generated externally via the `api/` package scripts:

1. `couplets:images` — Generate 1200×630 JPEG originals (Puppeteer)
2. `couplets:images:optimize` — Compress to WebP (sharp, quality 85)
3. `couplets:images:upload` — Upload to Supabase Storage `couplet-images` bucket

The web app fetches them via `getOgImageUrl(slug)` which returns the public Storage URL.

## Development

```bash
cd web

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
```

## Environment Variables (`.env.development`)

| Variable                                       | Description          |
| ---------------------------------------------- | -------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Anon/publishable key |
| `NEXT_PUBLIC_SITE_URL`                         | Canonical site URL   |

## Design Preferences

- **Header**: Semantic `nav > ul > li > a`, dropdowns use `right-0` with 3-column grid
- **Icons**: `lucide-react` with `size` prop (not `className="size-4"`)
- **Pagination**: Left-aligned, icons-only prev/next, `bg-primary` for active
- **Categories**: Cards with `bg-card`, no border/rounded, `hover:shadow-xl`
- **Tags**: A–Z directory with jump nav, 3-column grid
- **Supabase queries**: `!inner` join only when filtering (avoids excluding unassigned posts)
