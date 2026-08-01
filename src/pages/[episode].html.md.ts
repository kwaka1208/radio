import { getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

import { cleanTranscript, generateEpisodeMarkdown } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import { getRssTranscriptText } from '../lib/transcript';
import starpodConfig from '../../starpod.config';

export async function getStaticPaths() {
  const allEpisodes = await getAllEpisodes();

  return allEpisodes.flatMap((episode) => {
    const paths = [
      {
        params: { episode: episode.episodeNumber },
        props: { episode }
      }
    ];

    // Also serve the slug route when it differs from the episode number
    // (the slug defaults to the number, which would duplicate the route).
    if (episode.episodeSlug !== episode.episodeNumber) {
      paths.push({
        params: { episode: episode.episodeSlug },
        props: { episode }
      });
    }

    return paths;
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { episode } = props;
  const show = await getShowInfo();

  // Check for transcript (same logic as [episode].astro)
  let transcriptContent = '';
  if (episode.episodeNumber && episode.episodeNumber !== 'Bonus') {
    const transcript = await getEntry('transcripts', episode.episodeNumber);
    if (transcript?.body) {
      // Clean the transcript by removing timestamps
      transcriptContent = cleanTranscript(transcript.body);
    }
  }

  // Fall back to the RSS feed's `<podcast:transcript>` when no explicit
  // markdown transcript exists for this episode.
  if (!transcriptContent) {
    transcriptContent = (await getRssTranscriptText(episode)) || '';
  }

  const markdown = generateEpisodeMarkdown(
    episode,
    show,
    starpodConfig,
    transcriptContent
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
