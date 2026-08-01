# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## What is this site?

A podcast website (originally based on the Starpod generator) for
`radio.crssrds.jp`. Episodes are authored locally as one markdown file each in
`src/content/episodes/`, and the site generates both the episode pages and the
podcast RSS feed (`/rss.xml`) from them. Show-level metadata lives in
`starpod.config.ts`.

## Commands

- **Dev server:** `pnpm dev` (runs on localhost:4321)
- **Build:** `pnpm build` (runs `astro check` then `astro build`)
- **Lint:** `pnpm lint` (ESLint with caching)
- **Lint fix:** `pnpm lint:fix`
- **All tests:** `pnpm test` (Vitest unit tests, single run)
- **Unit tests only:** `pnpm test:unit` (Vitest, watch mode)
- **Single unit test:** `pnpm exec vitest run tests/unit/Player.test.tsx`
- **Pre-deploy check:** `make check` (Lint + unit tests; also run automatically
  by `make release` before build)

## Architecture

### Framework Stack

- **Astro 7** with fully static output (no adapter), built to `dist/` and
  deployed to a self-hosted server (`radio.crssrds.jp`). Audio files are hosted
  on the same server and referenced from the RSS feed.
- **Preact** for interactive components (player, search)
- **Tailwind CSS v4** via Vite plugin
- **Valibot** for config validation

### Key Configuration

- `starpod.config.ts` — podcast metadata (hosts, platforms, RSS feed URL,
  description). Uses `defineStarpodConfig()` from `src/utils/config.ts` for type
  safety and validation.
- `astro.config.mjs` — Astro config with Preact and sitemap integrations. No
  server adapter (pure static). Image optimization is disabled via
  `passthroughImageService()`.

### Data Flow

Episodes are authored as markdown files in `src/content/episodes/` (the
`episodes` content collection, schema in `src/content.config.ts`). Frontmatter
holds title, episodeNumber, published date, audio filename (under `/episodes/`
on the server), duration (seconds), description, and optional slug/artwork;
the body is the show notes. `src/lib/rss.ts` exposes `getAllEpisodes()` /
`getShowInfo()` built from that collection plus `starpod.config.ts`, and
`src/pages/rss.xml.ts` generates the podcast RSS feed (`/rss.xml`, with
`<enclosure>` and `<itunes:*>` tags) from the same data. Audio files are NOT
in the repo — they are uploaded to the server's `dist/episodes/` directory,
which `make release` protects from deletion.

### Source Structure

- `src/pages/` — Astro pages and API routes. Dynamic episode pages use
  `[episode].astro`. LLM-friendly `.html.md.ts` endpoints generate markdown
  versions.
- `src/components/` — Mix of `.astro` (static) and `.tsx` (Preact interactive)
  components. The audio player (`src/components/player/`) and search dialog are
  Preact.
- `src/components/state.ts` — Preact signals for shared player state.
- `src/lib/` — Core utilities: RSS fetching, LLM content generation, and
  `episode-people.ts` (resolves hosts/guests/sponsors from `db/data/`).
- `src/content/episodes/` — One markdown file per episode (see Data Flow).
- `src/content/transcripts/` — Markdown transcript files named by episode
  number; when present, they render on the episode page with clickable
  `[HH:MM:SS]` timestamps that seek the player, via the
  `rehype-transcript-timestamps` plugin (registered in `astro.config.mjs`)
  plus the `episode/MarkdownTranscript` island. Note: changing that rehype
  plugin needs a dev server restart to take effect, since Astro's content
  render cache doesn't reload it on hot-reload. (An unused RSS-transcript
  fallback from the feed-driven era remains in `src/lib/transcript.ts`.)
- `src/layouts/Layout.astro` — Single shared layout.

### Testing

- **Unit tests** (`tests/unit/`): Vitest + jsdom + @testing-library/preact.
  Setup file at `tests/unit/test-setup.ts`.

### TypeScript

Strict mode with `baseUrl: "."` allowing bare `src/...` imports. JSX is
configured for Preact (`jsxImportSource: "preact"`).

## Environment Variables

- `PUBLIC_GA_ID` — Google Analytics 4 measurement ID (e.g., `G-XXXXXXXXXX`).
  When set at build time, `src/components/Analytics.astro` injects the GA
  snippet; when unset, no analytics are emitted.
- `STANDARD_SITE_DID` — Your ATProto DID for standard.site verification (e.g.,
  `did:plc:abc123`). Find yours at https://bsky.app/settings. Used by the
  in-site verification code (`src/lib/standardSite.ts`, the `.well-known`
  publication endpoint, and episode pages).
- `STANDARD_SITE_PUBLICATION_RKEY` — The standard.site publication record key,
  emitted by the `.well-known/site.standard.publication` endpoint.

(The ATProto episode-publishing scripts and their `ATPROTO_*` / `STANDARD_SITE_URL`
variables were removed; the site still emits standard.site verification metadata
when the two variables above are set.)
