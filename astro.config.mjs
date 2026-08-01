import { defineConfig, passthroughImageService } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';

import rehypeTranscriptTimestamps from './src/lib/rehype-transcript-timestamps.mjs';

// `astro dev` serves from localhost, so use a localhost `site` there and the
// production URL for `astro build`. This keeps absolute URLs (canonical,
// og:image, RSS, sitemap, …) pointing at the host actually serving the page.
const isDev = process.argv.includes('dev');
const DEV_PORT = 4321;

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'always'
  },
  markdown: {
    // Makes bracketed timestamps in markdown transcripts clickable for seeking.
    processor: unified({ rehypePlugins: [rehypeTranscriptTimestamps] })
  },
  experimental: {
    clientPrerender: true
  },
  image: {
    // Fully static build with no image optimization: emit images as-is.
    service: passthroughImageService(),
    remotePatterns: [
      {
        protocol: 'https'
      },
      {
        protocol: 'http'
      }
    ]
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  server: { port: DEV_PORT },
  site: isDev ? `http://localhost:${DEV_PORT}` : 'https://radio.crssrds.jp',
  trailingSlash: 'never',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        // Exclude episode number pages and only include slug pages.
        return !/^\/\d+\/?$/.test(pathname);
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
