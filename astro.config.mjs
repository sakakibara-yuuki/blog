import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";

import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  markdown: {
    remarkPlugins: [[ remarkToc, { heading: "contents" }]],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
    ],
  },
  integrations: [
    expressiveCode({
      themes: ['dracula'],
      plugins: [pluginLineNumbers()],
    })
  ]
});
