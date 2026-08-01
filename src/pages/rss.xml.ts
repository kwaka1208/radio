import type { APIRoute } from 'astro';

import { getAllEpisodes, getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

// The podcast RSS feed, generated from the local episode markdown files.
// Podcast apps subscribe to this URL (see starpod.config rssFeed).

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(value: string) {
  // A CDATA section cannot contain the sequence "]]>"; split it if present.
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();
  const episodes = await getAllEpisodes();
  const siteUrl = site!.toString();
  const author = starpodConfig.hosts.map((host) => host.name).join(', ');

  const items = episodes
    .map((episode) => {
      const pageUrl = new URL(`/${episode.episodeSlug}`, siteUrl).toString();
      return `    <item>
      <title>${escapeXml(episode.title)}</title>
      <link>${escapeXml(pageUrl)}</link>
      <guid isPermaLink="true">${escapeXml(pageUrl)}</guid>
      <pubDate>${new Date(episode.published).toUTCString()}</pubDate>
      <description>${cdata(episode.description)}</description>
      <content:encoded>${cdata(episode.content)}</content:encoded>
      <enclosure url="${escapeXml(episode.audio.src)}" type="${escapeXml(episode.audio.type)}" length="${episode.audioBytes ?? 0}"/>
      <itunes:episode>${episode.episodeNumber}</itunes:episode>
      <itunes:duration>${episode.duration}</itunes:duration>
      <itunes:explicit>false</itunes:explicit>${
        episode.episodeImage
          ? `\n      <itunes:image href="${escapeXml(new URL(episode.episodeImage, siteUrl).toString())}"/>`
          : ''
      }
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(show.title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(new URL('/rss.xml', siteUrl).toString())}" rel="self" type="application/rss+xml"/>
    <description>${cdata(show.description)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${escapeXml(show.image)}</url>
      <title>${escapeXml(show.title)}</title>
      <link>${escapeXml(siteUrl)}</link>
    </image>
    <itunes:author>${escapeXml(author)}</itunes:author>
    <itunes:summary>${cdata(show.description)}</itunes:summary>
    <itunes:image href="${escapeXml(show.image)}"/>
    <itunes:explicit>false</itunes:explicit>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
};
