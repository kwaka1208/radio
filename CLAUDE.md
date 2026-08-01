# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## What is Starpod?

Starpod is an open-source Astro-based podcast website generator. It creates a
full podcast site from an RSS feed and a `starpod.config.ts` configuration file.
The reference deployment is [whiskey.fm](https://whiskey.fm) (Whiskey Web and
Whatnot podcast).

## Commands

- **Dev server:** `pnpm dev` (runs on localhost:4321)
- **Build:** `pnpm build` (runs `astro check` then `astro build`)
- **Lint:** `pnpm lint` (ESLint with caching)
- **Lint fix:** `pnpm lint:fix`
- **All tests:** `pnpm test` (runs unit + e2e concurrently)
- **Unit tests only:** `pnpm test:unit` (Vitest)
- **Single unit test:** `pnpm exec vitest run tests/unit/Player.test.tsx`
- **E2E tests only:** `pnpm test:e2e` (Playwright, auto-starts dev server)

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

Episodes are fetched from the RSS feed at build time via `src/lib/rss.ts`.
Guest/sponsor data lives in `db/data/` as static TypeScript files (`people.ts`,
`people-per-episode.ts`, `sponsors.ts`, `sponsors-per-episode.ts`). At build
time, `src/lib/episode-people.ts` resolves each episode's hosts, guests, and
sponsors directly from those files — there is no database. (The `db/` directory
name is historical; it now only holds the static `data/` files.)

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
- `src/content/transcripts/` — Markdown transcript files named by episode
  number. When one is absent, the site falls back to the transcript referenced
  by the feed's `<podcast:transcript>` tag (fetched/parsed in
  `src/lib/transcript.ts`). Both sources render with clickable timestamps that
  seek the player: RSS paragraphs via the `episode/Transcript` island, and
  markdown `[HH:MM:SS]` timestamps via the `rehype-transcript-timestamps`
  plugin (registered in `astro.config.mjs`) plus the `episode/MarkdownTranscript`
  island. Note: changing that rehype plugin needs a dev server restart to take
  effect, since Astro's content render cache doesn't reload it on hot-reload.
- `src/layouts/Layout.astro` — Single shared layout.
- `db/data/` — Static TypeScript data files for episode guests and sponsors.

### Testing

- **Unit tests** (`tests/unit/`): Vitest + jsdom + @testing-library/preact.
  Setup file at `tests/unit/test-setup.ts`.
- **E2E tests** (`tests/e2e/`): Playwright testing against chromium, firefox,
  and webkit.

### TypeScript

Strict mode with `baseUrl: "."` allowing bare `src/...` imports. JSX is
configured for Preact (`jsxImportSource: "preact"`).

## Environment Variables

- `PUBLIC_GA_ID` — Google Analytics 4 measurement ID (e.g., `G-XXXXXXXXXX`).
  When set at build time, `src/components/Analytics.astro` injects the GA
  snippet; when unset, no analytics are emitted.
- `STANDARD_SITE_DID` — Your ATProto DID for standard.site verification (e.g.,
  `did:plc:abc123`). Find yours at https://bsky.app/settings.
- `STANDARD_SITE_PUBLICATION_RKEY` — The publication record key returned when
  creating a publication via `scripts/create-publication.ts`.
- `ATPROTO_HANDLE` — Your Bluesky handle (e.g., `you.bsky.social`) for
  publishing episodes to ATProto.
- `ATPROTO_APP_PASSWORD` — App password for ATProto API access. Create at
  https://bsky.app/settings/app-passwords.
- `STANDARD_SITE_URL` — Your podcast website URL (e.g., `https://whiskey.fm`)
  used as the publication site when publishing documents.
