# Kabir Hub

Monorepo for the Kabir Dohe ecosystem — API, web app, and image generation tool.

## Packages

| Package                  | Path           | Description                                                            |
| ------------------------ | -------------- | ---------------------------------------------------------------------- |
| `@kabir-hub/api`         | `api/`         | [RESTful API + documentation site](api/README.md) for Kabir's couplets |
| `@kabir-hub/web`         | `web/`         | Web application for reading and learning Kabir's couplets              |
| `@kabir-hub/images-tool` | `images-tool/` | Visual quotes and image generation                                     |

## About

Kabir Dohe API lets you fetch, search, and filter Kabir's timeless couplets in JSON format. Each doha includes the original Hindi text, English transliteration, and detailed meanings. No authentication required.

See the **[API README](api/README.md)** for full documentation, endpoints, parameters, and usage examples.

## Ecosystem

| Project           | URL                                                              | Description                                          |
| ----------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Kabir Dohe Hub    | [kabirdohehub.vercel.app](https://kabirdohehub.vercel.app)       | Collection of Kabir ke dohe for reading and learning |
| Kabir Dohe API    | [kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)       | REST API for accessing couplets programmatically     |
| Kabir Dohe Images | [kabirdoheimages.vercel.app](https://kabirdoheimages.vercel.app) | Visual quotes and image generation                   |

## Features

- Access 2500+ couplets with Hindi text, translations, and interpretations
- Search by keyword across couplet content
- Filter by tags, categories, and popularity
- Sort and paginate results
- Completely free to use, no authentication needed

## Quick Start

```bash
# Install dependencies (from root)
bun install

# Start the API development server
bun run dev
```

```http
GET https://kabirdoheapi.vercel.app/api/couplets
```

Full documentation with all parameters, examples, and response formats is available at **[kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)** or in the **[API README](api/README.md)**.

## Development

### Root-Level Commands

```bash
bun run dev            # Start API dev server
bun run build          # Build API for production
bun run test           # Run API tests
bun run tsc            # TypeScript type check (API)
bun run lint           # Lint API
bun run format         # Format all files with Prettier
```

### Workspace-Specific Commands

```bash
bun run --filter=api <script>
cd api && bun run <script>
```

## Contributing

We welcome contributions from everyone. Whether you are a developer or not, you can help improve the couplet data, translations, and documentation.

See [CONTRIBUTING.md](api/docs/CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
