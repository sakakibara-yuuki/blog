// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import solidJs from '@astrojs/solid-js';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  redirects: {"/": "/blog/1"},
  integrations: [solidJs({ devtools: true }), db()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});
