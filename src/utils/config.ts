export type Host = {
  /**
   * The name of the host
   */
  name: string;
  /**
   * A bio about the host to display
   */
  bio: string;
  /**
   * A url to an image to use for the host
   */
  img: string;
  /**
   * A url to the host's GitHub
   */
  github?: string;
  /**
   * A url to the host's Twitter
   */
  twitter?: string;
  /**
   * A url to the host's website
   */
  website?: string;
};

export type StarpodConfig = {
  /**
   * The name of your show. Used across the site and as the RSS channel title.
   */
  title: string;
  /**
   * A URL (or root-relative path) to your show's cover art. Used across the
   * site (OGP image, header artwork, episode-list thumbnail fallback).
   */
  image: string;
  /**
   * A URL (or root-relative path) to the podcast cover art used in the RSS
   * feed (`<itunes:image>` and the channel `<image>`). Podcast directories
   * (Apple, Spotify, etc.) require a large square image (1400–3000px). When
   * omitted, `image` is used.
   */
  itunesImage?: string;
  /**
   * A very short tagline for your show. Generally, no more than one sentence. Less is more here.
   */
  blurb: string;
  /**
   * A somewhat longer description of what your show is about. This should still ideally be fairly short, and should usually be 2-4 sentences.
   */
  description: string;
  /**
   * Apple Podcasts categories for the show. The first entry is the primary
   * category (required by Apple). Each entry is a top-level category and an
   * optional subcategory, emitted as nested `<itunes:category>` tags. Use the
   * exact category names from Apple's list (e.g. "Technology", "Education").
   */
  categories: Array<{ category: string; subcategory?: string }>;
  /**
   * A list of your show's hosts and their info.
   */
  hosts: Array<Host>;
  /**
   * Links to the platforms your show is available on.
   */
  platforms: {
    apple?: string;
    appleIdNumber?: string;
    overcast?: string;
    pocketCasts?: string;
    spotify?: string;
    youtube?: string;
  };
  /**
   * The url to the RSS feed where your podcast is hosted.
   */
  rssFeed: string;
};

export const defineStarpodConfig = (config: StarpodConfig) => config;
