import {
  defineConfig,
  fontProviders,
  passthroughImageService
} from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';

import rehypeTranscriptTimestamps from './src/lib/rehype-transcript-timestamps.mjs';

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
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--astro-font-inter',
      formats: ['woff2'],
      styles: ['normal'],
      subsets: ['latin'],
      weights: ['300 900'],
      options: {
        experimental: {
          variableAxis: {
            opsz: ['14..32']
          }
        }
      }
    }
  ],
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
  site: 'https://radio.crssrds.jp',
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
