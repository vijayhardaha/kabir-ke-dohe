# Kabir Dohe Hub

> Monorepo for the Kabir Dohe ecosystem — API, web app, and image generation tool.

Access 2500+ of Kabir Das's timeless couplets (dohas) with Hindi text, transliteration, translations, and interpretations. No authentication required.

## Packages

| Package                  | Path           | Description                                               |
| ------------------------ | -------------- | --------------------------------------------------------- |
| `@kabir-dohe-hub/api`         | `api/`         | RESTful API + documentation site for Kabir's couplets     |
| `@kabir-dohe-hub/web`         | `web/`         | Web application for reading and learning Kabir's couplets |
| `@kabir-dohe-hub/images-tool` | `images-tool/` | Image generation tool for visual quotes (placeholder)     |

## Ecosystem

| Project           | URL                                                              | Description                                          |
| ----------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Kabir Dohe Hub    | [kabirdohehub.vercel.app](https://kabirdohehub.vercel.app)       | Collection of Kabir ke dohe for reading and learning |
| Kabir Dohe API    | [kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)       | REST API for accessing couplets programmatically     |
| Kabir Dohe Images | [kabirdoheimages.vercel.app](https://kabirdoheimages.vercel.app) | Visual quotes and image generation                   |

## Tech Stack

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Framework   | Next.js 16 (App Router)    |
| Language    | TypeScript (strict mode)   |
| Database    | Supabase (PostgreSQL)      |
| Validation  | Zod                        |
| UI          | React 19 + Tailwind CSS v4 |
| Testing     | Vitest                     |
| Package Mgr | Bun (workspaces)           |
| Linting     | ESLint + Prettier          |
| Git Hooks   | Husky + commitlint         |

## Quick Start

```bash
# Install dependencies (from root)
bun install

# Start the API + web dev servers
bun run dev

# Or start individually
bun run dev:api    # http://localhost:3000
bun run dev:web    # http://localhost:3001
```

## Development Commands

```bash
bun run dev          # Start API + web dev servers
bun run build        # Build API + web for production
bun run lint         # Lint all packages
bun run lint:fix     # Auto-fix lint issues
bun run tsc          # TypeScript type check (all packages)
bun run format       # Format files with Prettier
bun run format:check # Check formatting
```

## Data Pipeline (api/)

The `api/` package includes several CLI scripts for managing couplet data and images:

```bash
# Couplet data
bun run couplets:fetch              # Fetch slugs & texts from Supabase → output/data/couplets.json
bun run couplets:fetch:prod         # Same, but using .env.production
bun run couplets:upload             # Upload couplets from Google Sheets to Supabase
bun run couplets:upload:prod        # Same, production mode

# OG image generation
bun run couplets:images --all       # Generate JPEG images for all couplets
bun run couplets:images <slug>      # Generate image for a single slug
bun run couplets:images:optimize    # Optimize JPEGs → WebP via sharp
bun run couplets:images:upload      # Upload optimized WebP to Supabase Storage
bun run couplets:images:upload:prod # Upload to production bucket

# Template development
bun run couplets:template:serve     # Dev server on :2580, live-reloads on .hbs edits
```

See [api/README.md](api/README.md) for detailed documentation.

## Project Structure

```
kabir-dohe-hub/
├── api/                  # Next.js API + documentation site
│   ├── src/              # App Router pages, API routes, components
│   ├── scripts/          # CLI scripts (data sync, image generation)
│   ├── supabase/         # Migrations & config
│   └── public/           # Static assets
├── web/                  # Next.js web application
│   └── src/              # App Router pages, components, utilities
├── images-tool/          # Image generation tool (placeholder)
├── .husky/               # Git hooks
└── package.json          # Root workspace config
```

## View Tracking

The web app tracks unique couplet views using a cookie-based system:

- Cookie `kabirdohehub_views` stores `{ h: hash(ip+ua), v: [slug1, slug2, ...] }`
- Hash prevents storing raw IP/User-Agent PII
- Same visitor viewing the same couplet within 24h is not double-counted
- RPC function `increment_couplet_view()` atomically updates `view_count`

## Supabase

- **Anon key** used for public reads (web app, API docs)
- **Service role key** used for scripts (data sync, image uploads)
- Storage bucket `couplet-images` stores optimized WebP OG images

## Contributing

See [CONTRIBUTING.md](api/docs/CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
