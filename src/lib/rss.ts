import { getCollection } from 'astro:content';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

import starpodConfig from '../../starpod.config';

export interface Show {
  title: string;
  description: string;
  /** Site-facing cover art (OGP, header artwork, thumbnail fallback). */
  image: string;
  /** Podcast cover art for the RSS feed (itunes:image / channel image). */
  itunesImage: string;
  link: string;
}

export interface Episode {
  id: string;
  title: string;
  published: number;
  description: string;
  duration: number;
  content: string;
  episodeImage?: string;
  episodeNumber?: string;
  episodeSlug: string;
  episodeThumbnail?: string;
  audio: {
    src: string;
    type: string;
  };
  /** Size of the audio file in bytes, for the RSS enclosure. */
  audioBytes?: number;
  // A transcript referenced by the feed's `<podcast:transcript>` tag, if any.
  // Unused now that episodes are authored locally; kept for API compatibility.
  transcriptUrl?: string;
  transcriptType?: string;
}

const site = import.meta.env.SITE;

let showInfoCache: Show | null = null;

export async function getShowInfo() {
  if (showInfoCache) {
    return showInfoCache;
  }

  const showInfo: Show = {
    title: starpodConfig.title,
    description: starpodConfig.description,
    // Absolute URL: used in og:image and the RSS feed, which need one.
    image: new URL(starpodConfig.image, site).toString(),
    // Podcast cover art for the feed; falls back to the site image.
    itunesImage: new URL(
      starpodConfig.itunesImage ?? starpodConfig.image,
      site
    ).toString(),
    link: site
  };

  showInfoCache = showInfo;
  return showInfo;
}

let markdownProcessorPromise: ReturnType<
  typeof createMarkdownProcessor
> | null = null;

function getMarkdownProcessor() {
  markdownProcessorPromise ??= createMarkdownProcessor();
  return markdownProcessorPromise;
}

let episodesCache: Array<Episode> | null = null;

// Episodes are authored as markdown files in `src/content/episodes/` and the
// RSS feed is generated from them (src/pages/rss.xml.ts) — not the other way
// around.
export async function getAllEpisodes() {
  if (episodesCache) {
    return episodesCache;
  }

  const entries = await getCollection('episodes', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );

  const processor = await getMarkdownProcessor();

  const episodes: Array<Episode> = await Promise.all(
    entries.map(async (entry) => {
      const { data } = entry;
      const episodeNumber = `${data.episodeNumber}`;
      const episodeSlug = data.slug ?? episodeNumber;

      // Show notes: the markdown body rendered to HTML.
      const { code: content } = await processor.render(entry.body ?? '');

      return {
        id: episodeSlug,
        title: data.title,
        content,
        description: data.description,
        duration: data.duration,
        episodeImage: data.episodeImage,
        episodeNumber,
        episodeSlug,
        episodeThumbnail: data.episodeImage,
        published: data.published.getTime(),
        audio: {
          // Root-relative so the on-page player resolves it against whatever
          // host serves the page (localhost in dev, the site in prod). The RSS
          // feed / OGP / JSON-LD wrap this with `site` where an absolute URL is
          // required.
          src: `/episodes/${data.audio}`,
          type: data.audioType
        },
        audioBytes: data.audioBytes
      };
    })
  );

  // Newest first, matching the ordering the site previously got from the feed.
  episodes.sort((a, b) => b.published - a.published);

  episodesCache = episodes;
  return episodes;
}
