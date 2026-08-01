import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const transcripts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/transcripts' }),
});

// One markdown file per episode. Frontmatter holds the metadata used for both
// the episode pages and the generated RSS feed; the body is the show notes.
const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: z.object({
    title: z.string(),
    episodeNumber: z.number().int().positive(),
    published: z.coerce.date(),
    /** Audio filename under /episodes/ on the server (e.g. "001.mp3"). */
    audio: z.string(),
    audioType: z.string().default('audio/mpeg'),
    /** File size in bytes for the RSS enclosure. 0 if unknown. */
    audioBytes: z.number().int().nonnegative().default(0),
    /** Episode length in seconds. */
    duration: z.number().int().positive(),
    /** Short plain-text summary for listings, meta tags, and the feed. */
    description: z.string(),
    /** Optional URL slug. Defaults to the episode number. */
    slug: z.string().optional(),
    /** Optional episode artwork URL. Falls back to the show image. */
    episodeImage: z.string().optional(),
    /**
     * Episode type for the feed (`<itunes:episodeType>`): a regular episode
     * (`full`), a `trailer`, or a `bonus` segment. Defaults to `full`.
     */
    episodeType: z.enum(['full', 'trailer', 'bonus']).default('full'),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  episodes,
  transcripts
};